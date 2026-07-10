## ADDED Requirements

### Requirement: User Can Tag And Untag Content
The system SHALL let a user add and remove freeform tags on any Content item, independent of its `contentType`.

#### Scenario: Adding a tag
- **WHEN** a user adds a tag to a Content item
- **THEN** the tag is persisted on that item's `tags` field

#### Scenario: Removing a tag
- **WHEN** a user removes a previously added tag from a Content item
- **THEN** the tag no longer appears in that item's `tags` field

### Requirement: Feed Filters By Tag Or AI Topic
The system SHALL let a user filter the feed to items matching a selected tag or AI-generated topic, drawn from the union of all items' `tags` and `topics` values.

#### Scenario: Filtering by a user tag
- **WHEN** a user selects a tag they previously applied
- **THEN** the feed shows only items with that tag

#### Scenario: Filtering by an AI topic
- **WHEN** a user selects an AI-generated topic
- **THEN** the feed shows only items whose `topics` include that value
