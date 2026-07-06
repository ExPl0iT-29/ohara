## ADDED Requirements

### Requirement: Distinct loading state on initial feed load
The system SHALL show a calm loading indicator while the feed's initial content list fetch is in progress, distinct from the empty and error states.

#### Scenario: Initial fetch in progress
- **WHEN** the feed screen is fetching content for the first time and no data has returned yet
- **THEN** the screen displays a loading indicator, not an empty-state or error message

### Requirement: Empty state for no saved content
The system SHALL show a calm empty state with a nudge toward the capture entry point when the content list successfully returns zero items.

#### Scenario: Fresh install with no content
- **WHEN** the feed's fetch succeeds and returns an empty list
- **THEN** the screen displays an empty state (not a blank list) that points the user toward the existing capture entry point

### Requirement: Distinct error state for failed fetch
The system SHALL show a calm error state, distinct from the empty state, when the content list fetch fails (network or backend error), with a way to retry.

#### Scenario: Fetch fails
- **WHEN** the feed's fetch for the content list fails
- **THEN** the screen displays an error state distinct from the empty-list state, with a retry control

### Requirement: Pull-to-refresh on the feed list
The system SHALL support pull-to-refresh on the feed list, re-fetching the content list on user pull-down.

#### Scenario: User pulls to refresh
- **WHEN** a user performs a pull-to-refresh gesture on the feed list
- **THEN** the app re-fetches the content list and updates the displayed items on success

### Requirement: Human-readable status presentation
The system SHALL present each content item's processing status using calm, human-readable labels instead of raw `ContentStatus` enum values, for any status other than `ready`.

#### Scenario: Pending or processing item
- **WHEN** the feed list renders an item with `status: "pending"` or `status: "processing"`
- **THEN** the item shows a "still preparing" label rather than the raw status string

#### Scenario: Failed item
- **WHEN** the feed list renders an item with `status: "failed"`
- **THEN** the item shows a "couldn't process" label rather than the raw status string

#### Scenario: Ready item
- **WHEN** the feed list renders an item with `status: "ready"`
- **THEN** the item shows no processing-status label (normal/default presentation)
