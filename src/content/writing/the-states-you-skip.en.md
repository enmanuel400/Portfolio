---
slug: the-states-you-skip
lang: en
title: The states you skip
description: Empty, loading and error states are what separate a demo from a finished interface. How I handle them in miso and sysdash.
order: 1
---

Every project demo shows the same three seconds: data loaded, everything working, the cursor moving with confidence. That's the happy path, and it's the cheapest part of an interface to build. The expensive part is everything around it — before the data arrives, when there is no data, and when something breaks. Those are the states most projects skip, and they are the ones users meet first.

I've been building miso and sysdash, and most of what I actually designed in them isn't the grid or the charts. It's the states.

## Empty is not one state

"Empty" gets treated as a single screen with an illustration and a line of copy. In practice it's at least three different situations that need different answers.

The first is *nothing yet*: you opened the app and haven't done anything. miso shows a search field and nothing else — no fake poster grid to fill the space. Sample content there would be a lie the user has to unlearn.

The second is *nothing matched*: you searched and there were no results. That's not the same as the first, and the copy can't be the same either. The user did something and got nothing back, so the screen should acknowledge the query and suggest a way forward — a different spelling, a broader term, another source.

The third is *nothing because it failed*. That's not empty at all; it's an error, and calling it "no results" hides the problem. It deserves its own state, its own wording, and usually a retry.

Merging these into one pretty empty screen is how an interface ends up feeling dumb. They are three different messages.

## Loading should tell the truth

A single spinner is the lazy answer, and it gets worse the more sources you have. miso queries four sites at once, and they do not answer at the same time. One comes back in 200 ms, another takes a few seconds, a third may time out entirely.

With one spinner the whole grid would look equally broken and then equally fine, when the reality is uneven. Instead, progress is shown per source: the fast one fills in immediately and is already clickable while the slow one is still working. The wait stops being a wall and becomes a queue you can see.

sysdash has the opposite problem, and the fix lives in the backend. The API samples the system every second in a background loop, so when the dashboard asks, the answer is already there. Network and disk rates are correct on the first render instead of starting at zero and warming up. Loading isn't hidden; it's just finished before you look.

A spinner is a confession that you don't know what's happening. If you do know — which source, which request, how far along — show that instead.

## Errors are a design problem

The instinct is to treat an error as an exception: catch it, log it, show a toast, move on. But the error state is a screen the user will actually see, and it should be designed like one.

In miso, one source failing is not the whole app failing. The grid keeps the sources that answered and quietly drops the one that didn't. A partial result is almost always more useful than an error page. The important part is that the interface doesn't pretend: the missing source is *missing*, not empty.

In sysdash, when the API goes down a `● LIVE` / `○ OFFLINE` stamp flips, an offline banner explains what you're looking at, and an automatic retry keeps trying in the background. You are never left reading a frozen number and wondering whether it is still current. A stale number shown as live is worse than no number at all.

The one thing I try to avoid everywhere is the generic error. "Something went wrong" tells the user nothing they didn't already know. Say what failed, whether their data is safe, and what to do next.

## The tenth visit

A demo is built for the first visit: data loaded, everything working, someone watching. The states you skip are the ones that show up on the tenth visit, when the network is slow and a source is down. That's where an interface earns or loses trust.

They aren't an afterthought you bolt on at the end. In miso and sysdash they took more thought than the happy path, and they're the part I'd defend first. A clean grid is the beginning of the job. The empty, loading and error states are the rest of it.
