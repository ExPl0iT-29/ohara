## 1. Setup

- [x] 1.1 Add `react-native-worklets/plugin` to `mobile/babel.config.js` (last in plugins array)

## 2. FAB press feedback

- [x] 2.1 Convert capture FAB in `mobile/app/index.tsx` to `Animated.createAnimatedComponent(Pressable)` with scale animation on `onPressIn`/`onPressOut`

## 3. Feed list entrance

- [x] 3.1 Wrap `FeedListItem`'s root in `Animated.View` with `entering={FadeInDown}`

## 4. Reader hero image fade-in

- [x] 4.1 Wrap hero image in `ReaderHeader` with `Animated.View` using `entering={FadeIn}`

## 5. Verification

- [x] 5.1 Typecheck mobile (`pnpm tsc --noEmit` or project's typecheck script) — clean, no errors
- [ ] 5.2 Confirm FAB scales on press in a running app/simulator (needs manual device/simulator run — not done in this session)
- [ ] 5.3 Confirm list items fade/slide in on feed load (needs manual device/simulator run — not done in this session)
- [ ] 5.4 Confirm hero image fades in on reader screen open (needs manual device/simulator run — not done in this session)
