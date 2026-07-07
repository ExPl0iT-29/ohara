## ADDED Requirements

### Requirement: App appears in Android share sheet
The system SHALL register as an Android share target for shared URLs and plain text.

#### Scenario: User shares a link from another app
- **WHEN** a user shares a URL (or text containing a URL) from any Android app's share sheet
- **THEN** Ohara appears as a share destination

### Requirement: Shared URL pre-fills capture screen
The system SHALL open the capture screen with the shared URL pre-filled when the app is launched via a share intent.

#### Scenario: User selects Ohara from the share sheet
- **WHEN** a user selects Ohara from the Android share sheet for a shared URL
- **THEN** the app opens directly to the capture screen with that URL already entered in the input field

### Requirement: Manual capture unaffected
The system SHALL continue to support manually typing or pasting a URL into the capture screen without a share intent.

#### Scenario: User opens capture screen directly
- **WHEN** a user opens the capture screen via the app's own capture button (not via a share intent)
- **THEN** the URL field starts empty and behaves exactly as before
