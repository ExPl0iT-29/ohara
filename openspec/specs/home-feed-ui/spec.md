## Purpose

The feed screen's list rendering, empty/loading/error states, pull-to-refresh, and status presentation — the first screen every session opens.

## Requirements

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

### Requirement: Content Type Marker On Feed Items
The system SHALL display a human-readable content-type label on each feed item, derived from its `contentType` field.

#### Scenario: Feed item shows its type
- **WHEN** the feed list renders a Content item with `contentType: "youtube"`
- **THEN** the item displays a "YouTube" type marker distinct from its processing-status badge

### Requirement: Archive Toggle On Feed Item
The system SHALL let a user archive or unarchive a Content item from the feed or reader screen, via either a tap control or a swipe gesture on the feed card.

#### Scenario: Archiving from the feed via tap
- **WHEN** a user triggers the archive action on a feed item via the tap control
- **THEN** the item is archived and disappears from the default (Active) feed view

#### Scenario: Archiving from the feed via swipe
- **WHEN** a user swipes a feed item left past the archive threshold while viewing the Active list
- **THEN** the item is archived and disappears from the default (Active) feed view

#### Scenario: Unarchiving from the feed via swipe
- **WHEN** a user swipes a feed item right past the unarchive threshold while viewing the Archived list
- **THEN** the item is unarchived and disappears from the Archived view

#### Scenario: Swipe in the wrong direction does nothing
- **WHEN** a user swipes a feed item in the direction that has no assigned action for the current view (e.g. rightward while in the Active view)
- **THEN** the card animates back to its resting position and no archive state change occurs

### Requirement: Active/Archived Feed Filter
The system SHALL provide a way to switch the feed between an Active view (default) and an Archived view.

#### Scenario: Switching to Archived view
- **WHEN** a user selects the Archived filter
- **THEN** the feed re-fetches and displays only archived Content items

#### Scenario: Switching back to Active view
- **WHEN** a user selects the Active filter
- **THEN** the feed re-fetches and displays only non-archived Content items

### Requirement: Search Input On Feed
The system SHALL provide a search input on the feed screen that filters the displayed list by the current query.

#### Scenario: Typing a query filters the list
- **WHEN** a user types into the feed's search input
- **THEN** the feed updates to show only items matching the query

#### Scenario: Clearing the query restores the full list
- **WHEN** a user clears the search input
- **THEN** the feed returns to showing all items under the current Active/Archived and tag filters

### Requirement: Tag/Topic Filter Row On Feed
The system SHALL display a row of tappable tag/topic chips on the feed, drawn from the union of all items' tags and AI-generated topics, that filters the list when one is selected.

#### Scenario: Selecting a chip filters the feed
- **WHEN** a user taps a tag or topic chip
- **THEN** the feed shows only items matching that tag or topic

#### Scenario: Deselecting a chip clears the filter
- **WHEN** a user taps an already-selected chip again
- **THEN** the tag/topic filter is cleared and the feed returns to the unfiltered list
