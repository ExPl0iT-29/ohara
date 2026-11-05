# Proposal

## Why

Before the Play launch, three visual directions are being built side by side so the owner can choose by using them. This is direction B, **Material Expressive**: Google's current Android design language (Material 3 Expressive). It makes Ohara feel native on Android, where it is shipping first, while shape and motion keep a distinct personality.

## What Changes

- New tokens: a Material 3 tonal palette from a teal seed, with matching dark roles; 24–28dp container corners; system Roboto (nothing bundled).
- Primitives restyled: filled, tonal and error buttons that square off and spring back when pressed; filter chips with a check; input chips for tags; full-round search field; tonal notices; text and icon buttons; an extended "Save link" FAB in the tertiary colour.
- Feed: search bar with a settings button, a large "Library"/"Archive" headline, filter chips, a **Continue** hero card for the latest unfinished item, rows grouped into one rounded list with shape-coded thumbnails, and a **bottom navigation bar** (Library, Archive, Settings). Distinct "No matches" and "Nothing archived yet" states.
- Reader: back and open-original buttons, a progress track, a tonal header card (source, title, facts), rounded hero image, Roboto reading text; tags, highlights and archive below the article.
- Native window background follows the theme.
- `DESIGN.md` mission, visual identity, inspirations and feeling sections rewritten for this direction.

## Capabilities

### New Capabilities

None.

### Modified Capabilities
- `ui-redesign`: tokens become the Material 3 tonal set; the hard-offset shadow and folder-tab requirements are removed.
- `home-feed-ui`: adds the Continue card and bottom navigation.
- `reader-view`: adds reading progress and a reader top bar.

## Impact

- `mobile/src/theme/tokens.js`, `mobile/tailwind.config.js`, `mobile/src/components/ui/*`, feed and reader components, `mobile/app/index.tsx`, `mobile/app/content/[id].tsx`, `mobile/app/_layout.tsx`, native window colours.
- `openspec/specs/DESIGN.md`.
- Alternatives live on `feature/ui-quiet-shelf` and `feature/ui-refined-brutalism`; only one is merged.
