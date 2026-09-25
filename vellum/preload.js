const { contextBridge, ipcRenderer } = require("electron");

// Puente mínimo y tipado entre el renderer y el proceso principal.
contextBridge.exposeInMainWorld("vellum", {
    isElectron: true,
    platform: process.platform,
    exportMarkdown: payload => ipcRenderer.invoke("notes:export", payload),
    getInfo: () => ipcRenderer.invoke("app:info"),
    onMenuAction: cb => {
        const actions = ["menu-new-note", "menu-save-note", "menu-export-note", "menu-shortcuts"];
        const fns = new Map();
        for (const a of actions) {
            const fn = () => cb(a.replace("menu-", ""));
            fns.set(a, fn);
            ipcRenderer.on(a, fn);
        }
        return () => {
            for (const [a, fn] of fns) ipcRenderer.removeListener(a, fn);
            fns.clear();
        };
    },
});