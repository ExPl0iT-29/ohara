## ADDED Requirements

### Requirement: Content Type Marker On Feed Items
The system SHALL display a human-readable content-type label on each feed item, derived from its `contentType` field.

#### Scenario: Feed item shows its type
- **WHEN** the feed list renders a Content item with `contentType: "youtube"`
- **THEN** the item displays a "YouTube" type marker distinct from its processing-status badge

### Requirement: Archive Toggle On Feed Item
The system SHALL let a user archive or unarchive a Content item from the feed or reader screen.

#### Scenario: Archiving from the feed
- **WHEN** a user triggers the archive action on a feed item
- **THEN** the item is archived and disappears from the default (Active) feed view

### Requirement: Active/Archived Feed Filter
The system SHALL provide a way to switch the feed between an Active view (default) and an Archived view.

#### Scenario: Switching to Archived view
- **WHEN** a user selects the Archived filter
- **THEN** the feed re-fetches and displays only archived Content items

#### Scenario: Switching back to Active view
- **WHEN** a user selects the Active filter
- **THEN** the feed re-fetches and displays only non-archived Content items
