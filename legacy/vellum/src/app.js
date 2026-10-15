import { renderMarkdown } from "./markdown.js";

/* ============================================================
   VELLUM — lógica de la aplicación
   ============================================================ */

const $ = id => document.getElementById(id);

const els = {
    body: document.body,
    root: document.documentElement,
    viewLabel: $("current-view-label"),
    btnTheme: $("btn-theme-toggle"),
    btnHome: $("btn-home"),
    btnHelp: $("btn-help"),
    statusDot: $("status-dot"),
    statusText: $("status-text"),

    viewHome: $("view-home"),
    viewWorkspace: $("view-workspace"),
    librarySearch: $("library-search"),
    libraryList: $("library-list"),
    btnNewNote: $("btn-new-note"),
    btnImportMedia: $("btn-import-media"),
    actionPlayer: $("action-player"),
    actionNotes: $("action-notes"),
    actionBoth: $("action-both"),

    playerPane: $("player-pane"),
    notesPane: $("notes-pane"),
    resizeHandle: $("resize-handle"),
    mediaTitle: $("media-title"),
    btnQueueToggle: $("btn-queue-toggle"),
    mediaBadge: $("media-badge"),
    btnCloseMedia: $("btn-close-media"),
    queuePanel: $("queue-panel"),
    queueCount: $("queue-count"),
    btnClearQueue: $("btn-clear-queue"),
    queueList: $("queue-list"),

    dropZone: $("drop-zone"),
    mediaFileInput: $("media-file-input"),
    mediaContainer: $("media-container"),
    videoPlayer: $("video-player"),
    audioPlayer: $("audio-player"),
    mediaControlsBox: $("media-controls-box"),
    currentTime: $("current-time"),
    totalDuration: $("total-duration"),
    seekBar: $("seek-bar"),
    btnPrev: $("btn-prev"),
    btnRestart: $("btn-restart"),
    btnPlayPause: $("btn-play-pause"),
    iconPlay: $("icon-play"),
    iconPause: $("icon-pause"),
    btnNext: $("btn-next"),
    btnRepeat: $("btn-repeat"),
    btnSpeed: $("btn-speed"),
    volumeBar: $("volume-bar"),
    btnMute: $("btn-mute"),
    btnFullscreen: $("btn-fullscreen"),

    notesHeaderNormal: $("notes-header-normal"),
    notesHeaderCollapsed: $("notes-header-collapsed"),
    notesContentArea: $("notes-content-area"),
    notesFilenameInput: $("notes-filename-input"),
    notesTextarea: $("notes-textarea"),
    notesPreview: $("notes-preview"),
    btnPreviewToggle: $("btn-preview-toggle"),
    btnSaveNote: $("btn-save-note"),
    btnExportNote: $("btn-export-note"),
    btnDeleteNote: $("btn-delete-note"),
    btnNewNote2: $("btn-new-note-2"),
    btnCollapseNotes: $("btn-collapse-notes"),
    btnExpandNotes: $("btn-expand-notes"),
    savedState: $("notes-saved-state"),
    notesMeta: $("notes-meta"),

    shortcutsModal: $("shortcuts-modal"),
    btnCloseShortcuts: $("btn-close-shortcuts"),
    shortcutsList: $("shortcuts-list"),
    confirmModal: $("confirm-modal"),
    confirmTitle: $("confirm-title"),
    confirmText: $("confirm-text"),
    confirmOk: $("confirm-ok"),
    confirmCancel: $("confirm-cancel"),
    toast: $("toast"),
};

/* ---------------- Estado ---------------- */
const state = {
    theme: "dark",
    volume: 1,
    muted: false,
    split: 0.72,
    view: "home",
    mode: "player", // player | notes | both
    notesCollapsed: false,
    preview: false,
    mediaLoaded: false,
    activeMedia: null,
    currentNote: null,
    queue: [],
    queueIndex: -1,
    repeat: "off",
    speed: 1,
    search: "",
    saveTimer: null,
    busyTimer: null,
    confirmCb: null,
};

const SPEEDS = [0.5, 0.75, 1, 1.25, 1.5, 2];

/* ---------------- Utilidades ---------------- */
function escHtml(s) {
    return String(s ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

function fmtClock(ts) {
    const d = new Date(ts);
    return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

function fmtWhen(ts) {
    const diff = Date.now() - ts;
    if (diff < 60_000) return "ahora";
    if (diff < 3_600_000) return `${Math.floor(diff / 60_000)} min`;
    if (diff < 86_400_000 && new Date(ts).getDate() === new Date().getDate()) return fmtClock(ts);
    const d = new Date(ts);
    return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function notify(msg) {
    els.toast.textContent = msg;
    els.toast.classList.remove("is-hidden");
    clearTimeout(state.busyTimer);
    state.busyTimer = setTimeout(() => els.toast.classList.add("is-hidden"), 2800);
}

function setStatus(kind, text) {
    els.statusDot.classList.remove("is-ready", "is-busy", "is-error");
    if (kind) els.statusDot.classList.add(`is-${kind}`);
    els.statusText.textContent = text;
}

/* ---------------- Tema ---------------- */
function applyTheme(theme, persist) {
    state.theme = theme;
    els.root.setAttribute("data-theme", theme);
    els.body.setAttribute("data-theme", theme);
    els.btnTheme.textContent = theme === "dark" ? "modo: oscuro" : "modo: claro";
    if (persist) {
        try {
            localStorage.setItem("vellum.theme", theme);
        } catch {
            /* sin almacenamiento */
        }
    }
}

/* ---------------- IndexedDB ---------------- */
let dbPromise = null;
function openDB() {
    if (dbPromise) return dbPromise;
    dbPromise = new Promise((resolve, reject) => {
        const req = indexedDB.open("VellumDB", 2);
        req.onupgradeneeded = e => {
            const db = e.target.result;
            if (!db.objectStoreNames.contains("notes")) db.createObjectStore("notes", { keyPath: "id" });
            if (!db.objectStoreNames.contains("media")) db.createObjectStore("media", { keyPath: "id" });
        };
        req.onsuccess = e => resolve(e.target.result);
        req.onerror = () => reject(req.error);
    });
    return dbPromise;
}

const idbGet = (store, key) =>
    new Promise((res, rej) =>
        openDB()
            .then(db => {
                const r = db.transaction(store).objectStore(store).get(key);
                r.onsuccess = () => res(r.result);
                r.onerror = () => rej(r.error);
            })
            .catch(rej)
    );

const idbAll = store =>
    new Promise((res, rej) =>
        openDB()
            .then(db => {
                const r = db.transaction(store).objectStore(store).getAll();
                r.onsuccess = () => res(r.result || []);
                r.onerror = () => rej(r.error);
            })
            .catch(rej)
    );

const idbPut = (store, val) =>
    new Promise((res, rej) =>
        openDB().then(db => {
            const tx = db.transaction(store, "readwrite").objectStore(store).put(val);
            tx.onsuccess = () => res();
            tx.onerror = () => rej(tx.error);
        })
    );

const idbDel = (store, key) =>
    new Promise((res, rej) =>
        openDB().then(db => {
            const tx = db.transaction(store, "readwrite").objectStore(store).delete(key);
            tx.onsuccess = () => res();
            tx.onerror = () => rej(tx.error);
        })
    );

/* Migración desde v1 (recents en localStorage + store mediaFiles) */
async function migrateLegacy() {
    if (localStorage.getItem("vellum.migrated") === "1") return;
    const db = await openDB();
    let legacy = [];
    try {
        legacy = JSON.parse(localStorage.getItem("vellum_recents") || "[]") || [];
    } catch {
        legacy = [];
    }
    if (db.objectStoreNames.contains("mediaFiles")) {
        const recs = await new Promise((res, rej) => {
            const r = db.transaction("mediaFiles").objectStore("mediaFiles").getAll();
            r.onsuccess = () => res(r.result || []);
            r.onerror = () => rej(r.error);
        });
        for (const r of recs) {
            await idbPut("media", {
                id: "legacy-media-" + r.name,
                name: r.name,
                type: r.type,
                blob: r.fileData,
                addedAt: Date.now(),
            });
        }
    }
    for (const item of legacy) {
        if (item.type === "note") {
            await idbPut("notes", {
                id: "legacy-note-" + item.name,
                title: item.name,
                content: item.content || "",
                createdAt: Date.now(),
                updatedAt: Date.now(),
            });
        }
    }
    try {
        localStorage.removeItem("vellum_recents");
        localStorage.setItem("vellum.migrated", "1");
    } catch {
        /* sin almacenamiento */
    }
}

/* ---------------- Biblioteca (dashboard) ---------------- */
async function renderLibrary() {
    const q = state.search.trim().toLowerCase();
    const [notes, media] = await Promise.all([idbAll("notes"), idbAll("media")]);
    notes.sort((a, b) => b.updatedAt - a.updatedAt);
    media.sort((a, b) => (b.addedAt || 0) - (a.addedAt || 0));

    const filtNotes = q ? notes.filter(n => n.title.toLowerCase().includes(q)) : notes;
    const filtMedia = q ? media.filter(m => m.name.toLowerCase().includes(q)) : media;

    if (filtNotes.length + filtMedia.length === 0) {
        els.libraryList.innerHTML = `<div class="side-empty">${
            q ? `Nada coincide con «${escHtml(state.search)}».` : "Un rincón vacío.<br />Escribe tu primera nota o importa un archivo."
        }</div>`;
        return;
    }

    let html = "";
    if (filtNotes.length) {
        html += `<div class="side-group-label">apuntes · ${filtNotes.length}</div>`;
        for (const n of filtNotes) {
            html += `<button class="side-item ${state.currentNote?.id === n.id ? "active" : ""}" data-kind="note" data-id="${n.id}" role="listitem">
                <span class="side-item-glyph">/</span>
                <span class="side-item-name">${escHtml(n.title)}</span>
                <span class="side-item-when">${fmtWhen(n.updatedAt)}</span>
            </button>`;
        }
    }
    if (filtMedia.length) {
        html += `<div class="side-group-label">media · ${filtMedia.length}</div>`;
        for (const m of filtMedia) {
            const glyph = m.type === "audio" ? "·" : "›";
            const active = state.queue[state.queueIndex]?.id === m.id;
            html += `<button class="side-item ${active ? "active" : ""}" data-kind="media" data-id="${m.id}" role="listitem">
                <span class="side-item-glyph">${glyph}</span>
                <span class="side-item-name">${escHtml(m.name)}</span>
                <span class="side-item-when">${fmtWhen(m.addedAt || m.updatedAt || 0)}</span>
            </button>`;
        }
    }
    els.libraryList.innerHTML = html;
}

/* ---------------- Notas ---------------- */
function wordCount(text) {
    return text.trim() ? text.trim().split(/\s+/).filter(Boolean).length : 0;
}

function updateNoteMeta() {
    els.notesMeta.textContent = `${wordCount(els.notesTextarea.value)} palabras`;
}

function setSavedLabel(text) {
    els.savedState.textContent = text;
}

function setPreview(on) {
    state.preview = on;
    els.notesTextarea.classList.toggle("is-hidden", on);
    els.notesPreview.classList.toggle("is-hidden", !on);
    if (on) {
        els.notesPreview.innerHTML = renderMarkdown(els.notesTextarea.value) || '<p class="side-empty">—</p>';
    }
    els.btnPreviewToggle.textContent = on ? "✎ redactar" : "◉ vista previa";
}

function scheduleAutosave() {
    if (!state.currentNote) return;
    setSavedLabel("guardando…");
    setStatus("busy", "guardando");
    clearTimeout(state.saveTimer);
    state.saveTimer = setTimeout(() => flushNote(), 800);
}

async function flushNote() {
    const note = state.currentNote;
    if (!note) return;
    note.content = els.notesTextarea.value;
    note.title = els.notesFilenameInput.value.trim() || "nota.md";
    note.updatedAt = Date.now();
    await idbPut("notes", note);
    setSavedLabel(`guardado ${fmtClock(note.updatedAt)}`);
    setStatus("ready", "listo");
    clearTimeout(state.busyTimer);
    state.busyTimer = setTimeout(() => setSavedLabel("autoguardado activo"), 2600);
    renderLibrary();
}

async function newNote() {
    if (state.currentNote) await flushNote();
    const id = crypto.randomUUID();
    const now = Date.now();
    const d = new Date();
    const stamp = `${String(d.getMonth() + 1).padStart(2, "0")}_${String(d.getDate()).padStart(2, "0")}`;
    const note = { id, title: `nota_${stamp}.md`, content: "", createdAt: now, updatedAt: now };
    await idbPut("notes", note);
    state.currentNote = note;
    openWorkspace("notes");
    els.notesFilenameInput.value = note.title;
    els.notesTextarea.value = "";
    setPreview(false);
    updateNoteMeta();
    setSavedLabel("nueva nota");
    els.notesTextarea.focus();
    notify("Nueva nota creada");
    renderLibrary();
}

async function openNote(id) {
    if (state.currentNote) await flushNote();
    const note = await idbGet("notes", id);
    if (!note) {
        notify("La nota ya no existe");
        renderLibrary();
        return;
    }
    state.currentNote = note;
    openWorkspace("notes");
    els.notesFilenameInput.value = note.title;
    els.notesTextarea.value = note.content;
    setPreview(false);
    updateNoteMeta();
    setSavedLabel(`guardado ${fmtClock(note.updatedAt)}`);
    renderLibrary();
}

async function deleteNote(id) {
    const title = state.currentNote?.id === id ? els.notesFilenameInput.value : "";
    const ok = await askConfirm({
        title: "¿Borrar esta nota?",
        text: title ? `«${title}» se eliminará de tu biblioteca. No se puede deshacer.` : "Esta nota se eliminará de tu biblioteca. No se puede deshacer.",
        okText: "borrar",
    });
    if (!ok) return;
    await idbDel("notes", id);
    if (state.currentNote?.id === id) {
        state.currentNote = null;
        els.notesFilenameInput.value = "nota.md";
        els.notesTextarea.value = "";
        setPreview(false);
        updateNoteMeta();
        setSavedLabel("autoguardado activo");
    }
    notify("Nota borrada");
    renderLibrary();
}

function downloadText(filename, content, ext) {
    const name = /\.\w+$/.test(filename) ? filename : `${filename}.${ext}`;
    const blob = new Blob([content], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 4000);
}

async function exportNote() {
    const title = els.notesFilenameInput.value.trim() || "nota.md";
    const content = els.notesTextarea.value;
    if (window.vellum?.exportMarkdown) {
        try {
            const res = await window.vellum.exportMarkdown({ title, content });
            if (res?.ok) {
                notify(`Exportada → ${res.path}`);
            } else if (!res?.canceled) {
                notify("No se pudo exportar la nota");
            }
        } catch (err) {
            console.error(err);
            notify("Error al exportar");
        }
        return;
    }
    downloadText(title, content, "md");
    notify("Nota descargada (.md)");
}

/* ---------------- Reproductor / cola ---------------- */
function isAudioFile(file) {
    return (
        file.type.startsWith("audio/") ||
        /\.(mp3|flac|wav|ogg|m4a|aac|opus)$/i.test(file.name || "")
    );
}

function setupMediaListeners(media) {
    media.addEventListener("timeupdate", () => {
        if (state.activeMedia !== media || !Number.isFinite(media.duration) || !media.duration) return;
        els.seekBar.value = (media.currentTime / media.duration) * 100;
        els.currentTime.textContent = fmtDuration(media.currentTime);
        els.totalDuration.textContent = fmtDuration(media.duration);
    });
    media.addEventListener("loadedmetadata", () => {
        els.totalDuration.textContent = fmtDuration(media.duration);
    });
    media.addEventListener("ended", () => {
        els.btnPlayPause.classList.remove("is-running");
        onMediaEnded();
    });
    media.addEventListener("play", () => {
        showMediaControls();
        els.iconPlay.classList.add("is-hidden");
        els.iconPause.classList.remove("is-hidden");
    });
    media.addEventListener("pause", () => {
        els.iconPlay.classList.remove("is-hidden");
        els.iconPause.classList.add("is-hidden");
    });
}

function fmtDuration(sec) {
    if (!Number.isFinite(sec) || sec < 0) return "00:00";
    sec = Math.floor(sec);
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    return h > 0
        ? `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
        : `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function showMediaControls() {
    clearTimeout(state.controlsTimer);
    els.mediaControlsBox.classList.remove("media-controls-hidden");
    if (state.activeMedia === els.videoPlayer && !els.videoPlayer.paused && !els.videoPlayer.ended) {
        state.controlsTimer = setTimeout(() => {
            els.mediaControlsBox.classList.add("media-controls-hidden");
        }, 2600);
    }
}

function persistQueue() {
    try {
        localStorage.setItem(
            "vellum.queue",
            JSON.stringify(state.queue.map(q => ({ id: q.id, name: q.name, type: q.type })))
        );
        localStorage.setItem("vellum.queueIndex", String(state.queueIndex));
    } catch {
        /* sin almacenamiento */
    }
}

function renderQueue() {
    els.queueCount.textContent = String(state.queue.length);
    els.queueList.innerHTML = "";
    state.queue.forEach((q, i) => {
        const item = document.createElement("button");
        item.className = "queue-item" + (i === state.queueIndex ? " active" : "");
        item.dataset.index = String(i);
        const glyph = q.type === "audio" ? "·" : "›";
        item.innerHTML = `<span class="glyph">${glyph}</span><span class="name">${escHtml(q.name)}</span><span class="rm" data-rm="${i}" role="button" title="Quitar de la cola">×</span>`;
        els.queueList.appendChild(item);
    });
}

function resetPlayer() {
    clearTimeout(state.controlsTimer);
    els.mediaControlsBox.classList.remove("media-controls-hidden");
    els.videoPlayer.pause();
    els.audioPlayer.pause();
    releaseActiveUrl();
    els.videoPlayer.removeAttribute("src");
    els.audioPlayer.removeAttribute("src");
    els.videoPlayer.load();
    els.audioPlayer.load();
    els.mediaTitle.textContent = "reproductor // sin archivo";
    els.mediaContainer.classList.add("is-hidden");
    els.dropZone.classList.remove("is-hidden");
    els.btnCloseMedia.classList.add("is-hidden");
    els.mediaBadge.textContent = "multimedia";
    els.seekBar.value = 0;
    els.currentTime.textContent = "00:00";
    els.totalDuration.textContent = "00:00";
    els.videoPlayer.classList.add("is-hidden");
    els.iconPlay.classList.remove("is-hidden");
    els.iconPause.classList.add("is-hidden");
    state.mediaLoaded = false;
    state.activeMedia = null;
    try {
        els.mediaFileInput.value = "";
    } catch {
        /* sin cambio */
    }
}

function releaseActiveUrl() {
    const cur = state.queue[state.queueIndex];
    if (cur && cur._url) {
        URL.revokeObjectURL(cur._url);
        cur._url = null;
    }
}

async function handleMediaFiles(fileList) {
    const files = Array.from(fileList || []);
    if (!files.length) return;
    for (const f of files) {
        const id = crypto.randomUUID();
        const type = isAudioFile(f) ? "audio" : "video";
        try {
            await idbPut("media", { id, name: f.name, type, blob: f, addedAt: Date.now() });
        } catch (err) {
            notify(`No se pudo guardar «${f.name}»`);
            console.error(err);
            break;
        }
        state.queue.push({ id, name: f.name, type });
    }
    renderQueue();
    renderLibrary();
    persistQueue();
    if (state.queueIndex === -1 && state.queue.length) {
        await playQueueAt(0);
    } else {
        notify(`${files.length} archivo(s) en la cola`);
    }
}

async function playQueueAt(index) {
    if (index < 0 || index >= state.queue.length) return;
    releaseActiveUrl();
    state.queueIndex = index;
    const item = state.queue[index];
    const rec = await idbGet("media", item.id);
    if (!rec || !rec.blob) {
        notify("El archivo ya no está disponible en la biblioteca");
        state.queue.splice(index, 1);
        state.queueIndex = Math.min(index, state.queue.length - 1);
        renderQueue();
        persistQueue();
        renderLibrary();
        return;
    }
    item._url = URL.createObjectURL(rec.blob);
    const isAudio = rec.type === "audio";
    els.mediaTitle.textContent = `reproductor // ${rec.name}`;
    els.mediaBadge.textContent = isAudio ? "audio" : "video";
    els.dropZone.classList.add("is-hidden");
    els.mediaContainer.classList.remove("is-hidden");
    els.btnCloseMedia.classList.remove("is-hidden");

    if (isAudio) {
        els.videoPlayer.pause();
        els.videoPlayer.classList.add("is-hidden");
        els.audioPlayer.src = item._url;
        state.activeMedia = els.audioPlayer;
    } else {
        els.audioPlayer.pause();
        els.audioPlayer.classList.add("is-hidden");
        els.videoPlayer.classList.remove("is-hidden");
        els.videoPlayer.src = item._url;
        state.activeMedia = els.videoPlayer;
    }

    state.mediaLoaded = true;
    els.audioPlayer.volume = state.muted ? 0 : state.volume;
    els.videoPlayer.volume = state.muted ? 0 : state.volume;
    state.activeMedia.playbackRate = state.speed;
    els.seekBar.value = 0;
    els.currentTime.textContent = "00:00";
    els.totalDuration.textContent = "00:00";

    try {
        await state.activeMedia.play();
        els.iconPlay.classList.add("is-hidden");
        els.iconPause.classList.remove("is-hidden");
    } catch {
        els.iconPlay.classList.remove("is-hidden");
        els.iconPause.classList.add("is-hidden");
    }
    showMediaControls();
    renderQueue();
    renderLibrary();
    persistQueue();
}

async function playLibraryMedia(id) {
    const rec = await idbGet("media", id);
    if (!rec || !rec.blob) {
        notify("El archivo ya no está disponible");
        renderLibrary();
        return;
    }
    let idx = state.queue.findIndex(q => q.id === id);
    if (idx === -1) {
        state.queue.push({ id: rec.id, name: rec.name, type: rec.type });
        idx = state.queue.length - 1;
        persistQueue();
    }
    openWorkspace("both");
    await playQueueAt(idx);
}

async function onMediaEnded() {
    if (state.repeat === "one") {
        state.activeMedia.currentTime = 0;
        state.activeMedia.play().catch(() => {});
        return;
    }
    const last = state.queueIndex >= state.queue.length - 1;
    if (last && state.repeat !== "all") {
        els.iconPlay.classList.remove("is-hidden");
        els.iconPause.classList.add("is-hidden");
        return;
    }
    const next = (state.queueIndex + 1) % state.queue.length;
    await playQueueAt(next);
}

async function nextTrack() {
    if (!state.queue.length) return;
    if (state.queueIndex >= state.queue.length - 1 && state.repeat !== "all") {
        await playQueueAt(0);
        return;
    }
    await playQueueAt((state.queueIndex + 1) % state.queue.length);
}

async function prevTrack() {
    if (!state.queue.length) return;
    if (state.mediaLoaded && state.activeMedia && state.activeMedia.currentTime > 4) {
        state.activeMedia.currentTime = 0;
        return;
    }
    if (state.queueIndex > 0) await playQueueAt(state.queueIndex - 1);
    else await playQueueAt(state.queue.length - 1);
}

function togglePlay() {
    if (!state.activeMedia || !state.mediaLoaded) return;
    if (state.activeMedia.paused) {
        state.activeMedia.play().catch(() => {});
    } else {
        state.activeMedia.pause();
    }
}

function seekBy(delta) {
    if (!state.activeMedia || !state.mediaLoaded) return;
    const md = state.activeMedia;
    if (!Number.isFinite(md.duration)) return;
    md.currentTime = Math.max(0, Math.min(md.duration, md.currentTime + delta));
}

function changeVolume(delta) {
    setVolume(Math.max(0, Math.min(1, state.volume + delta)));
}

function setVolume(v) {
    state.volume = v;
    state.muted = v <= 0;
    els.volumeBar.value = String(v);
    els.videoPlayer.volume = v;
    els.audioPlayer.volume = v;
    try {
        localStorage.setItem("vellum.volume", String(v));
    } catch {
        /* sin almacenamiento */
    }
}

function toggleMute() {
    state.muted = !state.muted;
    els.videoPlayer.muted = state.muted;
    els.audioPlayer.muted = state.muted;
    els.btnMute.classList.toggle("is-on", state.muted);
}

function cycleRepeat() {
    const order = ["off", "all", "one"];
    const i = (order.indexOf(state.repeat) + 1) % order.length;
    state.repeat = order[i];
    els.btnRepeat.classList.toggle("is-on", state.repeat !== "off");
    els.btnRepeat.title = `Repetir: ${state.repeat === "one" ? "uno" : state.repeat === "all" ? "todo" : "desactivado"}`;
    notify(
        state.repeat === "one" ? "Repetir uno" : state.repeat === "all" ? "Repetir todo" : "Repetir desactivado"
    );
}

function cycleSpeed() {
    const i = SPEEDS.indexOf(state.speed);
    state.speed = SPEEDS[(i + 1) % SPEEDS.length];
    if (state.activeMedia) state.activeMedia.playbackRate = state.speed;
    els.btnSpeed.textContent = `${state.speed}×`;
}

async function toggleFullscreen() {
    if (document.fullscreenElement) {
        await document.exitFullscreen();
    } else {
        await els.mediaContainer.requestFullscreen().catch(() => {});
    }
}

/* ---------------- Workspace / layout ---------------- */
function applySplit(ratio) {
    const r = Math.min(0.78, Math.max(0.25, ratio));
    state.split = r;
    els.playerPane.style.width = `calc(${r * 100}% - 3px)`;
    els.notesPane.style.width = `calc(${(1 - r) * 100}% - 3px)`;
    try {
        localStorage.setItem("vellum.split", String(r));
    } catch {
        /* sin almacenamiento */
    }
}

function applyLayout() {
    const handle = els.resizeHandle;
    if (state.mode === "player") {
        els.playerPane.style.width = "100%";
        els.notesPane.style.width = "0";
        els.playerPane.classList.remove("is-hidden");
        els.notesPane.classList.add("is-hidden");
        handle.classList.add("is-hidden");
    } else if (state.mode === "notes") {
        els.notesPane.style.width = "100%";
        els.playerPane.classList.add("is-hidden");
        handle.classList.add("is-hidden");
    } else {
        els.playerPane.classList.remove("is-hidden");
        els.notesPane.classList.remove("is-hidden");
        handle.classList.remove("is-hidden");
        if (state.notesCollapsed) {
            els.playerPane.style.width = "calc(100% - 46px)";
            els.notesPane.style.width = "46px";
        } else {
            applySplit(state.split);
        }
    }
}

function openWorkspace(mode) {
    state.mode = mode;
    state.notesCollapsed = false;
    els.viewHome.classList.add("is-hidden");
    els.viewWorkspace.classList.remove("is-hidden");
    els.viewLabel.textContent = "workspace // activo";
    els.notesHeaderNormal.classList.remove("is-hidden");
    els.notesHeaderCollapsed.classList.add("is-hidden");
    els.notesContentArea.classList.remove("is-hidden");
    applyLayout();
}

function goHome() {
    if (state.currentNote) flushNote();
    state.notesCollapsed = false;
    els.viewWorkspace.classList.add("is-hidden");
    els.viewHome.classList.remove("is-hidden");
    els.viewLabel.textContent = "dashboard";
    renderLibrary();
}

function collapseNotes() {
    if (state.mode !== "both") return;
    state.notesCollapsed = true;
    els.notesHeaderNormal.classList.add("is-hidden");
    els.notesContentArea.classList.add("is-hidden");
    els.notesHeaderCollapsed.classList.remove("is-hidden");
    applyLayout();
}

function expandNotes() {
    state.notesCollapsed = false;
    els.notesHeaderCollapsed.classList.add("is-hidden");
    els.notesHeaderNormal.classList.remove("is-hidden");
    els.notesContentArea.classList.remove("is-hidden");
    applyLayout();
}

/* ---------------- Overlays ---------------- */
function askConfirm({ title, text, okText = "borrar" }) {
    return new Promise(resolve => {
        state.confirmCb = resolve;
        els.confirmTitle.textContent = title;
        els.confirmText.textContent = text;
        els.confirmOk.textContent = okText;
        els.confirmModal.classList.remove("is-hidden");
    });
}

function closeConfirm(result) {
    els.confirmModal.classList.add("is-hidden");
    const cb = state.confirmCb;
    state.confirmCb = null;
    if (cb) cb(result);
}

function openShortcuts() {
    els.shortcutsModal.classList.remove("is-hidden");
    els.btnHelp.classList.add("is-on");
}

function closeShortcuts() {
    els.shortcutsModal.classList.add("is-hidden");
    els.btnHelp.classList.remove("is-on");
}

function renderShortcuts() {
    const list = [
        ["espacio", "reproducir / pausar"],
        ["← / →", "retroceder / avanzar 5s"],
        ["↑ / ↓", "subir / bajar volumen"],
        ["n", "nueva nota"],
        ["r", "repetir (uno / todo / off)"],
        ["f", "pantalla completa"],
        ["m", "silenciar"],
        ["[ / ]", "anterior / siguiente"],
        ["? / /", "este panel"],
        ["esc", "cerrar paneles"],
        ["ctrl+S", "guardar nota"],
        ["ctrl+shift+S", "exportar nota (.md)"],
    ];
    els.shortcutsList.innerHTML = list
        .map(([k, v]) => `<div class="help-row"><span>${escHtml(v)}</span><kbd>${escHtml(k)}</kbd></div>`)
        .join("");
}

/* ---------------- Atajos globales ---------------- */
function handleKeydown(e) {
    const tag = (e.target.tagName || "").toLowerCase();
    const typing = tag === "input" || tag === "textarea" || tag === "select" || e.target.isContentEditable;

    if (e.key === "Escape") {
        if (!els.shortcutsModal.classList.contains("is-hidden")) closeShortcuts();
        if (!els.confirmModal.classList.contains("is-hidden")) closeConfirm(false);
        return;
    }
    if (typing || e.ctrlKey || e.metaKey || e.altKey) return;

    switch (e.key) {
        case " ": {
            if (!typing) {
                e.preventDefault();
                togglePlay();
            }
            break;
        }
        case "ArrowLeft":
            seekBy(-5);
            break;
        case "ArrowRight":
            seekBy(5);
            break;
        case "ArrowUp":
            e.preventDefault();
            changeVolume(0.1);
            break;
        case "ArrowDown":
            e.preventDefault();
            changeVolume(-0.1);
            break;
        case "n":
        case "N":
            newNote();
            break;
        case "r":
        case "R":
            cycleRepeat();
            break;
        case "f":
        case "F":
            toggleFullscreen();
            break;
        case "m":
        case "M":
            toggleMute();
            break;
        case "[":
            prevTrack();
            break;
        case "]":
            nextTrack();
            break;
        case "?":
        case "/":
            openShortcuts();
            break;
        default:
            break;
    }
}

function handleMenu(action) {
    if (action === "new-note") newNote();
    else if (action === "save-note") flushNote();
    else if (action === "export-note") exportNote();
    else if (action === "shortcuts") openShortcuts();
}

/* ---------------- Eventos ---------------- */
function bindEvents() {
    els.btnTheme.addEventListener("click", () => applyTheme(state.theme === "dark" ? "light" : "dark", true));
    els.btnHome.addEventListener("click", goHome);
    els.btnHelp.addEventListener("click", () =>
        els.shortcutsModal.classList.contains("is-hidden") ? openShortcuts() : closeShortcuts()
    );
    els.btnCloseShortcuts.addEventListener("click", closeShortcuts);
    els.confirmOk.addEventListener("click", () => closeConfirm(true));
    els.confirmCancel.addEventListener("click", () => closeConfirm(false));

    els.actionPlayer.addEventListener("click", () => openWorkspace("player"));
    els.actionNotes.addEventListener("click", () => openWorkspace("notes"));
    els.actionBoth.addEventListener("click", () => openWorkspace("both"));

    els.btnNewNote.addEventListener("click", newNote);
    els.btnNewNote2.addEventListener("click", newNote);
    els.btnImportMedia.addEventListener("click", () => els.mediaFileInput.click());

    els.librarySearch.addEventListener("input", () => {
        state.search = els.librarySearch.value;
        renderLibrary();
    });

    els.libraryList.addEventListener("click", e => {
        const item = e.target.closest("[data-id]");
        if (!item) return;
        if (item.dataset.kind === "note") openNote(item.dataset.id);
        else playLibraryMedia(item.dataset.id);
    });

    // Notas
    els.notesTextarea.addEventListener("input", () => {
        updateNoteMeta();
        if (state.preview) {
            els.notesPreview.innerHTML = renderMarkdown(els.notesTextarea.value) || '<p class="side-empty">—</p>';
        }
        scheduleAutosave();
    });
    els.notesFilenameInput.addEventListener("input", scheduleAutosave);
    els.notesTextarea.addEventListener("blur", () => {
        if (state.currentNote) flushNote();
    });
    els.btnSaveNote.addEventListener("click", () => flushNote());
    els.btnExportNote.addEventListener("click", exportNote);
    els.btnDeleteNote.addEventListener("click", () => {
        if (state.currentNote) deleteNote(state.currentNote.id);
    });
    els.btnPreviewToggle.addEventListener("click", () => setPreview(!state.preview));
    els.btnCollapseNotes.addEventListener("click", collapseNotes);
    els.btnExpandNotes.addEventListener("click", expandNotes);

    // Media
    els.dropZone.addEventListener("click", () => els.mediaFileInput.click());
    els.mediaFileInput.addEventListener("change", e => handleMediaFiles(e.target.files));

    for (const [ev, action] of [
        ["dragenter", "add"],
        ["dragover", "add"],
        ["dragleave", "remove"],
    ]) {
        els.dropZone.addEventListener(ev, e => {
            if (ev === "dragover") e.preventDefault();
            els.dropZone.classList.toggle("is-dragover", action === "add");
        });
    }
    els.dropZone.addEventListener("drop", e => {
        e.preventDefault();
        els.dropZone.classList.remove("is-dragover");
        if (e.dataTransfer?.files?.length) handleMediaFiles(e.dataTransfer.files);
    });
    document.addEventListener("dragover", e => e.preventDefault());
    document.addEventListener("drop", e => e.preventDefault());

    els.queueList.addEventListener("click", e => {
        const rm = e.target.closest("[data-rm]");
        if (rm) {
            removeFromQueue(Number(rm.dataset.rm));
            return;
        }
        const item = e.target.closest("[data-index]");
        if (item) playQueueAt(Number(item.dataset.index));
    });
    els.btnQueueToggle.addEventListener("click", () => {
        els.queuePanel.classList.toggle("is-hidden");
        els.btnQueueToggle.textContent = els.queuePanel.classList.contains("is-hidden") ? "lista ▾" : "lista ▴";
    });
    els.btnClearQueue.addEventListener("click", async () => {
        if (!state.queue.length) return;
        const ok = await askConfirm({
            title: "¿Vaciar la cola?",
            text: "Se quitarán todos los archivos de la lista. Tus archivos se conservan en la biblioteca.",
            okText: "vaciar",
        });
        if (!ok) return;
        state.queue.forEach(q => q._url && URL.revokeObjectURL(q._url));
        state.queue = [];
        state.queueIndex = -1;
        resetPlayer();
        renderQueue();
        renderLibrary();
        persistQueue();
        notify("Cola vaciada");
    });

    els.btnCloseMedia.addEventListener("click", () => {
        if (state.queueIndex >= 0) {
            const cur = state.queue[state.queueIndex];
            if (cur) {
                state.queue.splice(state.queueIndex, 1);
                state.queueIndex = Math.min(state.queueIndex, state.queue.length - 1);
            }
        }
        resetPlayer();
        renderQueue();
        renderLibrary();
        persistQueue();
    });

    els.btnPlayPause.addEventListener("click", togglePlay);
    els.btnPrev.addEventListener("click", prevTrack);
    els.btnNext.addEventListener("click", nextTrack);
    els.btnRestart.addEventListener("click", () => {
        if (state.activeMedia) {
            state.activeMedia.currentTime = 0;
            state.activeMedia.play().catch(() => {});
        }
    });
    els.btnRepeat.addEventListener("click", cycleRepeat);
    els.btnSpeed.addEventListener("click", cycleSpeed);
    els.btnFullscreen.addEventListener("click", toggleFullscreen);
    els.btnMute.addEventListener("click", toggleMute);

    els.seekBar.addEventListener("input", () => {
        if (state.activeMedia && Number.isFinite(state.activeMedia.duration)) {
            state.activeMedia.currentTime = (els.seekBar.value / 100) * state.activeMedia.duration;
        }
    });
    els.volumeBar.addEventListener("input", () => setVolume(parseFloat(els.volumeBar.value) || 0));
    els.mediaContainer.addEventListener("mousemove", () => {
        if (state.activeMedia === els.videoPlayer) showMediaControls();
    });

    document.addEventListener("fullscreenchange", () => {
        const isFs = document.fullscreenElement === els.mediaContainer;
        els.btnFullscreen.classList.toggle("is-on", isFs);
        els.btnFullscreen.title = isFs ? "Salir de pantalla completa" : "Pantalla completa (f)";
    });

    // Split
    els.resizeHandle.addEventListener("pointerdown", e => {
        state.draggingSplit = true;
        els.resizeHandle.classList.add("is-dragging");
        try {
            els.resizeHandle.setPointerCapture(e.pointerId);
        } catch {
            /* puntero no activo (evento sintético) */
        }
    });
    els.resizeHandle.addEventListener("pointermove", e => {
        if (!state.draggingSplit || state.mode !== "both" || state.notesCollapsed) return;
        const rect = els.viewWorkspace.getBoundingClientRect();
        applySplit((e.clientX - rect.left) / rect.width);
    });
    els.resizeHandle.addEventListener("pointerup", () => {
        state.draggingSplit = false;
        els.resizeHandle.classList.remove("is-dragging");
    });
    els.resizeHandle.addEventListener("dblclick", () => applySplit(0.72));

    document.addEventListener("keydown", handleKeydown);
}

async function removeFromQueue(index) {
    if (index < 0 || index >= state.queue.length) return;
    const removed = state.queue[index];
    if (removed._url) URL.revokeObjectURL(removed._url);
    state.queue.splice(index, 1);
    if (index === state.queueIndex) {
        state.queueIndex = Math.min(state.queueIndex, state.queue.length - 1);
        if (state.queueIndex >= 0) await playQueueAt(state.queueIndex);
        else resetPlayer();
    } else if (index < state.queueIndex) {
        state.queueIndex -= 1;
    }
    renderQueue();
    renderLibrary();
    persistQueue();
}

/* ---------------- Restaurar sesión ---------------- */
async function restoreQueue() {
    let saved = [];
    try {
        saved = JSON.parse(localStorage.getItem("vellum.queue") || "[]");
    } catch {
        saved = [];
    }
    if (!Array.isArray(saved)) return;
    for (const q of saved) {
        if (q && q.id && (await idbGet("media", q.id))) {
            state.queue.push({ id: q.id, name: q.name, type: q.type });
        }
    }
    if (!state.queue.length) return;
    renderQueue();
    const idx = parseInt(localStorage.getItem("vellum.queueIndex") ?? "-1", 10);
    if (idx >= 0 && idx < state.queue.length) state.queueIndex = idx;

    // Cargar el elemento en el reproductor pero en pausa (sin autoplay al arrancar)
    const item = state.queue[state.queueIndex];
    if (!item) return;
    const rec = await idbGet("media", item.id);
    if (!rec) return;
    item._url = URL.createObjectURL(rec.blob);
    const isAudio = rec.type === "audio";
    els.mediaTitle.textContent = `reproductor // ${rec.name}`;
    els.mediaBadge.textContent = isAudio ? "audio" : "video";
    els.dropZone.classList.add("is-hidden");
    els.mediaContainer.classList.remove("is-hidden");
    els.btnCloseMedia.classList.remove("is-hidden");
    if (isAudio) {
        els.videoPlayer.classList.add("is-hidden");
        els.audioPlayer.src = item._url;
        state.activeMedia = els.audioPlayer;
    } else {
        els.audioPlayer.classList.add("is-hidden");
        els.audioPlayer.src = item._url;
        state.activeMedia = els.videoPlayer;
    }
    state.mediaLoaded = true;
    els.audioPlayer.volume = state.volume;
    els.videoPlayer.volume = state.volume;
    state.activeMedia.playbackRate = state.speed;
    els.totalDuration.textContent = "00:00";
    renderLibrary();
}

/* ---------------- Boot ---------------- */
async function boot() {
    const savedTheme = (() => {
        try {
            return localStorage.getItem("vellum.theme") || "dark";
        } catch {
            return "dark";
        }
    })();
    applyTheme(savedTheme, false);

    const savedVolume = parseFloat(localStorage.getItem("vellum.volume") ?? "1");
    setVolume(Number.isFinite(savedVolume) ? Math.max(0, Math.min(1, savedVolume)) : 1);

    const savedSplit = parseFloat(localStorage.getItem("vellum.split") ?? "0.72");
    state.split = Number.isFinite(savedSplit) ? Math.min(0.78, Math.max(0.25, savedSplit)) : 0.72;

    bindEvents();
    renderShortcuts();
    setupMediaListeners(els.videoPlayer);
    setupMediaListeners(els.audioPlayer);
    applyLayout();

    if (window.vellum?.onMenuAction) window.vellum.onMenuAction(handleMenu);

    try {
        await openDB();
        await migrateLegacy();
    } catch (err) {
        console.error("Error con IndexedDB:", err);
        notify("No se pudo abrir la biblioteca local");
    }

    await restoreQueue();
    renderQueue();
    renderLibrary();
    setStatus("ready", "listo");
    document.documentElement.classList.add("vellum-ready");
}

boot();