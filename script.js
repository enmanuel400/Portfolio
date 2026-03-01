// --- SISTEMA DE VENTANAS & DRAG ---
function openWindow(id) {
    const win = document.getElementById(id);
    if (!win.classList.contains('active')) {
        win.classList.add('active');
        setTimeout(() => {
            if (!win.style.left) {
                win.style.left = `${(window.innerWidth/2) - (win.offsetWidth/2)}px`;
                win.style.top = `${(window.innerHeight/2) - (win.offsetHeight/2)}px`;
            }
        }, 0);
    }
    focusWindow(win);
}

function closeWindow(id) { document.getElementById(id).classList.remove('active'); }
function focusWindow(win) {
    document.querySelectorAll('.window').forEach(w => w.style.zIndex = "10");
    win.style.zIndex = "50";
}

let activeWindow = null;
let offset = { x: 0, y: 0 };

document.querySelectorAll('.window-header').forEach(header => {
    header.addEventListener('mousedown', (e) => {
        if (e.button !== 0) return;
        activeWindow = header.parentElement;
        focusWindow(activeWindow);
        const rect = activeWindow.getBoundingClientRect();
        offset.x = e.clientX - rect.left;
        offset.y = e.clientY - rect.top;
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', stopDrag);
        e.preventDefault();
    });
});

function drag(e) {
    if (activeWindow) {
        activeWindow.style.left = `${e.clientX - offset.x}px`;
        activeWindow.style.top = `${e.clientY - offset.y}px`;
    }
}

function stopDrag() { activeWindow = null; document.removeEventListener('mousemove', drag); }

// --- LÓGICA DE SINCRONIZACIÓN (PYTHON + MOBILE DARK) ---
function runPythonScript() {
    const output = document.getElementById('python-output');
    const mobileStatus = document.getElementById('mobile-status');
    const mobileLogs = document.getElementById('mobile-logs');
    const efficiency = document.getElementById('efficiency-val');
    const graph = document.getElementById('mini-graph');

    output.innerHTML = '<p class="text-blue-400 font-bold">>>> Iniciando Python 3.12 Engine...</p>';
    mobileLogs.innerHTML = '';

    const steps = [
        { t: "[OK] Analizando Dataset Ventas", log: "Data Recieved", eff: "24%" },
        { t: "[OK] Limpiando Valores Nulos", log: "ETL Cleaning", eff: "56%" },
        { t: "[INFO] Procesando con NumPy", log: "Compute Matrix", eff: "89%" },
        { t: ">>> COMPLETO: Reporte Generado", log: "Sync Finished", eff: "98.4%" }
    ];

    steps.forEach((step, i) => {
        setTimeout(() => {
            // Update Terminal
            const p = document.createElement('p');
            p.className = "mt-2 text-slate-300";
            p.innerText = step.t;
            output.appendChild(p);
            output.scrollTop = output.scrollHeight;

            // Update Mobile
            efficiency.innerText = step.eff;
            mobileStatus.innerHTML = '● ACTIVE';
            mobileStatus.className = 'text-[11px] bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full font-bold animate-pulse border border-emerald-500/30';

            const logEntry = document.createElement('div');
            logEntry.className = "log-entry";
            logEntry.innerHTML = `<span>${step.log}</span> <span class="text-blue-400 text-xs tracking-widest">LIVE</span>`;
            mobileLogs.prepend(logEntry);

            // Animate graph
            graph.children[i].className = "bg-blue-500 w-full rounded-md transition-all duration-700 shadow-[0_0_15px_rgba(59,130,246,0.5)]";
            graph.children[i].style.height = step.eff;

        }, (i + 1) * 800);
    });
}

// --- CLOCK & TERMINAL ---
function updateClock() {
    const now = new Date();
    document.getElementById('clock').innerText = now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
}
setInterval(updateClock, 1000); updateClock();

const input = document.getElementById('command-input');
const history = document.getElementById('history');

input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        const cmd = input.value.trim().toLowerCase();
        const line = document.createElement('p');
        line.innerHTML = `<span class="text-emerald-500 font-bold">➜</span> ${cmd}`;
        history.appendChild(line);

        if (cmd === 'help') {
            const h = document.createElement('div');
            h.className = "text-slate-400 text-base pl-4 mt-1";
            h.innerHTML = "• about<br>• skills<br>• run-automator<br>• clear";
            history.appendChild(h);
        } else if (cmd === 'run-automator') {
            openWindow('python-window');
            runPythonScript();
        } else if (cmd === 'clear') {
            history.innerHTML = '';
        }
        input.value = '';
        document.getElementById('terminal-scroll').scrollTop = history.scrollHeight;
    }
});