## RENAMED Requirements

- FROM: `### Requirement: Tag/Topic Filter Row On Feed`
- TO: `### Requirement: Tag Filter Row On Feed`

## MODIFIED Requirements

### Requirement: Tag Filter Row On Feed
The system SHALL display a row of tappable tag chips on the feed, drawn from the union of all items' tags, that filters the list when one is selected.

#### Scenario: Selecting a chip filters the feed
- **WHEN** a user taps a tag chip
- **THEN** the feed shows only items matching that tag

#### Scenario: Deselecting a chip clears the filter
- **WHEN** a user taps an already-selected chip again
- **THEN** the tag filter is cleared and the feed returns to the unfiltered list
