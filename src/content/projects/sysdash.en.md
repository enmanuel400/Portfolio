---
slug: sysdash
lang: en
title: sysdash
tagline: A live system monitor that reads like an instrument panel.
lede: >-
  A real-time system monitor that gives you a terminal's worth of information without the
  terminal.
role: Design, frontend & backend
year: "2026"
status: In continuous improvement
stack: [Python, FastAPI, psutil, JavaScript, Tailwind, Chart.js]
repo: https://github.com/enmanuel400/Portfolio/tree/master/sysdash
image: ../../assets/projects/sysdash-dark.png
order: 3
description: A real-time system dashboard showing CPU, memory, disk, network, processes and services, served by its own API.
---

## The problem

To know what your machine is doing you usually drop into a terminal and read `top`/`htop`:
precise, but dense and unforgiving. I wanted the same information as something I could read at
a glance — without giving up the precision.

## What I built

A dashboard that shows CPU (total and per core), memory, swap, disk, network, disk I/O,
temperature, active processes and system services, updating live. The API serves the dashboard
itself, so there's one process to start and one URL to open.

The visual identity is a "technical blueprint": graph paper, dashed plan frames, status stamps
and instrument-like type. Dark by default, with a light switch whose choice is remembered
without a flash on reload.

## How it works

- **An internal sampler.** The backend samples the system every second in the background.
  Because of that the API answers instantly, and network and disk rates are correct from the
  first render instead of warming up.
- **States that tell the truth.** A `● LIVE` / `○ OFFLINE` stamp with automatic retry and an
  offline banner while the API is down.
- **Destructive actions behind a confirmation.** Terminating a process opens a modal before it
  sends SIGTERM; cleaning logs explains what it will remove first.

## What mattered

- **Density without noise.** Per-core CPU, thresholds and a 90-second history are all there, but
  arranged so the first read is simple.
- **Precision over decoration.** The blueprint look isn't a skin; it frames numbers the way an
  instrument panel does.

## Where it is

sysdash only reads metrics and performs two explicit actions — terminate a process, clean
systemd logs older than 7 days. It never touches your files.
