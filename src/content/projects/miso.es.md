---
slug: miso
lang: es
title: miso
tagline: Buscador federado de cine y series que reproduce dentro de la app.
lede: >-
  Un buscador de escritorio de cine y series que consulta varias webs a la vez, unifica los
  resultados y reproduce el vídeo dentro de la app: sin pestañas, sin ventanas emergentes y sin
  anuncios.
role: Diseño, frontend y backend
year: "2026"
status: En mejora continua
stack: [Electron, Node/Express, React, Vite, TypeScript, Playwright, hls.js]
repo: https://github.com/enmanuel400/Miso
image: ../../assets/projects/miso.png
order: 1
star: true
description: Buscador de escritorio de cine y series que unifica varias fuentes en una rejilla y reproduce el vídeo dentro de la app.
---

## El problema

Ver una película concreta suele significar abrir varias webs, cerrar las que están caídas,
esquivar ventanas emergentes y jugar a "encuentra el botón de reproducir de verdad". El
contenido está repartido entre servicios y cada uno quiere la pantalla entera. Yo quería lo
contrario: buscar una vez, verlo todo, reproducir y cerrar.

## Qué construí

Una app de escritorio que corre en local. Escribes un título una vez; miso consulta cuatro
fuentes al mismo tiempo y coloca los resultados en una sola rejilla. Un título encontrado en
más de una fuente no se repite: se convierte en una tarjeta con una insignia **`+N`** que abre
las alternativas. Le das a reproducir y el vídeo corre dentro de la app.

## Cómo funciona

Todo ocurre en tu equipo. La app levanta su propio servidor Node al abrirse y lo apaga al
cerrarla: sin backend remoto y sin cuenta.

- **Proxies locales de imagen y HLS.** Los streams de los CDN bloquean peticiones de otro
  origen, así que miso los sirve por su propio proxy local. Eso hace posible la reproducción
  dentro de la app sin una pasarela por medio.
- **Extracción en cascada.** Por cada fuente intenta en orden: analizar el HTML, luego el
  reproductor embebido, luego un Chromium headless, y se detiene en el primer resultado que es
  reproducible y válido. Sin trabajo desperdiciado.

## Lo que importaba

- **Agrupar antes que duplicar.** La tarjeta `+N` es la idea central: un título, muchas
  fuentes. Mantiene la rejilla en calma en vez de mostrar el mismo póster ocho veces.
- **Carga que dice la verdad.** Las fuentes responden a distinta velocidad, así que el progreso
  se muestra por fuente en vez de un único spinner: las lentas no parecen rotas.
- **Mantenerlo silencioso.** Sin rastreadores ni espacios de anuncios. La pantalla es el muro
  de pósters y el reproductor.

## Dónde está

miso es el proyecto que más uso y el que sigo mejorando. Los resultados llegan en menos de
**5 segundos**, pero la capa de extracción es la que envejece más rápido —las fuentes
cambian—, así que necesita atención. Ese es justo el siguiente paso.
