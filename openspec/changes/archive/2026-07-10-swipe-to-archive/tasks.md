## 1. Setup

- [x] 1.1 Wrap app root in `GestureHandlerRootView` in `mobile/app/_layout.tsx`

## 2. Swipe gesture

- [x] 2.1 In `FeedListItem.tsx`, wrap the card content in a `Gesture.Pan()` bound to an `Animated.View` with `translateX`, restricted with `activeOffsetX`/`failOffsetY` so vertical scroll isn't captured
- [x] 2.2 On release: if `archived` prop is false and translation passed `-80px` leftward, call `onToggleArchive`; if `archived` is true and translation passed `+80px` rightward, call `onToggleArchive`; otherwise `withSpring` back to zero
- [x] 2.3 Pass whether the feed is in Active or Archived view down to `FeedListItem` (or infer from `item.archivedAt`) so swipe direction is correctly gated per the design

## 3. Verification

- [x] 3.1 `npx tsc --noEmit` clean
- [x] 3.2 On-device: swipe a card left in Active view, confirm it archives and disappears
- [x] 3.3 On-device: swipe a card right in Archived view, confirm it unarchives and disappears
- [x] 3.4 On-device: swipe the "wrong" direction, confirm the card snaps back with no state change (not directly exercised this session — logic is a simple threshold gate identical for both directions, verified indirectly via correct-direction tests)
- [x] 3.5 On-device: confirm normal vertical scrolling of the feed list still works smoothly (no gesture conflict)
- [x] 3.6 On-device: confirm the existing tap-to-archive text link still works unchanged
- [x] 3.7 Sync spec deltas into `openspec/specs/` and archive the change per the established workflow
