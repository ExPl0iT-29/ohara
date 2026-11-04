## ADDED Requirements

### Requirement: Feed Filters By Tag
The system SHALL let a user filter the feed to items matching a selected tag, drawn from the union of all items' `tags` values.

#### Scenario: Filtering by a user tag
- **WHEN** a user selects a tag they previously applied
- **THEN** the feed shows only items with that tag

#### Scenario: Legacy topics are not offered as filters
- **WHEN** an item has legacy `topics` values and no matching tag
- **THEN** those topics do not appear as filter options

## REMOVED Requirements

### Requirement: Feed Filters By Tag Or AI Topic
**Reason**: AI topics are no longer produced, so there is nothing to filter by; tag filtering is retained as its own requirement.
**Migration**: Use user tags. Legacy `topics` values stay in the database but are not shown or filterable.
