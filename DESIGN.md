---
version: alpha
name: skrewbar blog
description: >
  Algorithm problem-solving blog (AtCoder / Codeforces).
  Neutral minimal chrome with a single muted red accent for interaction points.
colors:
  background: "oklch(1 0 0)"
  foreground: "oklch(0.145 0 0)"
  primary: "oklch(0.205 0 0)"
  primary-foreground: "oklch(0.985 0 0)"
  muted: "oklch(0.97 0 0)"
  muted-foreground: "oklch(0.556 0 0)"
  border: "oklch(0.922 0 0)"
  brand: "oklch(0.78 0.098 19.5)"
  brand-foreground: "oklch(0.985 0 0)"
  brand-wash: "oklch(0.987 0.006 19.5)"
  brand-subtle: "oklch(0.965 0.018 19.5)"
  brand-chip: "oklch(0.95 0.025 19.5)"
  brand-chip-foreground: "oklch(0.32 0.098 19.5)"
  brand-border: "oklch(0.895 0.054 19.5)"
  selection: "oklch(0.895 0.054 19.5)"
  brand-50: "oklch(0.97 0.014 19.5)"
  brand-100: "oklch(0.94 0.03 19.5)"
  brand-200: "oklch(0.895 0.054 19.5)"
  brand-300: "oklch(0.796 0.098 19.5)"
  brand-400: "oklch(0.7 0.098 19.5)"
  brand-500: "oklch(0.62 0.098 19.5)"
  brand-600: "oklch(0.55 0.098 19.5)"
  brand-700: "oklch(0.48 0.098 19.5)"
  brand-800: "oklch(0.4 0.098 19.5)"
  brand-900: "oklch(0.32 0.098 19.5)"
  ring: "oklch(0.62 0.098 19.5)"
  destructive: "oklch(0.577 0.245 27.325)"
  background-dark: "oklch(0.145 0 0)"
  foreground-dark: "oklch(0.985 0 0)"
  brand-dark: "oklch(0.796 0.098 19.5)"
  brand-foreground-dark: "oklch(0.22 0.05 19.5)"
  brand-wash-dark: "oklch(0.225 0.015 19.5)"
  brand-subtle-dark: "oklch(0.27 0.035 19.5)"
  brand-chip-dark: "oklch(0.30 0.042 19.5)"
  brand-chip-foreground-dark: "oklch(0.895 0.054 19.5)"
  brand-border-dark: "oklch(0.4 0.07 19.5)"
  selection-dark: "oklch(0.38 0.06 19.5)"
  ring-dark: "oklch(0.7 0.098 19.5)"
typography:
  post-title:
    fontFamily: Pretendard
    fontSize: 2.25rem
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: -0.025em
  page-title:
    fontFamily: Pretendard
    fontSize: 1.875rem
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: -0.025em
  section-title:
    fontFamily: Pretendard
    fontSize: 1.25rem
    fontWeight: 600
    lineHeight: 1.3
  card-title:
    fontFamily: Pretendard
    fontSize: 1rem
    fontWeight: 500
    lineHeight: 1.375
  body:
    fontFamily: Pretendard
    fontSize: 1rem
    fontWeight: 400
    lineHeight: 1.7
  meta:
    fontFamily: Pretendard
    fontSize: 0.875rem
    fontWeight: 400
    lineHeight: 1.4
  code:
    fontFamily: "JetBrains Mono"
    fontSize: 0.875rem
    fontWeight: 400
    lineHeight: 1.625
rounded:
  sm: 0.375rem
  md: 0.5rem
  lg: 0.625rem
  xl: 0.875rem
  full: 9999px
spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  container-x: 16px
  container-y: 24px
  max-content: 64rem
components:
  link-brand:
    textColor: "{colors.brand}"
  tag-brand:
    backgroundColor: "{colors.brand-chip}"
    textColor: "{colors.brand-chip-foreground}"
    rounded: "{rounded.full}"
  focus-ring:
    backgroundColor: "{colors.ring}"
---

# skrewbar blog Design System

## Overview

Algorithm problem-solving (PS) blog focused on AtCoder and Codeforces write-ups. The visual identity is **quiet, high-contrast, and readable first**: long-form prose, dense code, and math must stay crystal clear. Personality comes from a single muted red accent used sparingly on interaction affordances — never as a wash over the page.

Personality keywords: precise, calm, lightly warm, technical.

Stack context (implementation source of truth): Tailwind CSS v4 + shadcn semantic tokens in `src/app/globals.css` (`oklch()`). Agents must prefer existing token utilities (`text-brand`, `bg-brand-subtle`, `ring-ring`, etc.) over inventing new colors.

## Colors

The palette is rooted in high-contrast neutrals. **Brand — a muted red — is the only chromatic accent.**

**Brand appears on hover and focus only.** At rest the interface is fully achromatic — a screenshot of an idle page should contain no red. The accent is a response to the pointer, not a decoration.

- **Background / Foreground:** Pure white and near-black. Body text and large surfaces stay fully achromatic.
- **Primary:** Neutral ink for buttons and high-emphasis chrome. Do **not** replace primary with brand.
- **Muted / Border:** Soft gray surfaces and dividers for hierarchy without color.
- **Brand (`oklch(0.78 0.098 19.5)` light / `brand-300` dark):** Hovered link text — just under `brand-300` in light so it stays bright without full peach. Never a resting text color.
- **Brand-wash:** Lightest brand tint — hovered cards. Pale enough that chips can sit on top without disappearing.
- **Brand-subtle:** Soft pink for tag chips while their parent card is hovered — denser than wash so chip edges read, with `text-brand-chip-foreground` on the label.
- **Brand-chip / brand-chip-foreground:** Denser pair for the tag under the pointer (pale chip fill + `brand-900` text in light).
- **Ring:** Brand-hue focus ring (already wired via `ring-ring` on form controls). This is the one place brand appears without a pointer, because keyboard focus needs the same affordance. Light mode uses `brand-500` and dark mode `brand-400`, each chosen to clear 3:1 against its own background.
- **Selection:** Drag-to-highlight uses `--selection` via `::selection` background only (`brand-200` light); text color stays inherited.

### How the ramp is built

The whole palette is derived from one color, **`#f5a3a3` = `oklch(0.796 0.098 19.5)`**, which is `brand-300`.

Hue is **19.5** and chroma is **0.098** at every step. Only lightness moves. That constraint is the reason these values are written in `oklch()` rather than hex: in a perceptually uniform space, holding hue and chroma fixed means every rung really is the same color at a different lightness, with no shift toward brown at the dark end or peach at the light end. Chroma drops below 0.098 only in `brand-50`–`brand-200`, where sRGB physically cannot hold that much color at those lightnesses.

When adding a step, pick a lightness and keep `0.098 19.5`. Do not hand-tune the hue.

Dark mode does not define a second ramp. It reuses the one above and only changes which rung each role points at — `--brand` becomes `brand-300`, the anchor itself. The four dark hover surfaces (`brand-wash`, `brand-subtle`, `brand-chip`, `brand-border`) are the exception: they are hand-set below the ramp chroma, because a hover background at 0.098 reads as a colored panel rather than a hint.

Dark brand text (`brand-300` / `#f5a3a3`) clears WCAG AA on dark surfaces. Light brand link text sits near `brand-300` lightness by design — it is hover-only accent, never body copy; AA for continuous reading is carried by `brand-chip-foreground` (`brand-900`) on chip fills.

**Token source of truth:** values live in `src/app/globals.css` (`:root` / `.dark`). This file documents intent; if a value drifts, update CSS first, then sync this front matter.

## Typography

Two families only:

- **Pretendard** (variable) — UI, headings, and prose (`font-sans` / `font-heading`).
- **JetBrains Mono** — code, kbd, and technical mono (`font-mono`). Enable common ligatures.

Roles in use:

- **Post title:** `text-4xl font-bold tracking-tight`
- **Page title:** `text-3xl font-bold tracking-tight`
- **Card title:** `font-heading text-base font-medium`
- **Meta / captions:** `text-sm text-muted-foreground`
- **Body:** default sans; MDX uses `@tailwindcss/typography` (`prose`)

Avoid introducing a third display font. Do not color body copy with brand.

## Layout

- Content column: `max-w-5xl` centered, `px-4 py-6` on `<main>`.
- Spacing rhythm follows Tailwind’s default scale (4px base). Prefer `gap-*`, `space-y-*`, and existing card spacing variables over magic numbers.
- In-article headings use `scroll-margin-top: 5rem` for sticky-header offset.
- Lists and cards stay single-column-friendly; density over decoration.

## Elevation & Depth

Flat UI. Depth comes from **tonal layers and hairline rings**, not drop shadows:

- Cards: `ring-1 ring-foreground/10` (see `Card` component).
- Hover: subtle background shift to `bg-brand-wash`.
- Borders: `border-border` / translucent white borders in dark mode.

Do not add heavy box-shadows for standard content cards.

## Shapes

Soft modern radii from `--radius: 0.625rem` and the derived Tailwind scale (`rounded-lg` buttons/inputs, `rounded-xl` cards, `rounded-full` / `rounded-4xl` chips). Keep corners consistent within a view — do not mix sharp and pill arbitrarily.

## Components

Guidance for atoms already in the repo (`src/components/ui/*` and site chrome):

- **Buttons:** Stay on neutral `primary` / `secondary` / `outline`. Buttons are not a brand surface — exceptions: the post like control and code-block copy button use `hover:text-brand-chip-foreground` / `hover:bg-brand-subtle` / `hover:border-brand-border` (same denser accent as tag chips).
- **Links:** Resting color is inherited (`text-muted-foreground` in chrome, typography default in prose). Add `hover:text-brand transition-colors`. Do not paint entire paragraphs brand-colored.
- **Tags / badges:** Use the `tag` variant on `Badge` — neutral at rest; `bg-brand-subtle text-brand-chip-foreground` via `group-hover/card:` when the parent card is hovered; then `bg-brand-chip` (same foreground) on direct hover. Note it uses plain `hover:` / `group-hover/card:` rather than `[a]:hover:` because the badge renders as a `<span>` inside a `<Link>`. Keep draft/warning badges on amber as today.
- **Cards (`PostCard`, `CategoryPreviewCard`):** Card hover uses `bg-brand-wash`. Titles (post title / category name) go `text-brand-500` (light) / `text-brand-300` (dark) + underline via `group-hover/card`. On `PostCard`, meta (date, reading time, category) and description also use `text-brand-500` in light / `text-brand-400` in dark. No lift or scale. Nested category/tag/post links remain pointer-events-auto where needed.
- **Focus:** Rely on `ring-ring` / `focus-visible:ring-*` — ring is already brand-hued.
- **Prose:** Apply `prose-a:hover:text-brand prose-a:transition-colors` on the article. Leave the resting link color to typography defaults; never restyle Shiki token spans.
- **Code blocks:** Owned by rehype-pretty-code + Shiki (`github-light` / `github-dark`). Style the chrome (`pre` border/background via muted tokens) only.
- **Ratings:** `CfRating` / `AtRating` use platform-standard hex palettes in `src/components/mdx-rating.tsx`. Treat as immutable domain data, not brand tokens.

Durations and easing for every state above are defined in `MOTION.md`, not here.

## Do's and Don'ts

**Do**

- Use brand only on hover and focus. At rest, the page is achromatic.
- Prefer semantic utilities: `text-brand`, `bg-brand-wash`, `bg-brand-subtle`, `bg-brand-chip`, `text-brand-chip-foreground`, `border-brand-border`, `ring-ring`, `bg-selection`.
- Keep large surfaces (page background, card fill, body text) neutral.
- Maintain WCAG AA contrast (≥4.5:1) for brand text on background in both themes.
- Read `src/app/globals.css` before inventing new color tokens.

**Don't**

- Don’t put brand color inside `[data-rehype-pretty-code-figure]` or override Shiki token colors.
- Don’t change or “harmonize” `CF_COLORS` / `AT_COLORS` in `mdx-rating.tsx` — they are external platform standards.
- Don’t hardcode hex / `oklch()` literals in components; add or reuse CSS tokens instead.
- Don’t give an element a resting brand color. If it is red before the pointer arrives, it is wrong.
- Don’t replace `--primary` with red or use brand as a full-page / hero background wash.
- Don’t introduce extra accent hues (blue, purple, etc.) for general UI — brand red is the sole accent (amber for draft warnings remains an exception).
