## Why

The app's UI is currently static — no press feedback on the capture FAB, feed list items snap into place with no transition, and the reader's hero image pops in abruptly. `react-native-reanimated` is already installed (`mobile/package.json`) but unused. Small, purposeful motion makes the app feel calm and responsive per DESIGN.md, without needing a full animation/design system.

## What Changes

- Capture FAB (`mobile/app/index.tsx`) scales down on press, back up on release — tactile feedback for the primary action.
- Feed list items (`FeedListItem`) fade + slide in on mount using Reanimated's built-in `entering` animation — no per-item animation code to write.
- Reader hero image (`ReaderHeader`) fades in once loaded instead of popping in.
- No backend changes. No new dependencies beyond `react-native-reanimated` (already added).

## Capabilities

### New Capabilities
- `reanimated-transitions`: baseline motion (press feedback, list entrance, image fade-in) for the feed and reader screens.

### Modified Capabilities
(none — purely additive visual behavior on existing screens, no contract changes)

## Impact

- Affected code: `mobile/babel.config.js` (worklets plugin), `mobile/app/index.tsx`, `mobile/src/components/feed/FeedListItem.tsx`, `mobile/src/components/reader/ReaderHeader.tsx`.
- No new dependencies (`react-native-reanimated` already installed).
