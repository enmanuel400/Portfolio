---
slug: local-servers-are-a-feature
lang: en
title: Local servers are a feature
description: "Putting a server inside a desktop app isn't over-engineering. How miso sidesteps CORS, skips the ads and keeps your data on your machine."
order: 2
---

Watching one specific film usually means opening several sites, closing the dead ones, dodging pop-ups and playing "find the real play button". The content is scattered, each site wants the whole screen, and half of them are lying about what they have. I wanted the opposite: search once, see everything, play it, close the app.

That's miso, and the decision that shapes all of it is that miso runs its own server. Not a backend somewhere — a Node process that starts inside the app on your machine and shuts down when you close it. It sounds like over-engineering for a search box. I've come to think the local server *is* the feature.

## The CORS wall

Everything about miso that feels obvious runs into the same wall. The results come from several sources, and the videos and posters live on those sources' CDNs. A page in a browser can't just ask another domain for a stream: cross-origin requests are blocked by default, and for video it's worse, because the playlist has to fetch its own segments.

The usual escape is a remote middleman — a proxy server you run somewhere that fetches on behalf of the page. That works, but now there's infrastructure, a place where your requests are logged, and a dependency that can go down. For a small app, that's a lot of moving parts bought with someone else's computer.

miso takes the other exit. It starts its own Node server on launch and serves the cross-origin requests from there, so to the page everything comes from the same origin. The proxy is a few routes, the app ships small, and there's nothing to host.

## A local server buys things you can feel

Once the server is already there, it stops being just a CORS workaround and starts being a place to do real work:

- **Working around CORS**, so video plays inside the app instead of kicking you out to a browser tab.
- **Skipping the ads**, because miso never renders the source pages — it extracts the stream and plays that. No pop-ups, no interstitials, no redirect maze.
- **Keeping data on the machine.** There's no account and no remote backend. The app starts its server on launch and shuts it down when you close it. Your data has nowhere to go because there is nowhere to send it.
- **Cascade extraction.** For each source it tries in order — parse the HTML, then the embedded player, then a headless Chromium — and stops at the first result that is actually playable. That's the expensive part, and it belongs next to the browser engine, not on a page.

The same design shows up in the reading: a title found on more than one source doesn't repeat. It becomes one card with a small **`+N`** badge that opens the alternatives. Four sources, one grid.

## What it costs

A server inside a desktop app isn't free, and pretending otherwise would be dishonest:

- **Lifecycle.** It has to start with the app and die with it. A stray process left listening on a port is a bug you'll meet again later.
- **Ports and packaging.** You need to pick a port and handle the case where it's taken, and you have to ship a runtime, not just static files. That's more than a website needs.
- **A surface to keep small.** A local server is still a server. It binds to localhost, only accepts what it expects, and doesn't talk to the network more than it has to.

None of that is disqualifying. It's the normal price of running a process, and I'd rather pay it once than hand the same work to a remote service.

## When it isn't the answer

I wouldn't put a server inside every app. If what you're building needs accounts, shared state or sync between devices, the server belongs in the middle, on purpose — that's exactly what servers are for. Local-first is a choice about who owns the data, and it only makes sense if you mean it.

It also means giving up things a cloud gives you for free: no server-side analytics, no server-rendered SEO, no "log in on any machine." For miso, all three are features. The app is a tool for one person on one computer, and it behaves like one.

That's the argument, and it's narrower than "local is always better." A local server is a feature when the thing you're fighting is the browser sandbox, when latency and privacy are the point, and when the honest answer to "where should this run?" is "where the user already is."
