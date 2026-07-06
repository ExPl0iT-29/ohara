## Purpose

The in-app URL capture flow — the entry point for adding new content into Ohara from within the app itself, rather than only via raw `POST /content`.

## Requirements

### Requirement: Capture entry point on the feed screen
The system SHALL provide a visible control on the feed screen that navigates to a capture screen for adding a new content item.

#### Scenario: Tapping the entry point opens capture
- **WHEN** a user taps the capture entry point on the feed screen
- **THEN** the app navigates to the capture screen

### Requirement: Submit a URL to capture content
The system SHALL provide a text input for a URL (and an optional content-type selection) on the capture screen, and submit it via the existing capture API on confirmation.

#### Scenario: Successful capture
- **WHEN** a user enters a valid URL and confirms
- **THEN** the app submits the URL to `POST /content`, and on success returns to the feed screen where the new item appears with `pending` status

#### Scenario: Optional content type
- **WHEN** a user selects a content type before confirming
- **THEN** the submitted request includes that content type

#### Scenario: No content type selected
- **WHEN** a user confirms without selecting a content type
- **THEN** the submitted request omits `contentType`, matching capture-endpoint's default-to-`other` behavior

### Requirement: Handle capture failure inline
The system SHALL show a calm, inline error message on the capture screen when submission fails (e.g. malformed URL, network error), without dismissing the screen or crashing.

#### Scenario: Malformed URL rejected
- **WHEN** a user submits a URL the backend rejects as malformed
- **THEN** the capture screen displays an inline error message and remains open for correction

#### Scenario: Network failure during submission
- **WHEN** the capture request fails due to a network error
- **THEN** the capture screen displays an inline error message and remains open for retry
