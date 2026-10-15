# Fase 2 — Borrador de contenido · v1

> Cómo usar esto: revisa **voz**, **datos** y **estructura**. Todo lo que va entre
> `[? ...]` es un hueco que solo puedes llenar tú (fechas, motivación, métricas).
> Con tu corrección sobre estas dos piezas escribo el resto con la misma voz.

Decisiones de fondo:
- Voz: primera persona, sobria, concreta. Cero relleno y cero palabras de moda.
- Honestidad: autodidacta, sin inventar puestos ni clientes.
- Un dato que no pueda respaldar, no se escribe.

---

## 0. Huecos que necesito que confirmes

1. **Años** de cada proyecto (`[? año]` en cada caso).
2. **Tu rol exacto**: ¿solo diseño + frontend, o también backend en sysdash? En kata y miso, ¿qué partes tocaste tú?
3. **Métricas reales** si existen: RAM en reposo de kata, tiempo de búsqueda de miso, nº de fuentes que consulta… Si no las tienes, las omito (mejor que inventarlas).
4. **Estado de cada uno**: ¿qué está terminado y qué sigue en curso? (sé que miso está "en mejora continua").
5. **Contacto**: confirmo que el formulario va a `enmanuelpirela400@gmail.com` vía Resend.

---

## 1. Sobre mí (About)

### EN

**H1:** I build interfaces that hold up on the tenth visit.

I'm a frontend developer, self-taught. No degree, no bootcamp — a lot of reading, a lot of
broken builds, and a stubborn habit of finishing what I start. Everything you see on this
site I designed and built myself, front to back, from the first pixel to the API behind it.

I care about the part of the work that's easy to skip: the empty state, the first load, the
moment something fails. A clean hero is the beginning of the job, not the job. What I want
to make is an interface that still feels considered after you've used it for a while.

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
- Building **[miso](/work/miso)**, a desktop search for streaming that skips the ad-bloated pages.
- Open to frontend roles and freelance work.

→ GitHub · LinkedIn · Email

### ES

**H1:** Construyo interfaces que aguantan la décima visita.

Soy desarrollador frontend, autodidacta. Sin título, sin bootcamp: mucha lectura, muchas
builds rotas y la costumbre tercas de terminar lo que empiezo. Todo lo que ves en este sitio
lo diseñé y construí yo, de punta a punta, del primer píxel a la API que hay detrás.

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
- Construyendo **[miso](/work/miso)**, un buscador de escritorio para streaming que se salta las páginas llenas de anuncios.
- Abierto a puestos frontend y trabajo freelance.

→ GitHub · LinkedIn · Email

---

## 2. Caso: **miso** (pieza completa)

### EN

**Eyebrow:** Case study
**Title:** miso
**One-liner:** A desktop search for film and series that queries many sites at once, merges the
results, and plays the video inside the app — no tabs, no popups, no ads.
**Meta:** Role — design & frontend · Year — `[? año]` · Status — in continuous improvement · Stack — Electron, Node/Express, React, Vite, TypeScript, Playwright, hls.js

**The problem**

Watching a specific film usually means opening several sites, closing the ones that are dead,
dodging pop-ups and playing "find the real play button". The content is scattered across
services, and each one wants to own the whole screen. I wanted the opposite: search once,
see everything, play it and close the app.

**What I built**

A desktop app that runs locally. You type a title once; miso queries several sources at the
same time and lays the results out in a single grid. The same title found on more than one
source doesn't appear twice — it becomes one card with a small **`+N`** badge that opens the
alternatives. When you press play, the video runs inside the app.

**How it works**

Everything happens on your machine. The app spins up its own Node server on launch and shuts
it down when you close it — there's no remote backend and no account.

Two pieces do the heavy lifting:
- **Local proxies for images and HLS.** CDN streams block cross-origin requests, so the app
  serves them through its own local proxy. That's what makes in-app playback possible without
  a gateway in the middle.
- **Cascade extraction.** For each source, miso tries in order — parse the HTML, then the
  embedded player, then a headless Chromium — and stops at the first result that is actually
  playable and valid. No wasted work.

**The parts that mattered**

- **Grouping over duplication.** The `+N` card is the core idea: one title, many sources. It
  keeps the grid calm instead of showing the same poster eight times.
- **Loading that tells the truth.** Sources answer at different speeds. The UI shows progress
  per source instead of a single spinner, so slow ones don't look broken.
- **Staying quiet.** No trackers, no ad slots. The screen is the poster wall and the player.

**Where it is**

miso is the project I use the most and the one I keep improving. The extraction layer is the
part that ages the fastest — sources change, so it needs attention. `[? qué sigue / próximos pasos]`

**Links** — GitHub `[? repo: github.com/enmanuel400/Miso]`

### ES

**Eyebrow:** Caso de estudio
**Title:** miso
**Bajada:** Un buscador de escritorio de cine y series que consulta varias webs a la vez,
unifica los resultados y reproduce el vídeo dentro de la app: sin pestañas, sin ventanas
emergentes y sin anuncios.
**Meta:** Rol — diseño y frontend · Año — `[? año]` · Estado — en mejora continua · Stack — Electron, Node/Express, React, Vite, TypeScript, Playwright, hls.js

**El problema**

Para ver una película concreta lo normal es abrir varias webs, cerrar las que están caídas,
esquivar ventanas emergentes y jugar a "encuentra el botón de reproducir de verdad". El
contenido está repartido entre servicios y cada uno quiere quedarse con la pantalla entera.
Yo quería lo contrario: buscar una vez, verlo todo, reproducir y cerrar.

**Qué construí**

Una app de escritorio que corre en local. Escribes un título una vez; miso consulta varias
fuentes al mismo tiempo y coloca los resultados en una sola rejilla. El mismo título
encontrado en más de una fuente no se repite: se convierte en una tarjeta con una insignia
**`+N`** que abre las alternativas. Cuando le das a reproducir, el vídeo corre dentro de la app.

**Cómo funciona**

Todo ocurre en tu equipo. La app levanta su propio servidor Node al abrirse y lo apaga al
cerrarla: no hay backend remoto ni cuenta.

Dos piezas hacen el trabajo pesado:
- **Proxies locales de imagen y HLS.** Los streams de los CDN bloquean peticiones de otro
  origen, así que la app los sirve a través de su propio proxy local. Eso es lo que hace
  posible la reproducción dentro de la app sin una pasarela por medio.
- **Extracción en cascada.** Por cada fuente, miso intenta en orden: analizar el HTML, luego
  el reproductor embebido, luego un Chromium headless, y se detiene en el primer resultado que
  es reproducible y válido. Sin trabajo desperdiciado.

**Lo que importaba**

- **Agrupar antes que duplicar.** La tarjeta `+N` es la idea central: un título, muchas
  fuentes. Mantiene la rejilla en calma en vez de mostrar el mismo póster ocho veces.
- **Carga que dice la verdad.** Las fuentes responden a distinta velocidad. La interfaz muestra
  el progreso por fuente en vez de un único spinner, para que las lentas no parezcan rotas.
- **Mantenerlo silencioso.** Sin rastreadores ni espacios de anuncios. La pantalla es el muro
  de pósters y el reproductor.

**Dónde está**

miso es el proyecto que más uso y el que sigo mejorando. La capa de extracción es la que
envejece más rápido —las fuentes cambian—, así que necesita atención. `[? qué sigue / próximos pasos]`

**Enlaces** — GitHub `[? repo: github.com/enmanuel400/Miso]`

---

## 3. Casos: **kata** y **sysdash** (esquema + ángulo)

Mismo template. Los desarrollo en cuanto valides miso.

### kata — ángulo: «un navegador que no deja rastro»
- **Problema:** los navegadores actuales asumen que tu vida debe sincronizarse con algún servidor.
- **Qué es:** navegador de escritorio privado, local y silencioso. Sin cuentas, sin telemetría, sin sincronización forzada; el estado vive en tu equipo. Construido para Linux con Tauri.
- **Foco de diseño:** la página de inicio tipo *bento* y la sensación de ligereza (RAM baja), que es justo lo que un motor basado en Rust permite.
- **Stack:** Tauri 2, React 19, TypeScript, Rust.
- **Faltan:** `[? año]`, `[? RAM en reposo o cualquier número real]`, `[? qué partes tocaste]`.

### sysdash — ángulo: «un terminal lleno de información, sin el terminal»
- **Problema:** leer el estado del sistema suele significar `top`/`htop` y salida cruda.
- **Qué es:** dashboard que muestra CPU (total y por núcleo), RAM, swap, disco, red, E/S, temperatura, procesos y servicios, en tiempo real. La propia API sirve el dashboard: arrancas **un** proceso y abres **una** URL.
- **Foco de diseño:** identidad «blueprint técnico» (papel cuadriculado, marcos de plano, sellos de estado), tema oscuro por defecto con conmutador sin parpadeo, y estados honestos (sello `● EN VIVO` / `○ SIN CONEXIÓN` con reintento).
- **Detalle técnico que vale contar:** un *sampler* interno muestrea cada segundo en segundo plano, así que la API responde al instante y las velocidades de red/disco son correctas desde el primer render.
- **Stack:** Python, FastAPI, Uvicorn, psutil · JavaScript, Tailwind, Chart.js.
- **Faltan:** `[? año]`, `[? tu rol exacto, sobre todo en el backend]`.

---

## 4. Escritos (working title + tesis)

Tres piezas cortas. Título en inglés, tesis en una frase.

1. **The states you skip**
   Empty, loading and error states decide whether an interface feels finished. Cómo los trato
   en proyectos propios, con ejemplos de miso y sysdash.

2. **Local servers are a feature**
   Por qué meter un servidor *dentro* de una app de escritorio (miso) no es sobre-ingeniería:
   resuelve CORS, evita anuncios y mantiene los datos en tu equipo.

3. **A design system for one person**
   Cómo un puñado de tokens (color, tipo, espacio) mantiene coherente un proyecto en solitario
   sin convertirse en burocracia. Enlaza con este mismo sitio.

`[? ¿te sirven estos tres o prefieres otros temas?]`

---

## 5. Template de caso de estudio (para referencia)

```
Eyebrow · Título · Bajada (1 línea) · Meta (rol · año · estado · stack)
1. El problema      — 2-3 párrafos, sin tecnicismos
2. Qué construí     — qué hace, en claro
3. Cómo funciona    — 2-3 puntos técnicos, con entrada a capturas
4. Lo que importaba — decisiones de diseño/UX y por qué
5. Dónde está       — estado actual + qué sigue
Enlaces             — repo / demo
```
