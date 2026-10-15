const { app, BrowserWindow, Menu, dialog, ipcMain } = require("electron");
const fs = require("fs/promises");
const path = require("path");

const isDev = !app.isPackaged;

// ---- Instancia única: abrir la app dos veces enfoca la ventana existente ----
if (!app.requestSingleInstanceLock()) {
    app.quit();
} else {
    app.on("second-instance", () => {
        const win = BrowserWindow.getAllWindows()[0];
        if (win) {
            if (win.isMinimized()) win.restore();
            win.show();
            win.focus();
        }
    });
}

let mainWindow = null;

app.setName("Vellum");

const stateFile = () => path.join(app.getPath("userData"), "window-state.json");

async function readWindowState() {
    try {
        const raw = await fs.readFile(stateFile(), "utf8");
        const s = JSON.parse(raw);
        if (s && Number.isFinite(s.width) && Number.isFinite(s.height)) return s;
    } catch {
        /* primer arranque */
    }
    return { width: 1220, height: 820 };
}

let stateTimer = null;
function trackWindow(win) {
    const save = () => {
        clearTimeout(stateTimer);
        stateTimer = setTimeout(async () => {
            try {
                await fs.writeFile(stateFile(), JSON.stringify(win.getBounds()), "utf8");
            } catch {
                /* sin importancia */
            }
        }, 400);
    };
    win.on("resize", save);
    win.on("move", save);
    win.on("close", save);
}

function createWindow(bounds) {
    mainWindow = new BrowserWindow({
        ...bounds,
        minWidth: 840,
        minHeight: 560,
        backgroundColor: "#171410",
        show: false,
        title: "Vellum",
        icon: path.join(__dirname, "build", "icon.png"),
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
            contextIsolation: true,
            nodeIntegration: false,
            sandbox: false,
        },
    });

    trackWindow(mainWindow);

    if (isDev) {
        mainWindow.loadURL(process.env.VELLUM_URL || "http://localhost:5174");
    } else {
        mainWindow.loadFile(path.join(__dirname, "dist", "index.html"));
    }

    mainWindow.once("ready-to-show", () => mainWindow.show());
    mainWindow.on("closed", () => {
        mainWindow = null;
    });
}

// ---- IPC: exportar notas a disco con diálogo nativo ----
ipcMain.handle("notes:export", async (e, { title, content }) => {
    const win = BrowserWindow.fromWebContents(e.sender);
    const safe = String(title || "nota")
        .replace(/\.md$/i, "")
        .replace(/[/\\?%*:|"<>]/g, "-")
        .trim();
    const { canceled, filePath } = await dialog.showSaveDialog(win, {
        title: "Exportar nota como Markdown",
        defaultPath: path.join(app.getPath("documents"), `${safe || "nota"}.md`),
        filters: [{ name: "Markdown", extensions: ["md"] }],
    });
    if (canceled || !filePath) return { ok: false, canceled: true };
    await fs.writeFile(filePath, content || "", "utf8");
    return { ok: true, path: filePath };
});

ipcMain.handle("app:info", () => ({
    version: app.getVersion(),
    platform: process.platform,
}));

// ---- Menú nativo mínimo ----
function buildMenu() {
    const isMac = process.platform === "darwin";
    const send = ch => () => {
        if (mainWindow) mainWindow.webContents.send(ch);
    };
    const template = [
        ...(isMac
            ? [{ label: app.name, submenu: [{ role: "about" }, { type: "separator" }, { role: "quit", label: "Salir" }] }]
            : []),
        {
            label: "Archivo",
            submenu: [
                { label: "Nueva nota", accelerator: "CmdOrCtrl+N", click: send("menu-new-note") },
                { label: "Guardar nota", accelerator: "CmdOrCtrl+S", click: send("menu-save-note") },
                { label: "Exportar nota (.md)", accelerator: "CmdOrCtrl+Shift+S", click: send("menu-export-note") },
                { type: "separator" },
                isMac
                    ? { role: "close", label: "Cerrar ventana" }
                    : { role: "quit", label: "Salir" },
            ],
        },
        {
            label: "Editar",
            submenu: [
                { role: "undo", label: "Deshacer" },
                { role: "redo", label: "Rehacer" },
                { type: "separator" },
                { role: "cut", label: "Cortar" },
                { role: "copy", label: "Copiar" },
                { role: "paste", label: "Pegar" },
                { role: "selectAll", label: "Seleccionar todo" },
            ],
        },
        {
            label: "Ver",
            submenu: [
                { label: "Atajos de teclado", accelerator: "CmdOrCtrl+/", click: send("menu-shortcuts") },
                { type: "separator" },
                { role: "reload", label: "Recargar" },
                ...(isDev ? [{ role: "toggleDevTools", label: "Herramientas de desarrollo" }] : []),
                { type: "separator" },
                { role: "togglefullscreen", label: "Pantalla completa" },
            ],
        },
    ];
    Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}

app.whenReady().then(async () => {
    buildMenu();
    const bounds = await readWindowState();
    createWindow(bounds);

    app.on("activate", () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow(bounds);
    });
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit();
});