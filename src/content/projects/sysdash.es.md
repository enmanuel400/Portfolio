---
slug: sysdash
lang: es
title: sysdash
tagline: Un monitor del sistema en vivo que se lee como un panel de instrumentos.
lede: >-
  Un monitor del sistema en tiempo real que te da la información de un terminal sin el terminal.
role: Diseño, frontend y backend
year: "2026"
status: En mejora continua
stack: [Python, FastAPI, psutil, JavaScript, Tailwind, Chart.js]
repo: https://github.com/enmanuel400/Portfolio/tree/master/sysdash
image: ../../assets/projects/sysdash-dark.png
order: 3
description: Panel del sistema en tiempo real con CPU, memoria, disco, red, procesos y servicios, servido por su propia API.
---

## El problema

Para saber qué está haciendo tu equipo, lo normal es bajar a un terminal y leer `top`/`htop`:
preciso, pero denso y poco amable. Quería esa misma información como algo que se pudiera leer
de un vistazo, sin renunciar a la precisión.

## Qué construí

Un panel que muestra CPU (total y por núcleo), memoria, swap, disco, red, E/S de disco,
temperatura, procesos activos y servicios del sistema, actualizándose en vivo. La propia API
sirve el panel, así que hay un proceso que arrancar y una URL que abrir.

La identidad visual es un "plano técnico": papel cuadriculado, marcos discontinuos de plano,
sellos de estado y tipografía de instrumentación. Oscuro por defecto, con conmutador a claro
cuya elección se recuerda sin parpadeo al recargar.

## Cómo funciona

- **Un sampler interno.** El backend muestrea el sistema cada segundo en segundo plano. Gracias
  a eso la API responde al instante y las velocidades de red y disco son correctas desde el
  primer render, en vez de ir calentando.
- **Estados que dicen la verdad.** Un sello `● EN VIVO` / `○ SIN CONEXIÓN` con reintento
  automático y un aviso de desconexión mientras la API no responde.
- **Acciones destructivas tras una confirmación.** Terminar un proceso abre un modal antes de
  enviar SIGTERM; limpiar logs explica antes qué va a borrar.

## Lo que importaba

- **Densidad sin ruido.** CPU por núcleo, umbrales y un histórico de 90 segundos están ahí,
  pero ordenados para que la primera lectura sea simple.
- **Precisión antes que decoración.** El look de plano no es una piel: enmarca los números como
  lo haría un panel de instrumentos.

## Dónde está

sysdash solo lee métricas y ejecuta dos acciones explícitas: terminar un proceso y limpiar logs
de systemd de más de 7 días. Nunca toca tus archivos.
