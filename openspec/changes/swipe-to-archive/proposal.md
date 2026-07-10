## Why

Archiving/unarchiving currently requires tapping a small text link on each feed card. A swipe gesture is the expected interaction for this on a list of cards (Gmail, most read-later apps) and is faster for going through several items in a row.

## What Changes

- Feed list items support swipe-to-archive (swipe left) in the Active view, and swipe-to-unarchive (swipe right) in the Archived view.
- The existing Archive/Unarchive text link stays on the card — swipe is an addition, not a replacement, so the action remains discoverable and accessible without a gesture.

## Capabilities

### Modified Capabilities
- `home-feed-ui`: feed items support swipe-to-archive/unarchive in addition to the existing tap control.

## Impact

- `mobile/app/_layout.tsx` — wrap the app root in `GestureHandlerRootView` (required by `react-native-gesture-handler`, not yet present).
- `mobile/src/components/feed/FeedListItem.tsx` — wrap the card in a swipeable gesture (`Gesture.Pan` + `react-native-reanimated`'s `useAnimatedStyle`/`withSpring`) that triggers the existing `onToggleArchive` callback past a distance threshold.
- No new dependencies — `react-native-gesture-handler` is already present transitively (via `expo-router`/`react-navigation`), `react-native-reanimated` is already a direct dependency and already used elsewhere in this file's sibling components (`FadeInDown`, FAB press animation in `app/index.tsx`).
