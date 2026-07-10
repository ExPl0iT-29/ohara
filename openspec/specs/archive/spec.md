# archive Specification

## Purpose
Lets a user set aside content they've finished with, without deleting it, and keep the default feed focused on what's still active.

## Requirements

### Requirement: Content Can Be Archived And Unarchived
The system SHALL allow a user to archive any Content item and later unarchive it, recording an `archivedAt` timestamp that is null when the item is active.

#### Scenario: Archiving an item
- **WHEN** a user archives a Content item
- **THEN** the item's `archivedAt` field is set to the current time and the item is persisted with that value

#### Scenario: Unarchiving an item
- **WHEN** a user unarchives a previously archived Content item
- **THEN** the item's `archivedAt` field is set back to null

### Requirement: Feed Defaults To Active Content Only
The system SHALL exclude archived Content items from the feed's default list view.

#### Scenario: Default feed view
- **WHEN** the feed is displayed without an explicit archive filter selected
- **THEN** only Content items with `archivedAt` null are shown

#### Scenario: Archived view selected
- **WHEN** a user switches the feed to the Archived view
- **THEN** only Content items with a non-null `archivedAt` are shown
