## 1. Design tokens

- [ ] 1.1 Extend `mobile/tailwind.config.js`: add `accent.yellow`/`accent.pink`/`accent.violet`/`accent.mint`, restyle `brand` to bold yellow (primary CTA color), keep `paper`/warm off-white base
- [ ] 1.2 Add condensed/bold display font weight token for headings if a suitable font is available, otherwise increase weight/tracking on existing `display`/`title` sizes

## 2. Primitives

- [ ] 2.1 Add `mobile/src/components/ui/BrutalCard.tsx`: bordered card with faux hard-offset shadow (background layer + foreground layer), accepts `accentColor` for optional folder-tab
- [ ] 2.2 Add `mobile/src/components/ui/BrutalButton.tsx`: bordered pill/square button, press-down shadow-collapse animation, `variant` for primary/destructive/neutral

## 3. Screen re-skins

- [ ] 3.1 Capture screen: paste-link input and add button restyled with `BrutalButton`/bordered input
- [ ] 3.2 Feed/library screen: content cards and collection cards restyled with `BrutalCard`; collection cards get folder-tab accent
- [ ] 3.3 Reader screen chrome: archive button, tag pills, highlight save button restyled with `BrutalButton`; reader body text untouched
- [ ] 3.4 Settings screen: rows restyled as bordered cards matching Tuckii's settings list pattern

## 4. Verification

- [ ] 4.1 `npx tsc --noEmit` clean
- [ ] 4.2 On-device or emulator: visually confirm capture, feed, reader, and settings screens render the new bold style consistently in both light and dark mode
- [ ] 4.3 Sync spec delta into `openspec/specs/ui-redesign/spec.md`, archive the change
