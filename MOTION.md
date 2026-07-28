# Motion System: skrewbar blog

Fast, quiet motion for a reading surface. Based on GitHub Primer's functional motion model, with hover timings relaxed slightly to suit a low-chroma accent color.

**Category:** Personal blog / competitive programming write-ups

## Motion Philosophy

This site exists to be read. Posts are long, dense with code blocks and KaTeX math, and a reader working through a problem solution is concentrating. Motion here is not a feature — it is a maintenance function. It confirms that a link is interactive, smooths a color change that would otherwise snap, and keeps a hover state from appearing out of nowhere. When it works, the reader does not notice it.

The pace follows the reader, not the interface. Nothing on this site is a "moment": there is no celebratory flourish for opening a post, no dramatic reveal for a list of tags. Transitions live in the 120–200ms band — long enough that a color shift reads as a transition rather than a jump, short enough that it never delays a click. The one deliberate softening away from Primer is hover, which sits at 120ms instead of 80ms. The brand accent is a low-chroma muted red; at 80ms it snaps in and reads as a glitch rather than a response.

Content never animates. Code blocks, syntax highlighting, math, and competitive-programming rating colors are the substance of a post. Animating them adds nothing and actively harms trust — a rating color that fades in looks like it is still being computed. Motion belongs to the chrome around the content: navigation, cards, tags, form controls. This boundary is not a style preference, it is the rule the rest of the system hangs on.

## Duration Scale

| Token    | Value | Tailwind       | Use                                                                |
| -------- | ----- | -------------- | ------------------------------------------------------------------ |
| instant  | 0ms   | `duration-0`   | Code blocks, syntax highlighting, KaTeX, rating colors, theme swap |
| fast     | 120ms | `duration-120` | Hover fills, link color, tag chips, focus ring — **the default**   |
| default  | 150ms | `duration-150` | Collapsible open, chevron rotation, theme toggle icons             |
| moderate | 200ms | `duration-200` | Larger reveals: cards or list items entering on mount              |

`--default-transition-duration` is set to 120ms in `src/app/globals.css`, so a bare `transition-colors` already resolves to the `fast` token. Only write an explicit `duration-*` class when you need something other than 120ms.

**200ms is the ceiling for functional UI.** Anything longer is expressive, not functional, and this site has no expressive layer. Loading indicators (`animate-pulse` on skeletons) are exempt because they are continuous, not transitional.

## Easing

| Token       | Curve                          | Tailwind      | Use                                                       |
| ----------- | ------------------------------ | ------------- | --------------------------------------------------------- |
| ease-out    | `cubic-bezier(0, 0, 0.5, 1)`   | `ease-out`    | Elements entering — snappy deceleration. **The default.** |
| ease-in     | `cubic-bezier(0.5, 0, 1, 1)`   | `ease-in`     | Elements exiting — quick departure                        |
| ease-in-out | `cubic-bezier(0.5, 0, 0.5, 1)` | `ease-in-out` | Repositioning: chevron rotation, height changes           |
| linear      | `linear`                       | `ease-linear` | Continuous loops: skeleton pulse                          |

These override Tailwind's built-in `--ease-*` defaults in `globals.css`, so `ease-out` resolves to Primer's curve, not Tailwind's. `--default-transition-timing-function` also points at `ease-out`, so bare `transition-colors` gets the right curve for free.

## Springs

**This system does not use spring physics, and there is no animation library installed.**

Everything here is CSS transitions driven by Tailwind utilities. Springs imply an object still settling into place; on a reading surface that reads as instability. They also require a JavaScript runtime, which would mean converting Server Components to Client Components purely for decoration.

If a future need genuinely requires orchestration that CSS cannot express — coordinated list entrance, gesture-driven drag — introduce it deliberately and update this file first. Do not add `motion`, `framer-motion`, or `react-spring` as a side effect of implementing a component.

## Stagger Patterns

Stagger is currently **not used**. Post lists, tag lists, and category cards render as a block.

If it is introduced later, follow Primer's restraint: the goal is to prevent simultaneous pop-in, not to produce a visible cascade.

- Post cards: 16ms between items, capped at 8
- Tag chips: 8ms between items, capped at 12
- Applies on initial mount only, never on re-render or pagination

## Enter / Exit Patterns

**Collapsible (`<details>` in MDX)**

- open: chevron rotates 0→90deg, `duration-150`, `ease-in-out`
- background tint on `<summary>` hover: `duration-120`, `ease-out`
- Height is not animated. `<details>` height transitions require JS measurement or `interpolate-size`, and a jumping code block inside a collapsible is worse than an instant open.

**Theme toggle icons**

- Sun/Moon crossfade via `scale` and `rotate`, `duration-150`, `ease-in-out`
- The page's own color swap is instant (0ms) — see Rules

**Skeleton loading**

- `animate-pulse`, continuous, `ease-linear`
- Used while post stats load. Replaced by content with no fade.

There are no modals, dialogs, popovers, drawers, or toasts in this project. If one is added, use: opacity `0→1` plus `translateY 4px→0` at `duration-150` `ease-out` entering, opacity only at `duration-120` `ease-in` exiting. **Exit is always shorter than or equal to enter.**

## Interaction States

- **Hover (links):** color to `text-brand` over `duration-120` `ease-out`. Never a transform, never an underline that shifts layout.
- **Hover (cards):** background to `bg-brand-wash` over `duration-120` `ease-out`. PostCard title shifts to `text-brand` + underline; nested tag chips to `bg-brand-subtle text-brand-chip-foreground` via `group-hover/card`. No lift, no scale, no shadow — a card that rises implies it is draggable.
- **Hover (tags):** background and text shift together over `duration-120` `ease-out`.
- **Hover (code blocks):** none. The copy button may fade in at `duration-120`; the block itself does not react.
- **Press:** no transform on links or cards. Buttons keep the existing `active:translate-y-px` from `ui/button.tsx` — a 1px mechanical nudge, not a scale.
- **Focus:** the ring is brand-hued and appears with the component's existing `transition-all`. Keyboard navigation must never wait on animation, so do not add delay.
- **Reduced motion:** all transition and animation durations collapse to near-zero via a global rule in `globals.css`. Hover colors still change, they simply change instantly. Nothing becomes unusable.

## Rules

- **Content is static.** Never animate anything inside `[data-rehype-pretty-code-figure]`, `.katex`, or the rating spans in `src/components/mdx-rating.tsx`. Syntax colors, math, and rating colors are data.
- **Animate `transform` and `opacity`, plus `color` / `background-color` / `border-color`.** Never animate `width`, `height`, `top`, `left`, `margin`, or `padding` — they trigger layout on every frame.
- **Avoid `transition-all`.** Name the properties (`transition-colors`, `transition-transform`). `transition-all` catches layout properties by accident. The existing `transition-all` in `ui/button.tsx` and `ui/badge.tsx` is inherited from shadcn and is tolerated, not a pattern to copy.
- **No page transition animations.** No `template.tsx`, no `AnimatePresence`, no `experimental.viewTransition`. Navigation should feel like the page was already there.
- **Theme switching is instant.** `next-themes` swaps a class on `<html>`; transitioning every color token at once produces a visible smear across the whole page.
- **Anchor scrolling respects `scroll-margin-top: 5rem`** so headings clear the sticky header. Do not add JS smooth-scroll that ignores it.
- **`prefers-reduced-motion` is not optional.** The global rule in `globals.css` covers CSS transitions and animations. Any future JS-driven motion must check it explicitly.
- **Hover states should be missable.** If a reader is not looking for the hover, they should not notice it happen.
