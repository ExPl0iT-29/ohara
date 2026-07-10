## 1. Setup

- [ ] 1.1 Wrap app root in `GestureHandlerRootView` in `mobile/app/_layout.tsx`

## 2. Swipe gesture

- [ ] 2.1 In `FeedListItem.tsx`, wrap the card content in a `Gesture.Pan()` bound to an `Animated.View` with `translateX`, restricted with `activeOffsetX`/`failOffsetY` so vertical scroll isn't captured
- [ ] 2.2 On release: if `archived` prop is false and translation passed `-80px` leftward, call `onToggleArchive`; if `archived` is true and translation passed `+80px` rightward, call `onToggleArchive`; otherwise `withSpring` back to zero
- [ ] 2.3 Pass whether the feed is in Active or Archived view down to `FeedListItem` (or infer from `item.archivedAt`) so swipe direction is correctly gated per the design

## 3. Verification

- [ ] 3.1 `npx tsc --noEmit` clean
- [ ] 3.2 On-device: swipe a card left in Active view, confirm it archives and disappears
- [ ] 3.3 On-device: swipe a card right in Archived view, confirm it unarchives and disappears
- [ ] 3.4 On-device: swipe the "wrong" direction, confirm the card snaps back with no state change
- [ ] 3.5 On-device: confirm normal vertical scrolling of the feed list still works smoothly (no gesture conflict)
- [ ] 3.6 On-device: confirm the existing tap-to-archive text link still works unchanged
- [ ] 3.7 Sync spec deltas into `openspec/specs/` and archive the change per the established workflow
