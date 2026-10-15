---
slug: kata
lang: es
title: kata
tagline: Navegador de escritorio privado y local. Sin cuentas ni telemetría.
lede: >-
  Un navegador de escritorio que deja tu vida en tu equipo: sin cuentas, sin telemetría y sin
  sincronización forzada.
role: Diseño, frontend y backend
year: "2026"
status: En mejora continua
stack: [Tauri 2, React 19, TypeScript, Rust]
repo: https://github.com/enmanuel400/Kata
image: ../../assets/projects/kata-home.webp
order: 2
description: Navegador de escritorio privado y local construido sobre Tauri, sin cuentas, sin telemetría y sin sincronización forzada.
---

## El problema

Casi todos los navegadores tratan tu equipo como la caché del servidor de otra empresa. Inicias
sesión, sincronizas, y tu historial, tus pestañas y tus contraseñas viajan a una compañía que no
controlas. Para mucha gente es un intercambio justo. Yo quería ver cómo es un navegador que
asume lo contrario: el estado se queda en el dispositivo y nada sale de él.

## Qué construí

kata es un navegador de escritorio para Linux construido sobre Tauri. Hace el trabajo de todos
los días de un navegador y luego se queda callado: sin cuenta, sin telemetría, sin ruido de
fondo. Tu historial, tu sesión y tus ajustes viven en un archivo local, y ese es todo el trato.

La página de inicio es una rejilla *bento*: un conjunto compacto de mosaicos en vez de un
buscador enterrado bajo un muro de marcadores.

## Cómo funciona

- **Núcleo nativo, interfaz web.** Tauri 2 pone la capa de sistema y el motor de render en
  Rust, mientras que la interfaz es React 19 + TypeScript. La app pesa poco y se comporta como
  una ventana nativa, no como una web envuelta.
- **Local por diseño.** No hay servidor con el que hablar, así que no hay nada que sincronizar
  ni nada que filtrar. Aquí la privacidad es lo por defecto, no un ajuste que haya que buscar.

## Lo que importaba

- **La privacidad como punto de partida.** Cada función tenía que justificar su acceso a la
  red; la mayoría no lo logró.
- **Un inicio que es un espacio de trabajo.** La página bento está hecha para usarse, no solo
  para mirarse.

## Dónde está

kata funciona y lo sigo apretando. El siguiente paso es el rendimiento: en reposo ronda los
**200–300 MB** y quiero bajarlo. Un navegador privado pero pesado no está terminado.
