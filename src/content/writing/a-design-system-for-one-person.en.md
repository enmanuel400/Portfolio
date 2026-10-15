---
slug: a-design-system-for-one-person
lang: en
title: A design system for one person
description: "How a handful of tokens — colour, type, spacing — keep a solo project coherent without turning into bureaucracy. With this site as the example."
order: 3
---

Design systems are usually pitched to teams. They exist because fifty people need to ship a consistent product, so you write the rules down and hand them out. If you're one person building one site, the pitch doesn't obviously apply: you're the whole team, you remember the rules, so why write them down?

Because you don't remember. Nobody does. Three weeks later you're picking a spacing value by eye and a shade of grey you've used nowhere else. The drift is invisible day to day and obvious in a screenshot.

So I keep a design system, but a small one. Not a component library, not a documentation site. A file of tokens and a handful of rules. This site is the example.

## Tokens are the whole idea

A token is just a named value: `--space-4`, `--text-sm`, `--accent`. The point isn't the naming, it's that the value has one home. When I change my mind about the accent colour, I change it once.

Mine covers four families:

- **Colour.** A background, a foreground, a muted foreground, two surface levels, a line colour, and the accent. Dark is the default; light is a variant of the same names. Theming is then free — the switch flips values, not layouts.
- **Type.** Two families and a scale. Display type is one font; body text is another; code is monospace and only for code. A small set of sizes from `--text-sm` to `--display-l` covers every heading on the site.
- **Space.** A scale based on one unit, so gaps are `--space-2` or `--space-6` and never `17px`.
- **Radius.** Controls get one value, surfaces another, tags a pill. Three decisions, applied everywhere.

That's it. If I can't justify a token by needing it in more than one place, it doesn't get made.

## One rule beats ten

The tokens do the consistency work. On top of them I keep a very small number of rules, mostly about restraint.

The one I care about most here: the accent colour is only for large type and graphics, not for body text on a light background. Lime on white is unreadable, and pretending otherwise is how a bold accent becomes a mistake. So there's a second token — the same hue, darker — for anything textual: links, list markers, small emphasis. The accent stays loud where it can afford to be, and the darker version does the quiet jobs. It's one rule, and it prevents most of the ugly outcomes.

Beyond that: spacing comes from the scale, contrast gets checked rather than eyeballed, and motion stays subtle unless there's a reason not to.

## What it costs, and when to stop

The cost is one small file and the discipline to use it. I didn't build a component library, and for a solo project I probably shouldn't. A `Button.astro` with six variants is a system built for a team of strangers; here I'd be the only consumer, and I'd spend more time maintaining the API than using it.

The test for any addition is whether it removes a decision I'd otherwise make badly and repeatedly. Tokens pass. A theme provider passes, barely. A full theming engine with tokens-of-tokens does not.

The payoff is boring and real: everything matches without me trying, the dark/light switch was nearly free, and adding a new page means composing existing values instead of inventing new ones. When the site grows, it grows in the same shape.

## The point

I don't need a design system to coordinate a team. I need it to be consistent with the one person I can't see: myself, next month. A page of tokens is a note to that person. It's the cheapest way I've found to keep a solo project looking like it was built on purpose.
