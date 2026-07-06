## 1. Capture screen

- [x] 1.1 Add `mobile/app/capture.tsx` route with modal presentation (configure `presentation: "modal"` in `_layout.tsx` `Stack.Screen` options for this route)
- [x] 1.2 Build URL text input with a confirm/submit control
- [x] 1.3 Build content-type chip selector (11 `ContentType` values, none selected by default)
- [x] 1.4 Wire submission to `useCaptureContent` mutation hook

## 2. Feedback and entry point

- [x] 2.1 Add FAB entry point on `mobile/app/index.tsx` routing to `/capture`
- [x] 2.2 On successful submission, navigate back to the feed screen (`router.back()`)
- [x] 2.3 On submission error (422 / network failure), show inline error text on the capture screen, keep screen open

## 3. Verification

- [x] 3.1 Verify tapping the FAB opens the capture screen
- [x] 3.2 Verify successful capture returns to feed and the new item appears with `pending` status
- [x] 3.3 Verify capturing without a content type omits `contentType` from the request
- [x] 3.4 Verify a malformed URL shows an inline error and keeps the capture screen open
- [x] 3.5 Confirm no backend or `mobile/src/api/content.ts` changes were required
