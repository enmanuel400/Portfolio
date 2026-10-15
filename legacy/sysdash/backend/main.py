"""
Sysdash backend — API de telemetría del sistema.

FastAPI sirve el dashboard (frontend/index.html) en la raíz y expone las
métricas del sistema. Un sampler en segundo plano muestrea CPU, memoria,
disco, red y procesos cada segundo para que las respuestas de la API sean
instantáneas y estables (sin bloqueos por petición).
"""

import platform
import subprocess
import sys
import threading
import time
from contextlib import asynccontextmanager
from datetime import datetime, timezone
from pathlib import Path

import psutil
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse

IS_WINDOWS = sys.platform.startswith("win")
IS_LINUX = sys.platform.startswith("linux")
PROCESS_LIMIT_MAX = 25
FRONTEND_INDEX = Path(__file__).resolve().parent.parent / "frontend" / "index.html"

SAMPLER_INTERVAL = 1.0
PROCESS_SAMPLE_EVERY = 2  # muestrear procesos cada N ticks del sampler


def _read_pretty_name() -> str:
    """Nombre amigable del sistema para Linux (/etc/os-release)."""
    try:
        if IS_LINUX:
            with open("/etc/os-release", encoding="utf-8") as f:
                for line in f:
                    if line.startswith("PRETTY_NAME="):
                        return line.split("=", 1)[1].strip().strip('"')
    except OSError:
        pass
    return platform.system()


def _base_system_info() -> dict:
    boot_ts = psutil.boot_time()
    return {
        "os": platform.system(),
        "os_name": _read_pretty_name(),
        "os_version": platform.platform(),
        "hostname": platform.node(),
        "boot_time": datetime.fromtimestamp(boot_ts, timezone.utc).isoformat(),
    }


class Sampler(threading.Thread):
    """Muestrea el sistema en segundo plano y mantiene una instantánea cacheada."""

    def __init__(self):
        super().__init__(daemon=True, name="sysdash-sampler")
        self._stop = threading.Event()
        self.lock = threading.Lock()
        self.snapshot = {
            "ready": False,
            "error": None,
            "total_processes": 0,
            "sampled_at": None,
            "uptime_seconds": 0.0,
            "cpu": 0.0,
            "cpu_cores": psutil.cpu_count() or 1,
            "cpu_per_core": [],
            "memory": None,
            "swap": None,
            "disk": None,
            "disk_io": {"read_bytes_per_second": 0.0, "write_bytes_per_second": 0.0},
            "network": {
                "upload_bytes_per_second": 0.0,
                "download_bytes_per_second": 0.0,
                "bytes_sent": 0,
                "bytes_recv": 0,
            },
            "temperatures": [],
            "processes": [],
        }
        self.snapshot.update(_base_system_info())

        # Estado interno del hilo (solo lo usa el propio sampler)
        self._prev_net = None
        self._prev_net_time = None
        self._prev_io = None
        self._proc_handles = {}
        self._ticks = 0

    def stop(self):
        self._stop.set()

    # ------------------------------------------------------------------ loop

    def run(self):
        # Llamadas "calientes" para dar línea base a cpu_percent y a los procesos.
        psutil.cpu_percent(interval=None)
        psutil.cpu_percent(interval=None, percpu=True)
        self._warm_processes()
        while not self._stop.is_set():
            try:
                self._tick()
            except Exception as exc:  # noqa: BLE001 — nunca tumbar el hilo
                with self.lock:
                    self.snapshot["error"] = str(exc)
            time.sleep(SAMPLER_INTERVAL)

    # ------------------------------------------------------------- muestreo

    def _warm_processes(self):
        for proc in psutil.process_iter(["pid"]):
            try:
                self._handles(proc).cpu_percent(interval=None)
            except (psutil.NoSuchProcess, psutil.AccessDenied, psutil.ZombieProcess):
                self._proc_handles.pop(proc.info["pid"], None)

    def _handles(self, proc):
        pid = proc.info["pid"]
        handle = self._proc_handles.get(pid)
        if handle is None:
            handle = proc
            self._proc_handles[pid] = handle
        return handle

    def _tick(self):
        now = time.monotonic()
        self._ticks += 1
        dt = 0.0
        had_previous = self._prev_net is not None and self._prev_net_time is not None

        net = psutil.net_io_counters()
        io = psutil.disk_io_counters()

        if had_previous:
            dt = max(0.0001, now - self._prev_net_time)
            down = max(0.0, (net.bytes_recv - self._prev_net.bytes_recv) / dt)
            up = max(0.0, (net.bytes_sent - self._prev_net.bytes_sent) / dt)
            disk_read = max(0.0, (io.read_bytes - self._prev_io.read_bytes) / dt)
            disk_write = max(0.0, (io.write_bytes - self._prev_io.write_bytes) / dt)
        else:
            down = up = disk_read = disk_write = 0.0
        self._prev_net, self._prev_net_time, self._prev_io = net, now, io

        cpu = psutil.cpu_percent(interval=None)
        cores = psutil.cpu_percent(interval=None, percpu=True)
        memory = psutil.virtual_memory()

        try:
            swap = psutil.swap_memory()
            swap_data = {
                "total": swap.total,
                "used": swap.used,
                "free": swap.free,
                "percent": swap.percent,
            }
        except (AttributeError, OSError):
            swap_data = None

        disk = psutil.disk_usage("C:\\" if IS_WINDOWS else "/")
        boot_ts = psutil.boot_time()

        snapshot = {
            "ready": True,
            "error": None,
            "total_processes": len(self._proc_handles),
            "sampled_at": datetime.now(timezone.utc).isoformat(),
            "uptime_seconds": max(0.0, time.time() - boot_ts),
            "cpu": cpu,
            "cpu_cores": psutil.cpu_count() or len(cores) or 1,
            "cpu_per_core": cores,
            "memory": {
                "total": memory.total,
                "available": memory.available,
                "used": memory.total - memory.available,
                "percent": memory.percent,
            },
            "swap": swap_data,
            "disk": {
                "total": disk.total,
                "used": disk.used,
                "free": disk.free,
                "percent": disk.percent,
            },
            "disk_io": {
                "read_bytes_per_second": disk_read,
                "write_bytes_per_second": disk_write,
            },
            "network": {
                "upload_bytes_per_second": up,
                "download_bytes_per_second": down,
                "bytes_sent": net.bytes_sent,
                "bytes_recv": net.bytes_recv,
            },
            "temperatures": self._read_temps(),
        }

        # Procesos: cada N ticks (reusa instancias de Process para medir CPU).
        if self._ticks % PROCESS_SAMPLE_EVERY == 1:
            snapshot["processes"] = self._sample_processes()

        with self.lock:
            self.snapshot.update(snapshot)

    def _read_temps(self):
        temps = []
        try:
            for sensor_name, readings in psutil.sensors_temperatures().items():
                for reading in readings:
                    temps.append(
                        {
                            "sensor": sensor_name,
                            "label": reading.label or sensor_name,
                            "current": reading.current,
                            "high": reading.high,
                            "critical": reading.critical,
                        }
                    )
        except (AttributeError, OSError):
            temps = []
        return temps

    def _sample_processes(self):
        procs = []
        seen = set()
        for proc in psutil.process_iter(["pid", "name", "username", "memory_percent"]):
            pid = proc.info["pid"]
            seen.add(pid)
            try:
                handle = self._handles(proc)
                procs.append(
                    {
                        "pid": pid,
                        "name": proc.info["name"] or "desconocido",
                        "username": proc.info["username"] or "-",
                        "cpu_percent": handle.cpu_percent(interval=None),
                        "memory_percent": proc.info["memory_percent"] or 0.0,
                    }
                )
            except (psutil.NoSuchProcess, psutil.AccessDenied, psutil.ZombieProcess):
                self._proc_handles.pop(pid, None)
        for pid in [p for p in self._proc_handles if p not in seen]:
            self._proc_handles.pop(pid, None)
        return procs

    # --------------------------------------------------------------- lectura

    def get(self):
        with self.lock:
            return {k: v for k, v in self.snapshot.items() if k != "processes"}

    def get_processes(self, sort_by: str, limit: int):
        with self.lock:
            procs = list(self.snapshot.get("processes", []))
        key = "cpu_percent" if sort_by == "cpu" else "memory_percent"
        procs.sort(key=lambda item: item.get(key, 0), reverse=True)
        return procs[:limit]


# --------------------------------------------------------------------- app

sampler = Sampler()


@asynccontextmanager
async def lifespan(_app: FastAPI):
    sampler.start()
    yield
    sampler.stop()


app = FastAPI(title="Sysdash API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:8000",
        "http://127.0.0.1:8000",
        "http://localhost",
        "http://127.0.0.1",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/", include_in_schema=False)
def index():
    return FileResponse(FRONTEND_INDEX, media_type="text/html")


@app.get("/api/health")
def health():
    return {"status": "ok", "time": datetime.now(timezone.utc).isoformat()}


def _require_ready() -> dict:
    data = sampler.get()
    if data.get("error"):
        raise HTTPException(status_code=503, detail=f"El muestreo falló: {data['error']}")
    if not data.get("ready"):
        raise HTTPException(status_code=503, detail="El sistema está muestreando por primera vez.")
    return data


@app.get("/api/metrics")
def get_system_metrics():
    return _require_ready()


@app.get("/api/processes")
def get_processes(sort_by: str = "cpu", limit: int = 10):
    if sort_by not in {"cpu", "memory"}:
        raise HTTPException(status_code=400, detail="sort_by debe ser 'cpu' o 'memory'.")
    limit = max(1, min(limit, PROCESS_LIMIT_MAX))
    procs = sampler.get_processes(sort_by, limit)
    return {"sort_by": sort_by, "limit": limit, "processes": procs}


@app.post("/api/processes/{pid}/terminate")
def terminate_process(pid: int, force: bool = False):
    current_pid = psutil.Process().pid
    if pid <= 0 or pid == current_pid:
        raise HTTPException(status_code=400, detail="No se puede terminar este proceso.")
    try:
        process = psutil.Process(pid)
        if force:
            process.kill()
        else:
            process.terminate()
        try:
            process.wait(timeout=3)
        except psutil.TimeoutExpired:
            raise HTTPException(
                status_code=409,
                detail="El proceso no terminó a tiempo. Puedes intentar con ?force=true (SIGKILL).",
            )
        mode = "forzado" if force else "terminado"
        return {"success": True, "pid": pid, "message": f"Proceso {pid} {mode} correctamente."}
    except psutil.NoSuchProcess:
        raise HTTPException(status_code=404, detail="El proceso ya no existe.")
    except psutil.AccessDenied:
        raise HTTPException(status_code=403, detail="Permiso insuficiente. Prueba ejecutar con permisos de administrador.")


@app.get("/api/services/{service_name}")
def check_service_status(service_name: str):
    try:
        if IS_LINUX:
            result = subprocess.run(
                ["systemctl", "is-active", service_name],
                capture_output=True,
                text=True,
                check=False,
            )
            stdout = result.stdout.strip()
            if result.returncode == 0 or stdout == "active":
                status = "active"
            elif stdout == "inactive" and result.returncode == 4:
                status = "not_found"
            elif stdout:
                status = stdout
            else:
                status = "unknown"
        elif IS_WINDOWS:
            cmd = (
                "Get-Service -Name"
                f" '{service_name}' -ErrorAction SilentlyContinue | Select-Object"
                " -ExpandProperty Status"
            )
            result = subprocess.run(
                ["powershell", "-Command", cmd],
                capture_output=True,
                text=True,
                check=False,
            )
            status = (
                "active"
                if "Running" in result.stdout
                else "inactive"
                if result.stdout
                else "not_found"
            )
        else:
            status = "unsupported_os"
        return {"service": service_name, "status": status}
    except FileNotFoundError:
        raise HTTPException(status_code=501, detail="Este sistema no usa systemd para gestionar servicios.")
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=500, detail=str(exc))


@app.post("/api/clean/cache")
def clean_system_cache():
    try:
        if IS_LINUX:
            subprocess.run(
                ["journalctl", "--vacuum-time=7d"],
                capture_output=True,
                text=True,
                check=True,
            )
            msg = "Logs de systemd anteriores a 7 días eliminados."
        elif IS_WINDOWS:
            msg = "Limpieza adaptada para Windows lista para ejecutarse (sin cambios aplicados)."
        else:
            msg = "Sistema operativo no compatible para esta tarea."
        return {"success": True, "message": msg}
    except subprocess.CalledProcessError as exc:
        raise HTTPException(status_code=500, detail=exc.stderr.strip() or "Comando de limpieza falló.")
    except FileNotFoundError:
        raise HTTPException(status_code=501, detail="journalctl no está disponible en este sistema.")