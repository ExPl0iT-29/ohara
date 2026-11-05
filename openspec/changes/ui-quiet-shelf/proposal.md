# Proposal

## Why

Before the Play launch, three visual directions are being built side by side so the owner can choose by using them (see the mockups and research behind them). This is direction A, **Quiet Shelf**: a calm editorial look modelled on Matter, Instapaper and Google Play Books. The most-praised read-later apps win on reading comfort, and Matter, the one reviewers call best-looking, has no Android app.

## What Changes

- New tokens: cool paper, deep blue-grey ink, one teal accent, hairline rules, separate dark palette. No hard-offset shadows or black borders.
- Bundled fonts (SIL OFL): **Literata** for titles and reading text, **Instrument Sans** for interface text, registered natively so real bold and italic faces are used.
- Primitives restyled: flat filled buttons, hairline cards and fields, ink-filled selected chips, `#tag` pills, pull-quote highlights, a springy ink FAB, uppercase eyebrows.
- Feed: "Library" header, underlined Active/Archived tabs, typographic rows with a square thumbnail, source · length · type meta line, a progress line for started items, and a **Continue reading** section above recently saved items when no filter is active. Distinct "No matches" and "Nothing archived yet" states.
- Reader: source eyebrow, serif title and byline before the hero image, 18sp Literata body, a reading-progress line at the top; tags, highlights and archive move below the article.
- Native window background follows the theme, so there is no flash of the old cream on launch.
- `DESIGN.md` mission, visual identity, inspirations and feeling sections rewritten for this direction.

## Capabilities

### New Capabilities

None.

### Modified Capabilities
- `ui-redesign`: tokens become the Quiet Shelf set; the hard-offset shadow and folder-tab requirements are removed.
- `home-feed-ui`: adds a Continue reading section.
- `reader-view`: adds a reading-progress indicator.

## Impact

- `mobile/src/theme/tokens.js`, `mobile/tailwind.config.js`, `mobile/src/components/ui/*`, feed and reader components, `mobile/app/index.tsx`, `mobile/app/content/[id].tsx`, `mobile/app/_layout.tsx`.
- `mobile/android/app/src/main/res/font/` (≈1.5 MB of fonts), `MainApplication.kt` font registration, native window colours.
- `openspec/specs/DESIGN.md`.
- Alternative directions live on `feature/ui-material-expressive` and `feature/ui-refined-brutalism`; only one is merged.
