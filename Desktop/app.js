const windows = [...document.querySelectorAll(".windows")];
const openButtons = [...document.querySelectorAll("[data-open]")];
const indicators = [...document.querySelectorAll("[data-indicator]")];
const toast = document.getElementById("toast");
let zIndex = 100;
let toastTimer;

function showToast(message) {
    clearTimeout(toastTimer);
    toast.textContent = message;
    toast.classList.add("show");
    toastTimer = setTimeout(() => toast.classList.remove("show"), 2200);
}

function syncIndicators() {
    indicators.forEach(indicator => {
        const target = document.getElementById(indicator.dataset.indicator);
        indicator.closest(".dock-button")?.classList.toggle("active", target && !target.classList.contains("hidden"));
    });
}

function focusWindow(windowElement) {
    zIndex += 1;
    windowElement.style.zIndex = zIndex;
    windowElement.classList.add("focused");
}

function openWindow(id) {
    const windowElement = document.getElementById(id);
    if (!windowElement) return;
    windowElement.classList.remove("hidden");
    focusWindow(windowElement);
    syncIndicators();
    if (id === "winTerm") document.getElementById("input-key")?.focus();
    if (id === "winBrowser" && document.getElementById("githubAppContainer")?.querySelector(".github-loading"))
        fetchGitHubData();
}

function closeWindow(id) {
    document.getElementById(id)?.classList.add("hidden");
    syncIndicators();
}

openButtons.forEach(button => button.addEventListener("click", () => openWindow(button.dataset.open)));

document.querySelectorAll(".btnClose").forEach(button =>
    button.addEventListener("click", event => {
        event.stopPropagation();
        closeWindow(button.dataset.target);
    }),
);

document.querySelectorAll(".window-minimize").forEach(button =>
    button.addEventListener("click", event => {
        event.stopPropagation();
        closeWindow(button.closest(".windows").id);
    }),
);

document.querySelectorAll(".windows").forEach(windowElement => {
    windowElement.addEventListener("mousedown", () => focusWindow(windowElement));
});

document.getElementById("homeButton")?.addEventListener("click", () => {
    windows.forEach(windowElement => windowElement.classList.add("hidden"));
    syncIndicators();
    showToast("Escritorio despejado");
});

document.getElementById("powerButton")?.addEventListener("click", () => showToast("La sesión sigue activa"));

const inputKey = document.getElementById("input-key");
const termHistory = document.querySelector(".term-history");
const commands = {
    help: "Comandos: help, about, proyectos, contactos, clear, date",
    about: "Diseño y desarrollo de productos digitales desde Venezuela.",
    proyectos: "Abriendo el directorio de proyectos...",
    contactos: "Canales: github, linkedin, gmail y whatsapp.",
    date: () => new Date().toLocaleString("es-VE", { dateStyle: "full", timeStyle: "short" }),
};

inputKey?.addEventListener("keydown", event => {
    if (event.key !== "Enter") return;
    const rawCommand = inputKey.value.trim();
    const command = rawCommand.toLowerCase();
    if (!command) return;
    if (command === "clear") {
        termHistory.innerHTML = "";
    } else {
        const response = commands[command];
        const result = typeof response === "function" ? response() : response || `Comando no reconocido: ${rawCommand}`;
        termHistory.insertAdjacentHTML(
            "beforeend",
            `<p><span>guest@enmanuelOS:~$ ${rawCommand}</span><br />${result}</p>`,
        );
        if (command === "proyectos") openWindow("winProyectos");
        if (command === "contactos") openWindow("winContactos");
    }
    inputKey.value = "";
    termHistory.scrollTop = termHistory.scrollHeight;
});

function updateClock() {
    const now = new Date();
    const time = now.toLocaleTimeString("es-VE", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
    });
    const shortTime = now.toLocaleTimeString("es-VE", { hour: "2-digit", minute: "2-digit", hour12: false });
    const date = now.toLocaleDateString("es-VE", { day: "2-digit", month: "short" }).replace(".", "");
    document.getElementById("live-clock").textContent = time;
    document.getElementById("widgetTime").textContent = shortTime;
    document.getElementById("widgetDate").textContent = date.toUpperCase();
}
setInterval(updateClock, 1000);
updateClock();

windows.forEach(windowElement => {
    const header = windowElement.querySelector(".window-header, .browser-header");
    if (!header) return;
    let dragging = false;
    let offsetX = 0;
    let offsetY = 0;
    header.addEventListener("mousedown", event => {
        if (event.target.closest("button, input")) return;
        const rect = windowElement.getBoundingClientRect();
        windowElement.style.left = `${rect.left}px`;
        windowElement.style.top = `${rect.top}px`;
        windowElement.style.transform = "none";
        dragging = true;
        offsetX = event.clientX - rect.left;
        offsetY = event.clientY - rect.top;
        windowElement.classList.add("dragging");
        focusWindow(windowElement);
    });
    document.addEventListener("mousemove", event => {
        if (!dragging) return;
        windowElement.style.left = `${Math.max(8, Math.min(window.innerWidth - windowElement.offsetWidth - 8, event.clientX - offsetX))}px`;
        windowElement.style.top = `${Math.max(70, Math.min(window.innerHeight - windowElement.offsetHeight - 90, event.clientY - offsetY))}px`;
    });
    document.addEventListener("mouseup", () => {
        dragging = false;
        windowElement.classList.remove("dragging");
    });
});

const githubContainer = document.getElementById("githubAppContainer");
const browserUrlInput = document.getElementById("browserUrlInput");

async function fetchGitHubData() {
    githubContainer.innerHTML = '<div class="github-loading">Conectando con GitHub<span>...</span></div>';
    try {
        const [userResponse, reposResponse] = await Promise.all([
            fetch("https://api.github.com/users/enmanuel400"),
            fetch("https://api.github.com/users/enmanuel400/repos?sort=updated&per_page=6"),
        ]);
        if (!userResponse.ok || !reposResponse.ok) throw new Error("GitHub no disponible");
        const user = await userResponse.json();
        const repos = await reposResponse.json();
        githubContainer.innerHTML = `<div class="gh-profile-header"><img src="${user.avatar_url}" alt="${user.name || user.login}" class="gh-avatar"><div class="gh-user-info"><h2>${user.name || user.login}</h2><p>${user.bio || "Desarrollador Front-End"}</p></div></div><p class="section-kicker">REPOSITORIOS RECIENTES</p><div class="gh-repos-grid">${repos.map(repo => `<a href="${repo.html_url}" target="_blank" rel="noreferrer" class="gh-repo-card"><div class="gh-repo-name">${repo.name}</div><p class="gh-repo-desc">${repo.description || "Sin descripción disponible."}</p></a>`).join("")}</div>`;
    } catch (error) {
        githubContainer.innerHTML =
            '<div class="github-loading">No se pudo conectar con GitHub.<br />Intenta recargar la sesión.</div>';
    }
}

browserUrlInput?.addEventListener("keydown", event => {
    if (event.key !== "Enter") return;
    event.preventDefault();
    fetchGitHubData();
    showToast("Actualizando el espacio de GitHub");
});
document.getElementById("browserReload")?.addEventListener("click", fetchGitHubData);
document.getElementById("browserBack")?.addEventListener("click", () => showToast("No hay historial anterior"));
document.getElementById("browserForward")?.addEventListener("click", () => showToast("No hay historial siguiente"));

document.addEventListener("keydown", event => {
    if (event.key === "Escape") windows.forEach(windowElement => windowElement.classList.add("hidden"));
    if (event.ctrlKey && event.key === "t") {
        event.preventDefault();
        openWindow("winTerm");
    }
    syncIndicators();
});

syncIndicators();
