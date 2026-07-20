## Context

Ohara currently uses NativeWind (Tailwind for React Native) with soft tokens (`paper`, `ink`, `brand` teal, `line`, `danger`, `amber`) defined in `mobile/tailwind.config.js`, applied via `className` across screens under `mobile/app/` and shared components under `mobile/src/components/`. There are no shadow or hard-border conventions today — cards use `rounded-card border border-line`.

## Goals / Non-Goals

**Goals:**
- A small set of new design tokens (colors, border, shadow) usable via NativeWind className + a thin style helper for the hard-offset shadow (RN has no CSS box-shadow).
- Two reusable primitives (`BrutalCard`, `BrutalButton`) so screens compose consistent bordered/shadowed elements instead of repeating raw styles.
- Re-skin capture, feed/library, reader chrome, and settings screens using the primitives.

**Non-Goals:**
- Changing the actual reading body typography/layout inside the reader (per updated DESIGN.md, the reader body stays highly readable — bold chrome, not bold prose).
- New navigation structure, new screens, or animation/gesture work (tracked separately, e.g. `reanimated-transitions`).
- Native module changes — this is styling/component-only.

## Decisions

**Hard shadow via a "faux shadow" layer, not RN's native shadow props.** RN's `shadow*` props (iOS) and `elevation` (Android) both render soft/blurred shadows and are inconsistent cross-platform — neither can produce Tuckii's crisp offset-only shadow. Instead, `BrutalCard`/`BrutalButton` render two overlapping views: a background layer (solid black, same border-radius, offset by a fixed `SHADOW_OFFSET` e.g. 4px right/4px down) and the foreground content view (bordered, offset 0). This renders identically on iOS and Android.
- Alternative considered: RN shadow props — rejected, can't get a hard, non-blurred, cross-platform-identical edge.

**Border color: plain `black`/`white` (theme-aware), not a new custom token.** NativeWind ships `border-black` out of the box; no need to add a bespoke `ink-border` token for something Tailwind already provides for both light/dark via `dark:border-white`.

**Accent palette: 4 bold colors reused across collections/categories** (`accent.yellow`, `accent.pink`, `accent.violet`, `accent.mint`), assigned to collection folder-tabs and any category-coded UI. Not meant to replace `brand` (primary action color) — `brand` becomes the bold yellow used for primary CTAs (matches Tuckii's `+` button), the other three are for category/collection variety.

**Reader body text is explicitly out of scope for hard borders/shadows.** Per updated DESIGN.md, only the reader's chrome (header buttons, tag pills, archive button) gets the new primitives — the article text itself keeps generous spacing and high readability, unstyled by `BrutalCard`.

## Risks / Trade-offs

- [Faux-shadow layer adds a wrapper view per card] → Acceptable; RN card counts here are small (tens, not thousands, on a single screen) so the extra view has no measurable perf impact.
- [Visual overhaul touches many files at once] → Mitigated by centralizing all new styling in two primitives; per-screen changes become "replace `View className=...` with `<BrutalCard>`" rather than bespoke styling per screen.

## Migration Plan

No data migration. Purely presentational — old `className` styling is replaced screen-by-screen; screens not covered in this change's `tasks.md` keep old styling until a follow-up change, which is an acceptable inconsistency window given this is visual-only.

## Open Questions

None.
