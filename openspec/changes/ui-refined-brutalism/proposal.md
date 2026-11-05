# Proposal

## Why

Before the Play launch, three visual directions are being built side by side so the owner can choose by using them. This is direction C, **Refined neo-brutalism**: keep Ohara's recognisable identity and fix what makes it noisy. Today every element has a 3dp black border and a 4dp shadow, colour is decorative, the reader uses the same loud styling as the chrome, and in dark mode the black borders and shadows disappear into the near-black background.

## What Changes

- Lines drop to 2.5dp; shadows follow one depth per level (cards and FAB 4dp, buttons 3dp, icon buttons 2dp, chips, fields and notices flat).
- Dark mode lines and shadows become warm off-white and dark brown so they stay visible; pale tints get deep dark-mode counterparts.
- Bundled fonts (SIL OFL): **Bricolage Grotesque** for headings and interface, **Literata** for reader body text, registered natively for real weights.
- Colour marks content type (yellow articles, pink video, violet PDFs/papers, mint docs/code, blue social).
- Feed: square settings button, the lead item as a full card with an image band, type pill and progress bar, the rest as compact rows with a type-coloured tile; distinct "No matches" and "Nothing archived yet" states.
- Reader: square back and open-original buttons, bordered hero image, source pill, heavy title, a calm Literata body; tags, highlights and archive below the article.
- Native window background follows the theme.
- `DESIGN.md` visual identity and inspirations refined; the mission is unchanged.

## Capabilities

### New Capabilities

None.

### Modified Capabilities
- `ui-redesign`: token and shadow requirements updated for the refined set and dark mode.
- `home-feed-ui`: adds a featured lead card and content-type colour coding.
- `reader-view`: adds a reader top bar.

## Impact

- `mobile/src/theme/tokens.js`, `mobile/tailwind.config.js`, `mobile/src/components/ui/*` (new `HardShadow`, `IconButton`, `Eyebrow`), feed and reader components, `mobile/app/index.tsx`, `mobile/app/content/[id].tsx`, `mobile/app/_layout.tsx`.
- `mobile/android/app/src/main/res/font/` (fonts), `MainApplication.kt` registration, native window colours.
- `openspec/specs/DESIGN.md`.
- Alternatives live on `feature/ui-quiet-shelf` and `feature/ui-material-expressive`; only one is merged.
