# Spec Delta

## Purpose

Defines how Ohara's Android app is built and signed from a committed native project using only Gradle, so builds do not depend on Expo build tooling or hosted build services.

## ADDED Requirements

### Requirement: Native Project Is Committed
The repository SHALL contain the complete Android native project under `mobile/android/`, and builds SHALL use it as-is without regenerating it.

#### Scenario: Fresh clone
- **WHEN** a developer clones the repository and installs npm dependencies
- **THEN** `mobile/android/` exists with the Gradle wrapper, app module and manifest for `com.ember.ohara`

### Requirement: Builds Use Gradle Only
The system SHALL produce debug builds, release APKs and release App Bundles with Gradle wrapper commands alone, without running Expo CLI commands or any hosted build service.

#### Scenario: Building a Play bundle
- **WHEN** a developer runs `./gradlew bundleRelease` in `mobile/android/`
- **THEN** a release `.aab` is produced with the JS bundle embedded

#### Scenario: Installing a debug build
- **WHEN** a developer runs `./gradlew installDebug` with a device connected
- **THEN** the debug app is installed on the device

### Requirement: Upload Key Is Never Committed
Release signing SHALL read the upload keystore path and passwords from user-level Gradle properties or environment variables, and the repository SHALL NOT contain them.

#### Scenario: Signed release
- **WHEN** the four `OHARA_UPLOAD_*` values are set and `bundleRelease` runs
- **THEN** the bundle is signed with the upload key

#### Scenario: No key configured
- **WHEN** the `OHARA_UPLOAD_*` values are absent and a release task runs
- **THEN** the build signs with the debug key and prints a warning that the output cannot be uploaded to Play

### Requirement: Native Configuration Lives In The Native Project
Application ID, version code, version name, permissions and signing SHALL be defined in `mobile/android/`, and the documented workflow SHALL NOT regenerate that directory.

#### Scenario: Bumping the version for an upload
- **WHEN** a developer prepares a new Play upload
- **THEN** they raise `versionCode` in `mobile/android/app/build.gradle` and no regeneration step is involved
