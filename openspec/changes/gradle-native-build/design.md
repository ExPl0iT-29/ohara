# Design

## Context

Expo SDK 57 project with continuous native generation: `/android` was gitignored and rebuilt by `expo prebuild`. The app uses nine Expo modules at runtime. `public-release-readiness` added `eas.json` and planned EAS Build. See proposal.md for motivation.

## Goals / Non-Goals

**Goals:** one committed native project; standard Gradle commands for every build; secrets outside git.

**Non-Goals:** removing Expo libraries (a much larger rewrite the owner declined), iOS.

## Decisions

### D1. Generate once, then own `android/`
Run prebuild a final time from the current `app.json` (ID, versionCode, blocked permissions already applied) and commit the output. From then on `android/` is hand-maintained. *Alternative:* keep prebuild and only stop using EAS. Rejected: still makes the native project a build artefact of Expo tooling, which is what the owner wants to drop.

### D2. Keep Expo libraries; accept that Gradle calls into them
Autolinking (`expo-modules-autolinking` via `settings.gradle`) and the React Native Gradle plugin's JS bundling (`bundleCommand = "export:embed"` through `@expo/cli`) run inside Gradle. The developer never runs an Expo command for a build, and there is no hosted service. Replacing these would mean replacing every Expo module (router, SQLite, share intent, file system), which was explicitly declined.

### D3. Signing from properties or environment, debug fallback
`app/build.gradle` defines a `release` signing config only when `OHARA_UPLOAD_STORE_FILE` is present (Gradle property or env), then uses it for the release build type. Otherwise it signs with the debug key and warns. *Why fall back instead of failing:* local release APKs stay testable without a key, and Play itself rejects debug-signed uploads, so the fallback cannot be shipped by accident. *Alternative:* fail hard. Rejected as friction for local testing.

### D4. `app.json` stays for runtime config only
`expo-constants` and other modules still read `app.json` at bundle time (for example the version shown in Settings), so it remains, but native fields in it no longer take effect. README states that native changes go in `android/`. Keep `expo.version` in step with `versionName` so the Settings version matches.

### D5. Scripts call Gradle
`npm run android` → `./gradlew installDebug`; `android:release-apk`, `android:bundle`, `android:clean`. `npm start` still launches Metro for fast refresh during development.

## Risks / Trade-offs

- **Build not verified in this change's authoring environment** (no Android SDK reachable) → task 1.3 verifies on a machine with the SDK before merge.
- **Upgrading Expo or React Native later means hand-merging template changes into `android/`** → accepted cost of owning the native project; follow the React Native upgrade helper.
- **Someone runs `expo prebuild --clean` out of habit** → it would overwrite manual edits; README warns, and git shows the diff.
- **`app.json` and `build.gradle` versions drift** → release checklist bumps both.

## Migration Plan

1. Commit `android/`, update scripts and docs, remove `eas.json`.
2. On a machine with JDK and Android SDK: `./gradlew assembleDebug` and `bundleRelease`; install and smoke-test.
3. Rollback: delete `android/` from git and restore the ignore rule; prebuild regenerates it.
