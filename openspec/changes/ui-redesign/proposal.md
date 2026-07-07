## Why

The app shipped with zero real branding: `mobile/app.json` still had `name: "mobile"` (the folder name) and the stock Expo scaffold icon/splash assets. Every screen used bare Tailwind defaults (`bg-white`, `text-gray-500`, `bg-blue-600`) with no consistent type scale, spacing, or color identity — functional but generic and unpolished, not something that feels like a considered product.

## What Changes

- Real app identity: name "Ohara", a hand-authored flat bookmark-ribbon icon (teal on paper) replacing all Expo default icon/adaptive-icon/splash/favicon assets, paper-colored adaptive-icon background.
- A small design system in `tailwind.config.js`: `paper`/`ink`/`brand`/`line`/`danger`/`amber` color tokens, a `display`/`title`/`body`/`caption` type scale, `card`/`pill` border radii — replacing ad-hoc Tailwind defaults.
- Every screen and component (feed, reader, capture, empty/error/status states) restyled against these tokens for consistent visual hierarchy.
- Fixed a double-header bug: `app/_layout.tsx` wasn't hiding expo-router's default nav header, so the route name ("index") rendered stacked above the screen's own title.
- Fixed NativeWind's `darkMode` config (`"class"`) so its runtime color-scheme code doesn't error under the default `"media"` strategy.

## Capabilities

### New Capabilities
- `ui-redesign`: app branding (name, icon, splash) and a shared design token system (colors, type scale, radii) applied consistently across all screens.

### Modified Capabilities
(none — purely visual/branding, no API or data contract changes)

## Impact

- Affected code: `mobile/app.json`, `mobile/assets/*` (icon set), `mobile/tailwind.config.js`, `mobile/app/_layout.tsx`, `mobile/app/index.tsx`, `mobile/app/content/[id].tsx`, `mobile/app/capture.tsx`, `mobile/src/components/feed/*`, `mobile/src/components/reader/*`.
- No new dependencies.
