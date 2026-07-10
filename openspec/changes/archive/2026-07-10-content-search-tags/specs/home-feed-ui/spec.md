## ADDED Requirements

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
