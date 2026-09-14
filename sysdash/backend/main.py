import subprocess
import sys
import time
import platform
from datetime import datetime, timezone
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import psutil

app = FastAPI(title="Multiplatform System Dashboard API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

IS_WINDOWS = sys.platform.startswith("win")
IS_LINUX = sys.platform.startswith("linux")
PROCESS_LIMIT = 10
network_snapshot = None
network_snapshot_time = None


@app.get("/api/metrics")
def get_system_metrics():
  global network_snapshot, network_snapshot_time

  # psutil maneja la abstracción de forma nativa para Windows y Linux
  cpu_usage = psutil.cpu_percent(interval=0.5)
  memory = psutil.virtual_memory()
  disk = psutil.disk_usage("C:\\" if IS_WINDOWS else "/")
  now = time.monotonic()
  network = psutil.net_io_counters()
  elapsed = now - network_snapshot_time if network_snapshot_time else 0
  upload_rate = ((network.bytes_sent - network_snapshot.bytes_sent) / elapsed) if elapsed > 0 else 0
  download_rate = ((network.bytes_recv - network_snapshot.bytes_recv) / elapsed) if elapsed > 0 else 0
  network_snapshot = network
  network_snapshot_time = now

  temperatures = []
  try:
    for sensor_name, readings in psutil.sensors_temperatures().items():
      for reading in readings:
        temperatures.append({
            "sensor": sensor_name,
            "label": reading.label or sensor_name,
            "current": reading.current,
            "high": reading.high,
            "critical": reading.critical,
        })
  except (AttributeError, OSError):
    temperatures = []

  boot_timestamp = psutil.boot_time()

  return {
      "os": platform.system(),
      "os_version": platform.platform(),
      "hostname": platform.node(),
      "boot_time": datetime.fromtimestamp(boot_timestamp, timezone.utc).isoformat(),
      "uptime_seconds": max(0, time.time() - boot_timestamp),
      "cpu": cpu_usage,
      "memory": {
          "total": memory.total,
          "available": memory.available,
          "percent": memory.percent,
      },
      "disk": {
          "total": disk.total,
          "used": disk.used,
          "free": disk.free,
          "percent": disk.percent,
      },
      "network": {
          "upload_bytes_per_second": max(0, upload_rate),
          "download_bytes_per_second": max(0, download_rate),
          "bytes_sent": network.bytes_sent,
          "bytes_recv": network.bytes_recv,
      },
      "temperatures": temperatures,
  }


@app.get("/api/processes")
def get_processes(sort_by: str = "cpu", limit: int = PROCESS_LIMIT):
  if sort_by not in {"cpu", "memory"}:
    raise HTTPException(status_code=400, detail="sort_by debe ser 'cpu' o 'memory'.")
  limit = max(5, min(limit, PROCESS_LIMIT))
  processes = []
  for process in psutil.process_iter(["pid", "name", "username", "memory_percent"]):
    try:
      processes.append({
          "pid": process.info["pid"],
          "name": process.info["name"] or "desconocido",
          "username": process.info["username"] or "-",
          "cpu_percent": process.cpu_percent(interval=0.05),
          "memory_percent": process.info["memory_percent"] or 0,
      })
    except (psutil.NoSuchProcess, psutil.AccessDenied, psutil.ZombieProcess):
      continue
  key = "cpu_percent" if sort_by == "cpu" else "memory_percent"
  processes.sort(key=lambda item: item[key], reverse=True)
  return {"sort_by": sort_by, "processes": processes[:limit]}


@app.post("/api/processes/{pid}/terminate")
def terminate_process(pid: int):
  if pid <= 0 or pid == psutil.Process().pid:
    raise HTTPException(status_code=400, detail="No se puede terminar este proceso.")
  try:
    process = psutil.Process(pid)
    process.terminate()
    try:
      process.wait(timeout=2)
    except psutil.TimeoutExpired:
      raise HTTPException(status_code=409, detail="El proceso no terminó dentro del tiempo permitido.")
    return {"success": True, "pid": pid, "message": f"Proceso {pid} terminado."}
  except psutil.NoSuchProcess:
    raise HTTPException(status_code=404, detail="El proceso ya no existe.")
  except psutil.AccessDenied:
    raise HTTPException(status_code=403, detail="Permiso insuficiente para terminar el proceso.")


@app.get("/api/services/{service_name}")
def check_service_status(service_name: str):
  try:
    if IS_LINUX:
      # En Linux usamos systemctl
      result = subprocess.run(
          ["systemctl", "is-active", service_name],
          capture_output=True,
          text=True,
          check=False,
      )
      status = result.stdout.strip()
    elif IS_WINDOWS:
      # En Windows usamos PowerShell para verificar el estado de un servicio
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
      # El estado devuelto por PowerShell puede ser 'Running', 'Stopped', etc.
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
  except Exception as e:
    raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/clean/cache")
def clean_system_cache():
  try:
    if IS_LINUX:
      # Limpieza de logs en Linux
      subprocess.run(
          ["journalctl", "--vacuum-time=7d"],
          capture_output=True,
          text=True,
          check=True,
      )
      msg = "Caché de logs de systemd limpiada en Linux."
    elif IS_WINDOWS:
      # Limpieza equivalente en Windows (ej: vaciar temporales de usuario de forma segura)
      # Nota: En producción es mejor manejar rutas relativas de temp del sistema
      msg = (
          "Comando de limpieza adaptado para Windows listo para ejecutarse."
      )
    else:
      msg = "Sistema operativo no compatible para esta tarea."

    return {"success": True, "message": msg}
  except subprocess.CalledProcessError as e:
    raise HTTPException(status_code=500, detail=e.stderr)