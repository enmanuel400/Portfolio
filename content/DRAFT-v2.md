# Fase 2 — Borrador de contenido · v2

> Ya con tus respuestas. Los tres casos completos en EN + ES, Sobre mí corregido y los
> escritos. Revisa voz y datos; lo que siga con `[?]` es lo poco que queda abierto.

Datos incorporados: todo en **2026** · rol **completo** (diseño + frontend + backend) ·
los tres **en mejora continua** · kata **200–300 MB** en reposo · miso **4 fuentes** y
**< 5 s** · enlaces y correo confirmados.

---

## 1. Sobre mí (About)

### EN

**H1:** I build interfaces that hold up on the tenth visit.

I'm a frontend developer, self-taught. No degree, no bootcamp — a lot of reading, a lot of
broken builds, and a stubborn habit of finishing what I start. The projects on this site I
designed and built end to end: interface, logic and the backend behind it.

I care about the part of the work that's easy to skip: the empty state, the first load, the
moment something fails. A clean hero is the beginning of the job, not the job. What I want to
make is an interface that still feels considered after you've used it for a while.

**What I work with**
- **Frontend** — HTML, CSS, JavaScript, TypeScript, React, Astro
- **Desktop** — Electron, Tauri (Rust), Node/Express
- **Backend / API** — Python, FastAPI
- **Tooling** — Vite, Playwright, Chart.js

**How I work**
- Start from the problem, not the layout.
- Build something real early, then refine against it.
- Verify instead of assuming: performance, contrast, real devices.

**Right now**
- Improving **[miso](/work/miso)** and **[kata](/work/kata)**, and keeping **[sysdash](/work/sysdash)** sharp.
- Open to frontend roles and freelance work.

→ [GitHub](https://github.com/enmanuel400) · [LinkedIn](https://www.linkedin.com/in/enmanuel-pirela-697020437/) · Email

### ES

**H1:** Construyo interfaces que aguantan la décima visita.

Soy desarrollador frontend, autodidacta. Sin título, sin bootcamp: mucha lectura, muchas
builds rotas y la costumbre terca de terminar lo que empiezo. Los proyectos de este sitio los
diseñé y construí de punta a punta: interfaz, lógica y el backend que hay detrás.

Me importa la parte que es fácil saltarse: el estado vacío, la primera carga, el momento en
que algo falla. Un hero limpio es el comienzo del trabajo, no el trabajo. Lo que quiero
construir es una interfaz que siga pareciendo cuidada después de usarla un rato.

**Con qué trabajo**
- **Frontend** — HTML, CSS, JavaScript, TypeScript, React, Astro
- **Escritorio** — Electron, Tauri (Rust), Node/Express
- **Backend / API** — Python, FastAPI
- **Herramientas** — Vite, Playwright, Chart.js

**Cómo trabajo**
- Empiezo por el problema, no por el layout.
- Construyo algo real pronto y refino contra eso.
- Verifico en vez de suponer: rendimiento, contraste, dispositivos reales.

**Ahora mismo**
- Mejorando **[miso](/work/miso)** y **[kata](/work/kata)**, y manteniendo al día **[sysdash](/work/sysdash)**.
- Abierto a puestos frontend y trabajo freelance.

→ [GitHub](https://github.com/enmanuel400) · [LinkedIn](https://www.linkedin.com/in/enmanuel-pirela-697020437/) · Email

---

## 2. Caso: **kata**

### EN

**Eyebrow:** Case study
**Title:** kata
**Bajada:** A desktop browser that keeps your life on your machine — no accounts, no telemetry, no forced sync.
**Meta:** Role — design, frontend & backend · Year — 2026 · Status — in continuous improvement · Stack — Tauri 2, React 19, TypeScript, Rust

**The problem**

Most browsers treat your machine as a cache for someone else's server. You sign in, you sync,
and your history, tabs and passwords flow to a company you don't control. For plenty of people
that's a fair trade. I wanted to see what a browser looks like when it assumes the opposite:
the state stays on the device, and nothing leaves it.

**What I built**

kata is a desktop browser for Linux built on Tauri. It does the everyday job of a browser and
then stays quiet: no account, no telemetry, no background chatter. Your history, session and
settings live in a local file — and that's the whole arrangement.

The start page is a bento grid: a compact set of tiles rather than a search box buried under a
wall of bookmarks.

**How it works**

- **Native core, web interface.** Tauri 2 puts the system layer and the rendering engine in
  Rust, while the interface is React 19 + TypeScript. The app ships small and behaves like a
  native window, not a wrapped website.
- **Local-first by design.** There is no server to talk to, so there is nothing to sync and
  nothing to leak. Privacy here is the default, not a setting you have to find.

**What mattered**

- **Privacy as the starting point.** Every feature had to justify its network access; most didn't.
- **A home that's a workspace.** The bento start page is meant to be used, not just looked at.

**Where it is**

kata works and I keep tightening it. The next pass is performance: at rest it sits around
**200–300 MB**, and I want that lower. A browser that's private but heavy isn't finished.

**Links** — [github.com/enmanuel400/Kata](https://github.com/enmanuel400/Kata)

### ES

**Eyebrow:** Caso de estudio
**Title:** kata
**Bajada:** Un navegador de escritorio que deja tu vida en tu equipo: sin cuentas, sin telemetría y sin sincronización forzada.
**Meta:** Rol — diseño, frontend y backend · Año — 2026 · Estado — en mejora continua · Stack — Tauri 2, React 19, TypeScript, Rust

**El problema**

Casi todos los navegadores tratan tu equipo como la caché del servidor de otra empresa. Inicias
sesión, sincronizas, y tu historial, tus pestañas y tus contraseñas viajan a una compañía que no
controlas. Para mucha gente es un intercambio justo. Yo quería ver cómo es un navegador que
asume lo contrario: el estado se queda en el dispositivo y nada sale de él.

**Qué construí**

kata es un navegador de escritorio para Linux construido sobre Tauri. Hace el trabajo de todos
los días de un navegador y luego se queda callado: sin cuenta, sin telemetría, sin ruido de
fondo. Tu historial, tu sesión y tus ajustes viven en un archivo local, y ese es todo el trato.

La página de inicio es una rejilla *bento*: un conjunto compacto de mosaicos en vez de un
buscador enterrado bajo un muro de marcadores.

**Cómo funciona**

- **Núcleo nativo, interfaz web.** Tauri 2 pone la capa de sistema y el motor de render en
  Rust, mientras que la interfaz es React 19 + TypeScript. La app pesa poco y se comporta como
  una ventana nativa, no como una web envuelta.
- **Local por diseño.** No hay servidor con el que hablar, así que no hay nada que sincronizar
  ni nada que filtrar. Aquí la privacidad es lo por defecto, no un ajuste que haya que buscar.

**Lo que importaba**

- **La privacidad como punto de partida.** Cada función tenía que justificar su acceso a la
  red; la mayoría no lo logró.
- **Un inicio que es un espacio de trabajo.** La página bento está hecha para usarse, no solo
  para mirarse.

**Dónde está**

kata funciona y lo sigo apretando. El siguiente paso es el rendimiento: en reposo ronda los
**200–300 MB** y quiero bajarlo. Un navegador privado pero pesado no está terminado.

**Enlaces** — [github.com/enmanuel400/Kata](https://github.com/enmanuel400/Kata)

---

## 3. Caso: **miso**

### EN

**Eyebrow:** Case study
**Title:** miso
**Bajada:** A desktop search for film and series that queries several sites at once, merges the results, and plays the video inside the app — no tabs, no popups, no ads.
**Meta:** Role — design, frontend & backend · Year — 2026 · Status — in continuous improvement · Stack — Electron, Node/Express, React, Vite, TypeScript, Playwright, hls.js

**The problem**

Watching one specific film usually means opening several sites, closing the dead ones, dodging
pop-ups and playing "find the real play button". The content is scattered across services and
each one wants the whole screen. I wanted the opposite: search once, see everything, play it,
close the app.

**What I built**

A desktop app that runs locally. You type a title once; miso queries four sources at the same
time and lays the results out in a single grid. A title found on more than one source doesn't
repeat — it becomes one card with a small **`+N`** badge that opens the alternatives. Press
play and the video runs inside the app.

**How it works**

Everything happens on your machine. The app starts its own Node server on launch and shuts it
down when you close it: no remote backend, no account.

- **Local proxies for images and HLS.** CDN streams block cross-origin requests, so miso serves
  them through its own local proxy. That's what makes in-app playback possible without a
  gateway in the middle.
- **Cascade extraction.** For each source it tries in order — parse the HTML, then the embedded
  player, then a headless Chromium — and stops at the first result that is actually playable
  and valid. No wasted work.

**What mattered**

- **Grouping over duplication.** The `+N` card is the core idea: one title, many sources. It
  keeps the grid calm instead of showing the same poster eight times.
- **Loading that tells the truth.** Sources answer at different speeds, so progress shows per
  source instead of one spinner — slow ones don't look broken.
- **Staying quiet.** No trackers, no ad slots. The screen is the poster wall and the player.

**Where it is**

miso is the project I use the most and the one I keep improving. Results come back in under
**5 seconds**, but the extraction layer is the part that ages fastest — sources change, so it
needs attention. That's exactly the next pass.

**Links** — [github.com/enmanuel400/Miso](https://github.com/enmanuel400/Miso)

### ES

**Eyebrow:** Caso de estudio
**Title:** miso
**Bajada:** Un buscador de escritorio de cine y series que consulta varias webs a la vez, unifica los resultados y reproduce el vídeo dentro de la app: sin pestañas, sin ventanas emergentes y sin anuncios.
**Meta:** Rol — diseño, frontend y backend · Año — 2026 · Estado — en mejora continua · Stack — Electron, Node/Express, React, Vite, TypeScript, Playwright, hls.js

**El problema**

Ver una película concreta suele significar abrir varias webs, cerrar las que están caídas,
esquivar ventanas emergentes y jugar a "encuentra el botón de reproducir de verdad". El
contenido está repartido entre servicios y cada uno quiere la pantalla entera. Yo quería lo
contrario: buscar una vez, verlo todo, reproducir y cerrar.

**Qué construí**

Una app de escritorio que corre en local. Escribes un título una vez; miso consulta cuatro
fuentes al mismo tiempo y coloca los resultados en una sola rejilla. Un título encontrado en
más de una fuente no se repite: se convierte en una tarjeta con una insignia **`+N`** que abre
las alternativas. Le das a reproducir y el vídeo corre dentro de la app.

**Cómo funciona**

Todo ocurre en tu equipo. La app levanta su propio servidor Node al abrirse y lo apaga al
cerrarla: sin backend remoto y sin cuenta.

- **Proxies locales de imagen y HLS.** Los streams de los CDN bloquean peticiones de otro
  origen, así que miso los sirve por su propio proxy local. Eso hace posible la reproducción
  dentro de la app sin una pasarela por medio.
- **Extracción en cascada.** Por cada fuente intenta en orden: analizar el HTML, luego el
  reproductor embebido, luego un Chromium headless, y se detiene en el primer resultado que es
  reproducible y válido. Sin trabajo desperdiciado.

**Lo que importaba**

- **Agrupar antes que duplicar.** La tarjeta `+N` es la idea central: un título, muchas
  fuentes. Mantiene la rejilla en calma en vez de mostrar el mismo póster ocho veces.
- **Carga que dice la verdad.** Las fuentes responden a distinta velocidad, así que el progreso
  se muestra por fuente en vez de un único spinner: las lentas no parecen rotas.
- **Mantenerlo silencioso.** Sin rastreadores ni espacios de anuncios. La pantalla es el muro
  de pósters y el reproductor.

**Dónde está**

miso es el proyecto que más uso y el que sigo mejorando. Los resultados llegan en menos de
**5 segundos**, pero la capa de extracción es la que envejece más rápido —las fuentes
cambian—, así que necesita atención. Ese es justo el siguiente paso.

**Enlaces** — [github.com/enmanuel400/Miso](https://github.com/enmanuel400/Miso)

---

## 4. Caso: **sysdash**

### EN

**Eyebrow:** Case study
**Title:** sysdash
**Bajada:** A real-time system monitor that gives you a terminal's worth of information without the terminal.
**Meta:** Role — design, frontend & backend · Year — 2026 · Status — in continuous improvement · Stack — Python, FastAPI, psutil · JavaScript, Tailwind, Chart.js

**The problem**

To know what your machine is doing you usually drop into a terminal and read `top`/`htop`:
precise, but dense and unforgiving. I wanted the same information as something I could read at
a glance — without giving up the precision.

**What I built**

A dashboard that shows CPU (total and per core), memory, swap, disk, network, disk I/O,
temperature, active processes and system services, updating live. The API serves the dashboard
itself, so there's one process to start and one URL to open.

The visual identity is a "technical blueprint": graph paper, dashed plan frames, status stamps
and instrument-like type. Dark by default, with a light switch whose choice is remembered
without a flash on reload.

**How it works**

- **An internal sampler.** The backend samples the system every second in the background.
  Because of that the API answers instantly, and network and disk rates are correct from the
  first render instead of warming up.
- **States that tell the truth.** A `● LIVE` / `○ OFFLINE` stamp with automatic retry and an
  offline banner while the API is down.
- **Destructive actions behind a confirmation.** Terminating a process opens a modal before it
  sends SIGTERM; cleaning logs explains what it will remove first.

**What mattered**

- **Density without noise.** Per-core CPU, thresholds and a 90-second history are all there, but
  arranged so the first read is simple.
- **Precision over decoration.** The blueprint look isn't a skin; it frames numbers the way an
  instrument panel does.

**Where it is**

sysdash only reads metrics and performs two explicit actions — terminate a process, clean
systemd logs older than 7 days. It never touches your files.

**Links** — [github.com/enmanuel400/Portfolio](https://github.com/enmanuel400/Portfolio/tree/master/sysdash)

### ES

**Eyebrow:** Caso de estudio
**Title:** sysdash
**Bajada:** Un monitor del sistema en tiempo real que te da la información de un terminal sin el terminal.
**Meta:** Rol — diseño, frontend y backend · Año — 2026 · Estado — en mejora continua · Stack — Python, FastAPI, psutil · JavaScript, Tailwind, Chart.js

**El problema**

Para saber qué está haciendo tu equipo, lo normal es bajar a un terminal y leer `top`/`htop`:
preciso, pero denso y poco amable. Quería esa misma información como algo que se pudiera leer
de un vistazo, sin renunciar a la precisión.

**Qué construí**

Un panel que muestra CPU (total y por núcleo), memoria, swap, disco, red, E/S de disco,
temperatura, procesos activos y servicios del sistema, actualizándose en vivo. La propia API
sirve el panel, así que hay un proceso que arrancar y una URL que abrir.

La identidad visual es un "plano técnico": papel cuadriculado, marcos discontinuos de plano,
sellos de estado y tipografía de instrumentación. Oscuro por defecto, con conmutador a claro
cuya elección se recuerda sin parpadeo al recargar.

**Cómo funciona**

- **Un sampler interno.** El backend muestrea el sistema cada segundo en segundo plano. Gracias
  a eso la API responde al instante y las velocidades de red y disco son correctas desde el
  primer render, en vez de ir calentando.
- **Estados que dicen la verdad.** Un sello `● EN VIVO` / `○ SIN CONEXIÓN` con reintento
  automático y un aviso de desconexión mientras la API no responde.
- **Acciones destructivas tras una confirmación.** Terminar un proceso abre un modal antes de
  enviar SIGTERM; limpiar logs explica antes qué va a borrar.

**Lo que importaba**

- **Densidad sin ruido.** CPU por núcleo, umbrales y un histórico de 90 segundos están ahí,
  pero ordenados para que la primera lectura sea simple.
- **Precisión antes que decoración.** El look de plano no es una piel: enmarca los números como
  lo haría un panel de instrumentos.

**Dónde está**

sysdash solo lee métricas y ejecuta dos acciones explícitas: terminar un proceso y limpiar logs
de systemd de más de 7 días. Nunca toca tus archivos.

**Enlaces** — [github.com/enmanuel400/Portfolio](https://github.com/enmanuel400/Portfolio/tree/master/sysdash)

---

## 5. Escritos (3)

Título + tesis. Cuando valides, escribo cada pieza completa.

### EN

1. **The states you skip**
   Empty, loading and error states are what separate a demo from a finished interface. I walk
   through how I handle them in miso and sysdash.

2. **Local servers are a feature**
   Putting a server *inside* a desktop app isn't over-engineering. It's how miso sidesteps CORS,
   skips the ads and keeps your data on your machine.

3. **A design system for one person**
   How a handful of tokens — colour, type, spacing — keep a solo project coherent without
   turning into bureaucracy. Uses this very site as the example.

### ES

1. **Los estados que te saltas**
   Los estados vacío, de carga y de error son lo que separa una demo de una interfaz terminada.
   Recorro cómo los trato en miso y sysdash.

2. **Los servidores locales son una función**
   Meter un servidor *dentro* de una app de escritorio no es sobre-ingeniería. Es como miso
   esquiva el CORS, se salta los anuncios y mantiene tus datos en tu equipo.

3. **Un design system para una persona**
   Cómo un puñado de tokens —color, tipo, espacio— mantiene coherente un proyecto en solitario
   sin convertirse en burocracia. Con este mismo sitio como ejemplo.

---

## 6. Decisiones cerradas

1. **sysdash — próximos pasos**: omitido. El caso cierra en que solo lee métricas y no toca archivos.
2. **Escritos**: artículo corto, **600–900 palabras** cada uno.
3. **Retrato**: `assets/perfil.jpeg` en Sobre mí, **sin pie de foto**.
4. **Idioma**: **automático**. Inglés canónico en la raíz; si el navegador pide español y no hay
   elección previa, se redirige a `/es` sin parpadeo. El conmutador manual recuerda la elección.
