---
slug: miso
lang: en
title: miso
tagline: Federated film and series search that plays inside the app.
lede: >-
  A desktop search for film and series that queries several sites at once, merges the
  results, and plays the video inside the app — no tabs, no popups, no ads.
role: Design, frontend & backend
year: "2026"
status: In continuous improvement
stack: [Electron, Node/Express, React, Vite, TypeScript, Playwright, hls.js]
repo: https://github.com/enmanuel400/Miso
image: ../../assets/projects/miso.png
order: 1
star: true
description: A desktop search for film and series that merges several sources into one grid and plays the video in-app.
---

## The problem

Watching one specific film usually means opening several sites, closing the dead ones, dodging
pop-ups and playing "find the real play button". The content is scattered across services and
each one wants the whole screen. I wanted the opposite: search once, see everything, play it,
close the app.

## What I built

A desktop app that runs locally. You type a title once; miso queries four sources at the same
time and lays the results out in a single grid. A title found on more than one source doesn't
repeat — it becomes one card with a small **`+N`** badge that opens the alternatives. Press
play and the video runs inside the app.

## How it works

Everything happens on your machine. The app starts its own Node server on launch and shuts it
down when you close it: no remote backend, no account.

- **Local proxies for images and HLS.** CDN streams block cross-origin requests, so miso serves
  them through its own local proxy. That's what makes in-app playback possible without a
  gateway in the middle.
- **Cascade extraction.** For each source it tries in order — parse the HTML, then the embedded
  player, then a headless Chromium — and stops at the first result that is actually playable
  and valid. No wasted work.

## What mattered

- **Grouping over duplication.** The `+N` card is the core idea: one title, many sources. It
  keeps the grid calm instead of showing the same poster eight times.
- **Loading that tells the truth.** Sources answer at different speeds, so progress shows per
  source instead of one spinner — slow ones don't look broken.
- **Staying quiet.** No trackers, no ad slots. The screen is the poster wall and the player.

## Where it is

miso is the project I use the most and the one I keep improving. Results come back in under
**5 seconds**, but the extraction layer is the part that ages fastest — sources change, so it
needs attention. That's exactly the next pass.
