---
slug: kata
lang: en
title: kata
tagline: A private, local desktop browser. No accounts, no telemetry.
lede: >-
  A desktop browser that keeps your life on your machine — no accounts, no telemetry, no
  forced sync.
role: Design, frontend & backend
year: "2026"
status: In continuous improvement
stack: [Tauri 2, React 19, TypeScript, Rust]
repo: https://github.com/enmanuel400/Kata
image: ../../assets/projects/kata-home.webp
order: 2
description: A private, local desktop browser built on Tauri, with no accounts, no telemetry and no forced sync.
---

## The problem

Most browsers treat your machine as a cache for someone else's server. You sign in, you sync,
and your history, tabs and passwords flow to a company you don't control. For plenty of people
that's a fair trade. I wanted to see what a browser looks like when it assumes the opposite:
the state stays on the device, and nothing leaves it.

## What I built

kata is a desktop browser for Linux built on Tauri. It does the everyday job of a browser and
then stays quiet: no account, no telemetry, no background chatter. Your history, session and
settings live in a local file — and that's the whole arrangement.

The start page is a bento grid: a compact set of tiles rather than a search box buried under a
wall of bookmarks.

## How it works

- **Native core, web interface.** Tauri 2 puts the system layer and the rendering engine in
  Rust, while the interface is React 19 + TypeScript. The app ships small and behaves like a
  native window, not a wrapped website.
- **Local-first by design.** There is no server to talk to, so there is nothing to sync and
  nothing to leak. Privacy here is the default, not a setting you have to find.

## What mattered

- **Privacy as the starting point.** Every feature had to justify its network access; most
  didn't.
- **A home that's a workspace.** The bento start page is meant to be used, not just looked at.

## Where it is

kata works and I keep tightening it. The next pass is performance: at rest it sits around
**200–300 MB**, and I want that lower. A browser that's private but heavy isn't finished.
