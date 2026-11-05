# Proposal

## Why

Ohara is a private APK today. Publishing a free, local-only app on Google Play needs a permanent application identity, a store-acceptable release artifact, and an accurate privacy disclosure. The first two cannot be fixed after the first upload, and Play requires a privacy policy and a Data safety form even for apps that collect nothing. This change makes the app releasable; it depends on `remove-ai-enrichment` landing first so no provider key ships.

## What Changes

- Change the Android application ID from `com.explooit.mobile` to **`com.ember.ohara`** before the first upload (it is permanent afterwards).
- Produce a signed Android App Bundle (not an APK) for Play, with a version code that increases on every upload, and confirm the build meets Play's current minimum target API level.
- Audit and minimise requested Android permissions; remove any development-only configuration from release builds.
- Provide a way to move an existing private library into the new app, since a new application ID installs as a separate app: use the existing export and import.
- Add a Settings "About and privacy" entry linking to a public privacy policy.
- Write and host a plain-language privacy policy stating that no data is collected, shared, or sent to the developer, and prepare the matching Play Data safety answers.
- Prepare the store-listing deliverables Play requires (icon, feature graphic, screenshots, descriptions, content rating, ads declaration), with copy and positioning deferred to the launch plan.

**Non-goals:** accounts, cloud, AI, payments, analytics or crash reporting that sends data off-device (any of these would reopen the privacy answers), iOS, store-listing marketing copy (`docs/launch`), removal of the legacy `backend/` directory.

## Capabilities

### New Capabilities
- `release-build`: the app's permanent identity and the properties a Play-ready release artifact must have.
- `privacy-disclosure`: the public privacy policy, its in-app link, and its consistency with the Play Data safety declaration.

### Modified Capabilities

None.

## Impact

- **Config:** `mobile/app.json` (`android.package`, `android.versionCode`, name), Gradle release build from the committed `mobile/android/` (see `gradle-native-build`), signing credentials managed outside the repo.
- **Mobile:** one new Settings row and an opener for the policy URL.
- **Web:** a static privacy policy page on a stable HTTPS host (landing-page domain when it exists).
- **Docs:** README release section, `docs/launch/` store-listing checklist.
- **Existing private install:** `com.explooit.mobile` and `com.ember.ohara` are different apps on the device; the developer migrates by export and import, then uninstalls the old one.
- **Depends on:** `remove-ai-enrichment` (no embedded key in any public build).
