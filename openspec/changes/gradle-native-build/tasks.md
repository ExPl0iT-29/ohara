# Tasks

## 1. Native project and build

- [x] 1.1 Generate `mobile/android/` once from the current config, remove it from `mobile/.gitignore`, and commit it. Verify `git ls-files mobile/android` lists the wrapper, `app/build.gradle` and `MainActivity.kt` under `com/ember/ohara`.
- [x] 1.2 Add upload-key signing from `OHARA_UPLOAD_*` properties or env with a warned debug fallback, ignore keystores except the template debug key, and document it in `mobile/android/SIGNING.md`. Verify by reading `app/build.gradle` and `git check-ignore` on a sample `.jks`.
- [ ] 1.3 On a machine with JDK 17+ and the Android SDK, run `./gradlew assembleDebug`, `./gradlew bundleRelease` (with and without the upload key) and install the debug build. Verify each succeeds, the bundle manifest shows `com.ember.ohara`, `versionCode 1`, target SDK 36 and no storage or overlay permission, and the unsigned case prints the warning.

## 2. Workflow and docs

- [x] 2.1 Replace `package.json` scripts with Gradle commands and remove `mobile/eas.json`. Verify `npm run` lists only the Gradle-based Android scripts and `start`.
- [x] 2.2 Update the README run and release sections (Gradle commands, signing, "do not run prebuild", native config lives in `android/`). Verify no README line tells the reader to run `eas` or `expo run:android`.
- [x] 2.3 Update `public-release-readiness` design D3 and task 1.2 from EAS to Gradle. Verify no task or decision in that change still instructs using EAS (historical notes excepted).

## Workflow follow-up

- Archive after task 1.3 passes.
