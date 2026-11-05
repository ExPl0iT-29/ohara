# Proposal

## Why

Three visual directions (Quiet Shelf, Material Expressive, refined neo-brutalism) are about to be built side by side on separate branches. Today colours are hard-coded hex values in about fifteen places, every screen styles its own chips and inputs, and the neo-brutalist primitives are named `BrutalButton` and `BrutalCard`. Any restyle would have to touch every screen, and the three branches would conflict everywhere. One theme layer on `main` makes each direction a change to tokens and primitives instead.

## What Changes

- Add `mobile/src/theme/tokens.js` as the single source of colours and font families, used by Tailwind and by a `useTheme()` hook for native props (spinners, placeholders, header, shadows, the HTML reader).
- Add font-role classes (`font-heading`, `font-ui`, `font-reading`) to every text style. They map to the system font today, so nothing looks different.
- Rename `BrutalButton` / `BrutalCard` to `Button` / `Card`, and add `Chip`, `Tag`, `TextField`, `Screen` and `Fab` primitives that screens now use instead of inline styling.
- `Button` renders its own label; `Notice`, `TextButton` and `Divider` replace hand-styled notices, underlined links and section rules.
- Fix the onboarding copy that still said Ohara "summarizes" links.
- No visual change apart from the stack header now using the same paper colour as the screens (it used a slightly different off-white).

## Capabilities

### New Capabilities

None.

### Modified Capabilities

None. This is a refactor; `.openspec.yaml` sets `skip_specs: true`.

## Impact

- `mobile/src/theme/`, `mobile/src/components/ui/`, `mobile/tailwind.config.js`, and every screen under `mobile/app/` plus the feed and reader components.
- No new dependencies.
