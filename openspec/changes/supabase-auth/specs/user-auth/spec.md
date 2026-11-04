# Spec Delta

## Purpose

Defines optional Google sign-in for Ohara: how a person becomes a signed-in user, how that state persists, how their private profile is protected, and the guarantee that accounts never interfere with the on-device library.

## ADDED Requirements

### Requirement: Sign-In Is Optional
The system SHALL let every feature that works today operate without an account, and SHALL NOT require sign-in at install, first launch, or any later point to capture, read, search, tag, highlight, archive, export, or import content.

#### Scenario: Fresh install without an account
- **WHEN** a user installs the app and never signs in
- **THEN** capture, extraction, reading, search, tags, highlights, archive, export and import all work as they do today

#### Scenario: Onboarding does not gate on sign-in
- **WHEN** a user completes first-run onboarding
- **THEN** they reach the library without being asked to create an account

### Requirement: Google Sign-In
The system SHALL let a user sign in with their Google account, and SHALL request only the basic identity scopes (openid, email, profile).

#### Scenario: Successful sign-in
- **WHEN** the user taps Sign in with Google in Settings and completes Google's consent
- **THEN** the app becomes signed-in and shows the account's email in Settings

#### Scenario: User cancels sign-in
- **WHEN** the user dismisses the Google sign-in screen without completing it
- **THEN** the app remains signed-out and shows no error

#### Scenario: Sign-in fails
- **WHEN** the sign-in flow returns an error or the network is unavailable
- **THEN** the app remains signed-out and shows a calm message that sign-in did not complete, with a way to retry

### Requirement: Account State Is Explicit
The system SHALL expose exactly two account states to the rest of the app, `signed-out` and `signed-in`, so later features can gate on a single value.

#### Scenario: Signed-out state
- **WHEN** no valid session exists
- **THEN** the account state is `signed-out`

#### Scenario: Signed-in state
- **WHEN** a valid session exists
- **THEN** the account state is `signed-in` and the user's id is available

### Requirement: Session Persists Across Restarts
The system SHALL persist the session in secure on-device storage so a signed-in user is still signed-in after the app is closed and reopened.

#### Scenario: Restart while signed-in
- **WHEN** a signed-in user force-closes and reopens the app
- **THEN** the account state is `signed-in` without a new Google prompt

### Requirement: Offline Never Signs The User Out
The system SHALL keep the account `signed-in` while the device is offline or a token refresh fails because of connectivity, and SHALL return to `signed-out` only when the user signs out or the server rejects the session as invalid.

#### Scenario: Reopen with no network
- **WHEN** a signed-in user opens the app with no connectivity and an expired access token
- **THEN** the account state stays `signed-in` and local features work normally

#### Scenario: Session revoked by the server
- **WHEN** the server rejects the refresh token as invalid or revoked
- **THEN** the account state becomes `signed-out` and local content is unchanged

### Requirement: Sign-Out Preserves Local Data
The system SHALL clear only the session on sign-out and SHALL NOT delete, modify, or hide any on-device content.

#### Scenario: Signing out
- **WHEN** a signed-in user taps Sign out
- **THEN** the account state becomes `signed-out`
- **AND** every on-device content item, tag and highlight is unchanged

### Requirement: Signing In Does Not Alter Local Data
The system SHALL NOT upload, modify, or delete on-device content as a side effect of signing in. Any data movement requires its own explicit, consented feature.

#### Scenario: First sign-in with an existing library
- **WHEN** a user with 200 saved items signs in for the first time
- **THEN** all 200 items remain unchanged on the device
- **AND** nothing is uploaded

### Requirement: Per-User Profile With Row-Level Security
The system SHALL create exactly one profile record per account at first sign-in, and SHALL enforce at the database level that a user can read and modify only their own profile.

#### Scenario: Profile created on first sign-in
- **WHEN** a Google account signs in for the first time
- **THEN** a profile record exists for that user id

#### Scenario: User reads another user's profile
- **WHEN** a signed-in user requests a profile whose id is not their own
- **THEN** the database returns no row

#### Scenario: Unauthenticated access
- **WHEN** a request carries no valid session
- **THEN** the database returns no profile rows and rejects writes

### Requirement: Clients Hold No Privileged Credentials
The system SHALL ship only the project URL and publishable key in the app, and SHALL keep any service-role or provider secret exclusively server-side.

#### Scenario: Inspecting the built app
- **WHEN** the built app bundle is inspected
- **THEN** it contains no service-role key and no AI provider key
