## Context

No design system existed — every screen picked its own gray/blue shade ad hoc. App identity was entirely unset (Expo scaffold defaults for name/icon). This change establishes both: a minimal token system and real branding, applied uniformly.

## Goals / Non-Goals

**Goals:**
- One consistent color palette, type scale, and radius system, defined once in `tailwind.config.js`, used everywhere.
- Real app name and a simple, recognizable icon reflecting what Ohara does (save-and-read-later), not a generic monogram.
- No behavior change — purely visual.

**Non-Goals:**
- Dark mode theming (still light-only; `darkMode: "class"` config fixed a runtime error but no dark palette is authored).
- A full component library / Storybook — tokens live in `tailwind.config.js` only.
- iOS icon assets (not building for iOS yet).

## Decisions

- **Palette**: warm paper background (`#FAF9F6`) + near-black ink text + a single teal brand accent (`#0F766E`), rather than Tailwind's default gray/blue — distinct, calm, fits a reading app rather than looking like unstyled scaffold.
- **Icon concept — bookmark ribbon, not a monogram**: a flat geometric bookmark/ribbon shape (rectangle with a V-notch cut from the bottom) instantly reads as "saved for reading," which a lettermark wouldn't. Hand-rendered via Pillow (Python) rather than an AI image generator (none available in-session) — simple flat shapes only, no photographic or illustrative detail needed.
- **Icon rendering approach**: rejected the Adobe Express HTML-to-poster pipeline (that's for editable documents/decks, not raw PNG assets) in favor of directly rasterizing with Pillow — simplest tool that produces exactly what's needed (flat-color PNGs at the exact sizes Expo's icon slots expect).
- **Type scale as named Tailwind font sizes** (`display`/`title`/`body`/`caption`) rather than raw `text-lg`/`text-sm` utility classes sprinkled per-screen — one source of truth for hierarchy.

## Risks / Trade-offs

- [Hand-rendered icon is deliberately simple/flat, not a polished vector illustration] → Acceptable for now; revisit with real design tooling if the app ships publicly.
