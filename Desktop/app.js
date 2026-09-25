/* ============================================================
   enmanuelOS v.02 — lógica del escritorio
   ============================================================ */

const $ = selector => document.querySelector(selector);
const $$ = selector => [...document.querySelectorAll(selector)];

const shell = $("#desktopShell");
const bootScreen = $("#bootScreen");
const toast = $("#toast");
const desktopArea = $("#desktopArea");
const winEls = $$(".windows");
const STORE = {
    wall: "enmanuelos.wall",
    icons: "enmanuelos.icons",
    winPos: "enmanuelos.windowsPos",
    notes: "enmanuelos.notas",
};

let zIndex = 100;
let toastTimer;
let activeWindow = null;
let movedIcon = false;
let bootTimer = null;
let bootSkipped = false;
const startTime = performance.now();

/* ---------- utilidades ---------- */

function showToast(message) {
    clearTimeout(toastTimer);
    toast.textContent = message;
    toast.classList.add("show");
    toastTimer = setTimeout(() => toast.classList.remove("show"), 2400);
}

function esc(string) {
    return String(string).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

function formatUptime() {
    const total = Math.floor((performance.now() - startTime) / 1000);
    const h = Math.floor(total / 3600);
    const m = Math.floor((total % 3600) / 60);
    const s = total % 60;
    return h > 0 ? `${h}h ${m}m` : `${m}m ${s}s`;
}

function resolution() {
    return `${window.innerWidth}×${window.innerHeight}`;
}

function readStorage(key) {
    try {
        return JSON.parse(localStorage.getItem(key));
    } catch {
        return null;
    }
}

function writeStorage(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch {
        /* almacenamiento no disponible */
    }
}

/* ---------- arranque ---------- */

const BOOT_STEPS = [
    ["cargando kernel", 0.24],
    ["montando unidades", 0.5],
    ["iniciando servicios gráficos", 0.78],
    ["sesión lista", 1],
];

const bootLine = $("#bootLine");
const bootFill = $("#bootFill");

function finishBoot() {
    if (bootSkipped) return;
    bootSkipped = true;
    clearTimeout(bootTimer);
    bootFill.style.width = "100%";
    bootLine.textContent = "sesión lista";
    setTimeout(() => {
        bootScreen.classList.add("done");
        document.body.classList.add("booted");
        $("#systemStatus").textContent = "sesión iniciada";
        showToast("Bienvenido a enmanuelOS");
    }, 420);
}

function runBoot() {
    bootSkipped = false;
    bootScreen.classList.remove("done");
    document.body.classList.remove("booted");
    bootFill.style.width = "0%";
    BOOT_STEPS.forEach(([label, progress], index) => {
        bootTimer = setTimeout(() => {
            if (bootSkipped) return;
            bootLine.textContent = label;
            bootFill.style.width = `${Math.round(progress * 100)}%`;
            if (index === BOOT_STEPS.length - 1) finishBoot();
        }, index * 540);
    });
}

bootScreen.addEventListener("click", finishBoot);

/* ---------- reloj / estado ---------- */

function updateClock() {
    const now = new Date();
    const time = now.toLocaleTimeString("es-VE", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false });
    const shortTime = now.toLocaleTimeString("es-VE", { hour: "2-digit", minute: "2-digit", hour12: false });
    const date = now.toLocaleDateString("es-VE", { day: "2-digit", month: "short" }).replace(".", "");
    $("#live-clock").textContent = time;
    $("#widgetTime").textContent = shortTime;
    $("#widgetDate").textContent = date.toUpperCase();
    $("#aboutUptime").textContent = formatUptime();
    $("#aboutRes").textContent = resolution();
}
setInterval(updateClock, 1000);
updateClock();

/* ---------- gestión de ventanas ---------- */

function getWin(id) {
    return document.getElementById(id);
}

function centerWindow(win) {
    const width = win.offsetWidth || 560;
    const height = win.offsetHeight || 420;
    win.style.left = `${Math.max(12, Math.round((window.innerWidth - width) / 2))}px`;
    win.style.top = `${Math.max(64, Math.round((window.innerHeight - height) / 2))}px`;
}

function clampWindow(win) {
    const rect = win.getBoundingClientRect();
    const maxX = window.innerWidth - rect.width - 12;
    const maxY = window.innerHeight - rect.height - 100;
    const left = parseInt(win.style.left, 10) || 12;
    const top = parseInt(win.style.top, 10) || 64;
    win.style.left = `${Math.max(12, Math.min(left, maxX))}px`;
    win.style.top = `${Math.max(64, Math.min(top, maxY))}px`;
}

function applyInitialPositions() {
    const stored = readStorage(STORE.winPos) || {};
    winEls.forEach(win => {
        const pos = stored[win.id];
        if (pos) {
            win.style.left = `${pos.x}px`;
            win.style.top = `${pos.y}px`;
            win.dataset.placed = "1";
        } else {
            centerWindow(win);
        }
    });
}

function persistWindowPos(win) {
    const stored = readStorage(STORE.winPos) || {};
    stored[win.id] = { x: parseInt(win.style.left, 10) || 0, y: parseInt(win.style.top, 10) || 0 };
    writeStorage(STORE.winPos, stored);
}

function focusWindow(win) {
    zIndex += 1;
    win.style.zIndex = zIndex;
    winEls.forEach(other => other.classList.toggle("focused", other === win));
    activeWindow = win.id;
}

function openWindow(id) {
    const win = getWin(id);
    if (!win) return;
    win.classList.remove("hidden", "minimized", "closing");
    win.classList.add("open");
    if (!win.dataset.placed) centerWindow(win);
    focusWindow(win);
    syncIndicators();
    if (id === "winTerm") setTimeout(() => $("#input-key")?.focus(), 60);
}

function minimizeWindow(id) {
    const win = getWin(id);
    win.classList.remove("open");
    win.classList.add("minimized");
    activeWindow = null;
    syncIndicators();
}

function restoreWindow(win) {
    win.classList.remove("minimized");
    win.classList.add("open");
    focusWindow(win);
    syncIndicators();
}

function closeWindow(id) {
    const win = getWin(id);
    if (!win || win.classList.contains("hidden")) return;
    win.classList.add("closing");
    win.classList.remove("open", "minimized");
    setTimeout(() => {
        if (!win.classList.contains("closing")) return; // se reabrió durante la animación
        win.classList.add("hidden");
        win.classList.remove("closing");
        if (activeWindow === id) activeWindow = null;
        syncIndicators();
    }, 210);
}

function toggleWindow(id) {
    const win = getWin(id);
    if (!win) return;
    if (win.classList.contains("hidden")) openWindow(id);
    else if (win.classList.contains("minimized")) restoreWindow(win);
    else if (win.classList.contains("open")) {
        if (activeWindow === id) minimizeWindow(id);
        else focusWindow(win);
    }
}

function closeAllWindows() {
    winEls.forEach(win => {
        win.classList.add("hidden");
        win.classList.remove("open", "minimized", "closing");
    });
    activeWindow = null;
    syncIndicators();
}

function syncIndicators() {
    $$("[data-indicator]").forEach(indicator => {
        const win = getWin(indicator.dataset.indicator);
        indicator.closest(".dock-button")?.classList.toggle("active", !!(win && !win.classList.contains("hidden")));
    });
}

/* controles de ventana */

$$("[data-open]").forEach(button => {
    if (button.closest(".dock-button") || button.classList.contains("desktop-icon")) return;
    button.addEventListener("click", () => openWindow(button.dataset.open));
});

$("#homeButton")?.addEventListener("click", () => {
    closeAllWindows();
    showToast("Escritorio despejado");
});

$$(".dock-button[data-open]").forEach(button =>
    button.addEventListener("click", () => toggleWindow(button.dataset.open)),
);

$("#powerButton")?.addEventListener("click", () => {
    showToast("Reiniciando sistema…");
    setTimeout(runBoot, 500);
});

$$(".btnClose").forEach(button =>
    button.addEventListener("click", event => {
        event.stopPropagation();
        closeWindow(button.dataset.target);
    }),
);

$$(".window-minimize").forEach(button =>
    button.addEventListener("click", event => {
        event.stopPropagation();
        minimizeWindow(button.closest(".windows").id);
    }),
);

$$(".window-maximize").forEach(button =>
    button.addEventListener("click", event => {
        event.stopPropagation();
        const win = button.closest(".windows");
        const isMaximized = win.classList.toggle("maximized");
        button.textContent = isMaximized ? "❐" : "▢";
        button.title = isMaximized ? "Restaurar" : "Maximizar";
        if (!isMaximized) {
            win.dataset.placed = "";
            centerWindow(win);
        } else {
            win.dataset.placed = "1";
        }
        focusWindow(win);
    }),
);

/* arrastre de ventanas */

winEls.forEach(win => {
    const header = win.querySelector(".window-header, .browser-header");
    if (!header) return;
    let dragging = false;
    let offsetX = 0;
    let offsetY = 0;

    header.addEventListener("pointerdown", event => {
        if (event.target.closest("button, input")) return;
        if (win.classList.contains("maximized")) return;
        event.preventDefault();
        const rect = win.getBoundingClientRect();
        dragging = true;
        offsetX = event.clientX - rect.left;
        offsetY = event.clientY - rect.top;
        win.classList.add("dragging");
        win.dataset.placed = "1";
        focusWindow(win);
    });

    document.addEventListener("pointermove", event => {
        if (!dragging) return;
        win.style.left = `${Math.max(12, Math.min(window.innerWidth - win.offsetWidth - 12, event.clientX - offsetX))}px`;
        win.style.top = `${Math.max(62, Math.min(window.innerHeight - win.offsetHeight - 96, event.clientY - offsetY))}px`;
    });

    document.addEventListener("pointerup", () => {
        if (!dragging) return;
        dragging = false;
        win.classList.remove("dragging");
        persistWindowPos(win);
    });
});

window.addEventListener("resize", () => {
    winEls.forEach(win => {
        if (win.classList.contains("open") && !win.classList.contains("maximized")) {
            if (win.dataset.placed) clampWindow(win);
            else centerWindow(win);
        }
    });
});

/* accesos del teclado */

document.addEventListener("keydown", event => {
    if (bootSkipped) {
        if (event.key === "Escape") {
            closeAllWindows();
            closeContextMenu();
            deselectIcons();
        }
        if (event.ctrlKey && event.key.toLowerCase() === "t") {
            event.preventDefault();
            openWindow("winTerm");
        }
        if (event.ctrlKey && event.key.toLowerCase() === "k") {
            event.preventDefault();
            openWindow("winKata");
        }
        if (event.ctrlKey && event.key.toLowerCase() === "n") {
            event.preventDefault();
            openWindow("winNotas");
        }
        if (event.key === "Enter" && document.activeElement?.classList.contains("desktop-icon")) {
            openWindow(document.activeElement.dataset.open);
        }
    }
    syncIndicators();
});

/* ---------- iconos del escritorio ---------- */

const desktopIcons = $$(".desktop-icon");
const desktopIconsBox = $("#desktopIcons");
const COARSE_POINTER = matchMedia("(pointer: coarse)").matches;

function selectIcon(icon) {
    desktopIcons.forEach(other => other.classList.toggle("selected", other === icon));
    icon.focus({ preventScroll: true });
}

function deselectIcons() {
    desktopIcons.forEach(icon => icon.classList.remove("selected"));
}

function applyIconPositions() {
    const stored = readStorage(STORE.icons) || {};
    desktopIcons.forEach(icon => {
        const pos = stored[icon.dataset.open];
        if (pos) {
            icon.style.position = "absolute";
            icon.style.left = `${pos.x}px`;
            icon.style.top = `${pos.y}px`;
        }
    });
}

function saveIconPositions() {
    const stored = {};
    desktopIcons.forEach(icon => {
        const x = parseInt(icon.style.left, 10);
        const y = parseInt(icon.style.top, 10);
        if (!Number.isNaN(x) && !Number.isNaN(y)) stored[icon.dataset.open] = { x, y };
    });
    writeStorage(STORE.icons, stored);
}

desktopIcons.forEach(icon => {
    let startX = 0;
    let startY = 0;
    let grabX = 0;
    let grabY = 0;
    let dragging = false;

    icon.addEventListener("pointerdown", event => {
        if (event.button !== 0 && event.pointerType !== "touch") return;
        startX = event.clientX;
        startY = event.clientY;
        const rect = icon.getBoundingClientRect();
        grabX = startX - rect.left;
        grabY = startY - rect.top;
        dragging = false;
        movedIcon = false;
        try {
            icon.setPointerCapture(event.pointerId);
        } catch {
            /* sin captura */
        }
    });

    icon.addEventListener("pointermove", event => {
        const dx = event.clientX - startX;
        const dy = event.clientY - startY;
        if (!dragging && Math.hypot(dx, dy) > 6) {
            dragging = true;
            movedIcon = true;
            icon.classList.add("dragging");
            const rect = icon.getBoundingClientRect();
            const cont = desktopIconsBox.getBoundingClientRect();
            icon.style.position = "absolute";
            icon.style.left = `${rect.left - cont.left}px`;
            icon.style.top = `${rect.top - cont.top}px`;
        }
        if (dragging) {
            const cont = desktopIconsBox.getBoundingClientRect();
            const maxX = cont.width - icon.offsetWidth - 6;
            const maxY = cont.height - icon.offsetHeight - 6;
            icon.style.left = `${Math.max(0, Math.min(maxX, event.clientX - cont.left - grabX))}px`;
            icon.style.top = `${Math.max(0, Math.min(maxY, event.clientY - cont.top - grabY))}px`;
        }
    });

    icon.addEventListener("pointerup", () => {
        if (dragging) {
            icon.classList.remove("dragging");
            saveIconPositions();
            setTimeout(() => {
                movedIcon = false;
            }, 40);
        }
    });

    if (COARSE_POINTER) {
        // táctil: un toque abre
        icon.addEventListener("click", () => {
            if (movedIcon) return;
            openWindow(icon.dataset.open);
        });
    } else {
        // ratón: clic selecciona, doble clic abre
        icon.addEventListener("click", event => {
            if (movedIcon) {
                event.preventDefault();
                return;
            }
            if (event.detail === 1) selectIcon(icon);
        });

        icon.addEventListener("dblclick", () => {
            if (movedIcon) return;
            openWindow(icon.dataset.open);
        });
    }
});

/* ---------- menú contextual y fondos ---------- */

const contextMenu = $("#contextMenu");

function openContextMenu(x, y) {
    contextMenu.hidden = false;
    requestAnimationFrame(() => {
        const menuRect = contextMenu.getBoundingClientRect();
        const left = Math.min(x, window.innerWidth - menuRect.width - 10);
        const top = Math.min(y, window.innerHeight - menuRect.height - 10);
        contextMenu.style.left = `${Math.max(6, left)}px`;
        contextMenu.style.top = `${Math.max(6, top)}px`;
    });
    deselectIcons();
}

function closeContextMenu() {
    contextMenu.hidden = true;
}

desktopArea.addEventListener("contextmenu", event => {
    event.preventDefault();
    openContextMenu(event.clientX, event.clientY);
});

document.addEventListener("pointerdown", event => {
    const host = event.target instanceof Element ? event.target : null;
    if (!contextMenu.hidden && !(host && contextMenu.contains(host))) closeContextMenu();
    const inIcon = host && host.closest(".desktop-icon");
    const inWindow = host && host.closest(".windows");
    if (!desktopIcons.includes(inIcon) && !inWindow) deselectIcons();
});

contextMenu.addEventListener("click", event => {
    const item = event.target.closest("[data-action]");
    if (!item) return;
    const action = item.dataset.action;
    if (action === "open") openWindow(item.dataset.open);
    if (action === "wall") setWall(item.dataset.wall);
    if (action === "closeAll") {
        closeAllWindows();
        showToast("Ventanas cerradas");
    }
    if (action === "reset") {
        writeStorage(STORE.icons, {});
        localStorage.removeItem(STORE.icons);
        localStorage.removeItem(STORE.winPos);
        desktopIcons.forEach(icon => {
            icon.style.position = "";
            icon.style.left = "";
            icon.style.top = "";
        });
        winEls.forEach(win => {
            win.dataset.placed = "";
            centerWindow(win);
        });
        showToast("Escritorio restaurado");
    }
    closeContextMenu();
});

const WALLS = ["noche", "bosque", "amanecer"];

function setWall(name) {
    if (!WALLS.includes(name)) return false;
    shell.classList.remove(...WALLS.map(w => `wall-${w}`));
    shell.classList.add(`wall-${name}`);
    writeStorage(STORE.wall, name);
    return true;
}

const savedWall = readStorage(STORE.wall) || "noche";
setWall(savedWall);

/* ---------- terminal ---------- */

const inputKey = $("#input-key");
const termHistory = $("#termHistory");
const commandHistory = [];
let historyIndex = -1;

function termPrint(raw, result, type = "ok") {
    const content = String(result).includes("\n")
        ? `<pre>${esc(result)}</pre>`
        : `<span class="term-${type}">${esc(result)}</span>`;
    termHistory.insertAdjacentHTML(
        "beforeend",
        `<p><span class="term-cmd">guest@enmanuelOS:~$ ${esc(raw)}</span><br />${content}</p>`,
    );
    termHistory.scrollTop = termHistory.scrollHeight;
}

const APP_NAMES = {
    proyectos: "winProyectos",
    terminal: "winTerm",
    contactos: "winContactos",
    kata: "winKata",
    notas: "winNotas",
    acerca: "winAcerca",
    info: "winAcerca",
};

const COMMAND_NAMES = [
    "help", "about", "proyectos", "contactos", "kata", "notas", "acerca",
    "open", "wallpaper", "fondo", "neofetch", "echo", "whoami", "ls", "date", "uptime", "clear",
];

function executeCommand(raw) {
    const parts = raw.trim().split(/\s+/);
    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1);

    switch (cmd) {
        case "help":
            return [
                "Comandos disponibles:",
                "  about           · sobre mí",
                "  proyectos       · abre el directorio de proyectos",
                "  contactos       · abre canales de contacto",
                "  kata            · abre el navegador de escritorio",
                "  notas           · abre el editor de notas",
                "  acerca | info   · abre info del sistema",
                "  open <app>      · abre una aplicación (proyectos, terminal, kata, notas…)",
                "  wallpaper <1|2|3> · cambia el fondo de pantalla",
                "  neofetch        · info del sistema",
                "  echo <texto>    · repite texto",
                "  whoami · ls · date · uptime · clear",
            ].join("\n");
        case "about":
            return "Diseño y desarrollo de productos digitales desde Venezuela. Interfaces premium, dashboards técnicos y experiencias web con foco en claridad y conversión.";
        case "proyectos":
            openWindow("winProyectos");
            return "Abriendo el directorio de proyectos…";
        case "contactos":
            openWindow("winContactos");
            return "Abriendo canales de contacto…";
        case "kata":
            openWindow("winKata");
            return "kata — navegador de escritorio local, privado y silencioso.";
        case "notas":
            openWindow("winNotas");
            return "Abriendo el editor de notas…";
        case "acerca":
        case "info":
            openWindow("winAcerca");
            return "Abriendo info del sistema…";
        case "open": {
            const target = APP_NAMES[args[0]?.toLowerCase()];
            if (!target) return `No existe la aplicación: ${args[0] || ""}`;
            openWindow(target);
            return `Abriendo ${args[0]}…`;
        }
        case "wallpaper":
        case "fondo": {
            const map = { "1": "noche", "2": "bosque", "3": "amanecer", noche: "noche", bosque: "bosque", amanecer: "amanecer" };
            const wall = map[args[0]?.toLowerCase()];
            if (!wall) return "Uso: wallpaper <1|2|3> (noche, bosque, amanecer)";
            setWall(wall);
            return `Fondo cambiado a «${wall}».`;
        }
        case "neofetch":
            return [
                "        .:::.",
                "      .:::::::.",
                "     :::::::::::",
                "    ':::::::::::'",
                "      '::::::::'",
                "        '::::'",
                "",
                `usuario    guest@enmanuelOS`,
                `SO         enmanuelOS v1.0`,
                `kernel     6.6.0-desktop`,
                `shell      bash — sesión interactiva`,
                `uptime     ${formatUptime()}`,
                `resolución ${resolution()}`,
                `tema       ${shell.classList.value.match(/wall-(\w+)/)?.[1] || "noche"}`,
            ].join("\n");
        case "echo":
            return args.join(" ") || "";
        case "whoami":
            return "guest";
        case "ls":
            return "proyectos/  terminal/  kata/  contactos/  notas/  acerca/";
        case "date":
            return new Date().toLocaleString("es-VE", { dateStyle: "full", timeStyle: "short" });
        case "uptime":
            return `El sistema lleva activo ${formatUptime()}.`;
        case "clear":
            termHistory.innerHTML = '<p class="term-welcome">enmanuelOS terminal [versión 1.0]<br />Escribe <strong>help</strong> para ver los comandos disponibles.</p>';
            return null;
        default:
            return `Comando no reconocido: ${raw}`;
    }
}

inputKey?.addEventListener("keydown", event => {
    if (event.key === "Enter") {
        const raw = inputKey.value.trim();
        if (!raw) return;
        commandHistory.push(raw);
        historyIndex = commandHistory.length;
        const result = executeCommand(raw);
        if (result !== null && result !== undefined) {
            const isErr = /^Comando no reconocido|^No existe/.test(result);
            termPrint(raw, result, isErr ? "err" : "ok");
        }
        inputKey.value = "";
    } else if (event.key === "ArrowUp") {
        event.preventDefault();
        if (commandHistory.length === 0) return;
        historyIndex = Math.max(0, historyIndex - 1);
        inputKey.value = commandHistory[historyIndex];
    } else if (event.key === "ArrowDown") {
        event.preventDefault();
        historyIndex = Math.min(commandHistory.length, historyIndex + 1);
        inputKey.value = historyIndex === commandHistory.length ? "" : commandHistory[historyIndex];
    } else if (event.key === "Tab") {
        event.preventDefault();
        const value = inputKey.value.trim().toLowerCase();
        if (!value) return;
        const candidates = COMMAND_NAMES.filter(name => name.startsWith(value));
        if (candidates.length === 1) inputKey.value = candidates[0];
        else if (candidates.length > 1) inputKey.value = candidates[0] + " ";
    }
});

/* ---------- notas ---------- */

const notesArea = $("#notesArea");
const notesMeta = $("#notesMeta");
const notesStatus = $("#notesStatus");
let notesTimer;

function updateNotesMeta() {
    const text = notesArea?.value || "";
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    notesMeta.textContent = `${words} palabras · ${text.length} caracteres`;
}

function saveNotes() {
    writeStorage(STORE.notes, notesArea.value);
    const now = new Date().toLocaleTimeString("es-VE", { hour: "2-digit", minute: "2-digit", hour12: false });
    notesStatus.textContent = `guardado ${now}`;
    notesStatus.classList.remove("saving");
}

notesArea?.addEventListener("input", () => {
    updateNotesMeta();
    notesStatus.textContent = "guardando…";
    notesStatus.classList.add("saving");
    clearTimeout(notesTimer);
    notesTimer = setTimeout(saveNotes, 600);
});

$("#notesClear")?.addEventListener("click", () => {
    notesArea.value = "";
    updateNotesMeta();
    clearTimeout(notesTimer);
    saveNotes();
    showToast("Nuevo borrador");
});

const savedNotes = readStorage(STORE.notes) || "";
if (notesArea) {
    notesArea.value = savedNotes;
    updateNotesMeta();
    notesStatus.textContent = "listo";
}

/* ---------- controles de Kata ---------- */

$$("[data-kata-nav]").forEach(button =>
    button.addEventListener("click", () => {
        const nav = button.dataset.kataNav;
        if (nav === "reload") {
            $$(".kata-shots img").forEach(img => img.classList.remove("kata-flash"));
            void document.querySelector(".kata-shots img")?.offsetWidth;
            document.querySelector(".kata-shots img")?.classList.add("kata-flash");
            showToast("kata actualizado");
        } else {
            showToast("El espacio de kata es estático");
        }
    }),
);

document.querySelector(".browser-url")?.addEventListener("keydown", event => {
    if (event.key === "Enter") {
        event.preventDefault();
        showToast("kata.app es la página de inicio");
    }
});

/* ---------- acciones internas (Acerca de) ---------- */

$$("[data-jump]").forEach(button =>
    button.addEventListener("click", () => openWindow(button.dataset.jump)),
);

/* ---------- inicio ---------- */

applyIconPositions();
applyInitialPositions();
syncIndicators();
runBoot();