## Context

`react-native-reanimated@4.5.0` installed but not wired into babel and not used anywhere. App has three static spots worth calm motion: the capture FAB (no press feedback), feed list rows (snap into place), reader hero image (pops in).

## Goals / Non-Goals

**Goals:**
- Wire up Reanimated properly (babel plugin) so it's usable app-wide going forward.
- FAB: scale-down press feedback, spring back on release.
- Feed list items: fade + slide entrance on mount, no manual per-item wiring.
- Reader hero image: fade in once loaded.

**Non-Goals:**
- Gesture-driven interactions (swipe-to-archive, drag) — `react-native-gesture-handler` not installed, out of scope.
- Shared element / screen transitions between routes — Expo Router transition config is a separate concern.
- Scroll-based header animations in the reader — deferred, not needed yet.

## Decisions

- **Babel plugin**: add `'react-native-worklets/plugin'` to `mobile/babel.config.js` plugins array (required by Reanimated 4 for worklets to compile) — must be last in the plugins list per Reanimated docs.
- **FAB feedback**: `useSharedValue` + `useAnimatedStyle` scaling `0.9` on `onPressIn`, `withSpring(1)` on `onPressOut`, wrapped via `Animated.createAnimatedComponent(Pressable)` — no new dependency, no gesture-handler needed since `Pressable`'s built-in press callbacks are enough.
- **List entrance**: use Reanimated's built-in `entering={FadeInDown}` prop directly on `FeedListItem`'s root `Animated.View` — zero custom animation logic, ladder rung 4 (installed dependency's built-in feature).
- **Hero image fade-in**: `Animated.Image`-equivalent via wrapping in `Animated.View` with `entering={FadeIn}`, since `expo-image`'s `Image` isn't Reanimated-animatable directly — animate the wrapping `View`, not the image itself.

## Risks / Trade-offs

- [`FeedListItem` root element changes from `Pressable` to `Animated.View` wrapping `Pressable`] → one extra native view per row; negligible for list sizes here (no virtualization concerns at current content volumes).
