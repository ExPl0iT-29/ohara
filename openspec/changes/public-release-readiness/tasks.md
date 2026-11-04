# Tasks

## 1. Application identity and build config

- [ ] 1.1 Set `expo.android.package` to `com.ember.ohara` and `android.versionCode` to 1 in `mobile/app.json`, leaving the `ohara` scheme unchanged. Verify a prebuild manifest shows `package="com.ember.ohara"` and an `ohara://` link still opens the app.
- [ ] 1.2 Add `mobile/eas.json` with a `production` profile producing an `app-bundle`, and document the local `bundleRelease` fallback in the README release section. Verify `eas build --platform android --profile production` (or the fallback) produces a `.aab` and that no keystore or password is tracked (`git status` clean, `.gitignore` covers `*.jks`).
- [ ] 1.3 Check the built manifest's `targetSdkVersion` against Play's current minimum for new apps; if lower, pin it through `expo-build-properties`. Verify with `aapt dump badging` (or the bundle's manifest) that it meets the minimum, then smoke-test the release build on a device.
- [ ] 1.4 Audit the merged manifest permissions and remove any not needed for fetching pages, receiving shared links, or exporting. Verify the listed permissions contain nothing outside that set.
- [ ] 1.5 Confirm release builds contain no dev client or debug overlay. Verify by installing the release build and launching it standalone with no development menu.

## 2. Library migration

- [ ] 2.1 Test migration end to end: export from a `com.explooit.mobile` build holding a library with tags, highlights, scroll progress and archived items, then import into a `com.ember.ohara` build. Verify counts and a field-by-field comparison of a sample of rows are identical.
- [ ] 2.2 Document the migration steps in the README release section. Verify a fresh reader can follow them as written.

## 3. Privacy policy and in-app link

- [ ] 3.1 Write `web/privacy/index.html` in plain language covering: no accounts, no data collected or shared, everything stored on-device, page requests go to the sites the user saves, backups are user-initiated files, how to delete data (clear data or uninstall), and a contact address. Verify each statement against `local-only-operation` and read it aloud against the actual network behaviour found in `remove-ai-enrichment` task 4.1.
- [ ] 3.2 Host the page at a stable HTTPS URL. Verify it loads in a browser with no login.
- [ ] 3.3 Add an About and privacy entry to `mobile/app/settings.tsx` that opens the policy URL with `expo-linking`, with a calm message when offline. Verify on a device that it opens the browser online and shows the message in airplane mode without crashing.

## 4. Play Console setup

- [ ] 4.1 Create the app in Play Console with ID `com.ember.ohara` (double-check the ID on the creation screen before confirming), enable Play App Signing, and upload the first bundle to the internal testing track. Verify the internal test install works on a real device.
- [ ] 4.2 Complete the Data safety form (no data collected, no data shared, policy URL) and the content-rating questionnaire, and set the ads declaration to no ads and the target audience to general. Verify the form summary shows "No data collected" and matches the policy text.
- [ ] 4.3 Prepare the store-listing assets: 512x512 icon, 1024x500 feature graphic, at least two phone screenshots, short and full description, and category. Verify the Play Console listing preview shows all required fields complete. Copy and positioning come from `docs/launch`.
- [ ] 4.4 Back up the upload credentials and record where they live (outside the repo). Verify a second copy exists and can be listed.

## 5. Integration

- [ ] 5.1 Install the Play-delivered internal build on a clean device and walk the whole app: capture, read, search, tag, highlight, archive, export, import, privacy link. Verify every `release-build` and `privacy-disclosure` scenario against observed behaviour and record the result.
- [ ] 5.2 Add a "disclosure check" line to the proposal checklist used for future changes, per the privacy-disclosure requirement. Verify it appears in the contributor docs.

## Workflow follow-up

- Hand the verified internal build to the closed-testing stage in `docs/launch`.
- Archive this change after review.
