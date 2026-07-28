<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Design system

For all UI generation and visual changes, follow @DESIGN.md — colors, typography, spacing, and component appearance. Do not invent colors, fonts, or spacing outside that design system.

For anything that transitions, animates, or scrolls, follow @MOTION.md — durations, easing curves, and what must never move. Do not add an animation library without updating that file first.

Token values for both live in `src/app/globals.css`.
