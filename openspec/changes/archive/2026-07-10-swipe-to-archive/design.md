## Context

`FeedListItem.tsx` already takes an `onToggleArchive` callback (wired up in `feed-organization`). Adding swipe is purely a new input path to that same callback — no new archive logic needed. `react-native-gesture-handler` is present (v3.0.2, transitive) but `GestureHandlerRootView` is not yet mounted anywhere, which is required for any gesture to register.

## Goals / Non-Goals

**Goals:**
- Swipe left on a feed card in Active view archives it; swipe right in Archived view unarchives it.
- Keep the existing tap-to-archive link working unchanged.

**Non-Goals:**
- No swipe-to-delete, no multi-directional action menu, no undo toast — same single action the tap link already performs, just a second way to trigger it.
- No custom swipe library — hand-rolled `Gesture.Pan` + `reanimated` `translateX`, consistent with how this app already animates (FAB press scale, list-item fade-in) rather than adding `react-native-gesture-handler`'s `Swipeable` component's own dependency surface (it's part of the same package already present, but a bespoke pan gesture keeps the visual behavior — direction depends on current view — simple to control without fighting a pre-built component's API).

## Decisions

- **`Gesture.Pan()` + `Animated.View` with `translateX`, not `Swipeable` from gesture-handler.** `Swipeable` assumes a fixed swipe-to-reveal-actions pattern; this app just needs "past X px in the right direction, fire callback, animate back or away." A ~15-line pan gesture is simpler than configuring `Swipeable`'s render-action-props API for a single action.
- **Direction is threshold + view-aware:** in Active view, only leftward swipe past `-80px` triggers archive; in Archived view, only rightward swipe past `+80px` triggers unarchive. Swiping the wrong direction just snaps back (`withSpring`) — no action.
- **`GestureHandlerRootView` added once at the root layout** (`app/_layout.tsx`), wrapping the existing `ShareIntentProvider`. Required unconditionally for any gesture-handler gesture to work; a one-line addition.

## Risks / Trade-offs

- [Swipe direction only usable one way per view means a user in Active view can't swipe-unarchive without switching tabs] → intentional; matches the existing tap-link behavior (label already says "Archive" vs "Unarchive" per view) and avoids ambiguous swipe semantics on the same card.
- [`FlatList` + pan gesture can occasionally conflict with vertical scroll on a fast diagonal swipe] → `Gesture.Pan()` restricted with `.activeOffsetX([-10, 10])`/`.failOffsetY([-10, 10])` so a mostly-vertical drag is ceded to the list's scroll, not captured by the card.

## Open Questions

None.
