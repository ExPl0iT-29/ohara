# Spec Delta

## Purpose

Defines the permanent identity of the app and the properties a release build must have to be accepted by Google Play, so the first upload is not a mistake that cannot be undone.

## ADDED Requirements

### Requirement: Permanent Application Identity
The system SHALL use `com.ember.ohara` as its Android application ID in every release build, and SHALL keep the `ohara` URL scheme unchanged.

#### Scenario: Inspecting a release build
- **WHEN** the release artifact's manifest is inspected
- **THEN** the application ID is `com.ember.ohara`

#### Scenario: Share and deep links still work
- **WHEN** a user shares a link to the app from a browser or opens an `ohara://` link
- **THEN** the app receives it as before

### Requirement: Existing Library Can Move To The New App
The system SHALL let a user carry a library from a build with the previous application ID into the new app using the existing export and import, with no content, tags, highlights, progress or archive state lost.

#### Scenario: Migrating from the private build
- **WHEN** a user exports from the `com.explooit.mobile` build and imports that file into the `com.ember.ohara` build
- **THEN** every item, tag, highlight, reading position and archive state is present and unchanged

### Requirement: Release Artifact Is A Signed App Bundle
The system SHALL produce its Play release as a signed Android App Bundle, signed by an upload key held outside the repository.

#### Scenario: Building for Play
- **WHEN** the production build profile is run
- **THEN** it outputs a signed `.aab` file
- **AND** no signing key or password is present in the repository

### Requirement: Version Code Increases Every Upload
The system SHALL use an integer version code that is strictly greater than that of every previously uploaded build.

#### Scenario: Second upload
- **WHEN** a new build is prepared after one has already been uploaded to Play
- **THEN** its version code is higher than the uploaded build's

### Requirement: Target API Level Meets Play Minimum
The system SHALL target at least the API level Google Play requires for new apps at the time of upload.

#### Scenario: Checking the built manifest
- **WHEN** the release manifest is inspected before upload
- **THEN** `targetSdkVersion` is at least Play's current minimum for new apps

### Requirement: Minimal Permissions
The system SHALL request only the Android permissions needed for its on-device features (network access to fetch saved pages and receiving shared links), and SHALL NOT request location, contacts, camera, microphone, or storage-wide access.

#### Scenario: Auditing the merged manifest
- **WHEN** the merged release manifest is listed
- **THEN** it contains no permission beyond those needed for fetching pages, sharing in, and exporting through the share sheet

### Requirement: Release Builds Contain No Development Configuration
The system SHALL NOT include development-client tooling, debug flags, or developer-only settings in release builds.

#### Scenario: Running a release build
- **WHEN** a release build is installed and launched
- **THEN** it starts as a standalone app with no development menu or debug overlay
