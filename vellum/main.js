const { app, BrowserWindow } = require("electron");
const path = require("path");

const isDev = !app.isPackaged;

function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        backgroundColor: "#10161b",
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
    });

    if (isDev) {
        // En desarrollo carga el servidor local de Vite
        mainWindow.loadURL("http://localhost:5174");
    } else {
        // En producción carga el archivo HTML generado por Vite en dist/
        mainWindow.loadFile(path.join(__dirname, "dist/index.html"));
    }
}

app.whenReady().then(() => {
    createWindow();

    app.on("activate", () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit();
});
