# library-stats Specification

## Purpose
Gives a quick view of library size and composition without scrolling the whole feed.

## Requirements

### Requirement: Library Stats Are Viewable
The system SHALL provide a stats view showing the total number of saved Content items, a breakdown of item counts by status, a breakdown of item counts by content type, and the oldest non-archived item with `status` not `ready` (i.e. the oldest unread/unprocessed item).

#### Scenario: Viewing stats with a populated library
- **WHEN** a user opens the stats view with saved content in the library
- **THEN** the screen shows the total item count, counts grouped by status, counts grouped by content type, and identifies the oldest unread item

#### Scenario: Viewing stats with an empty library
- **WHEN** a user opens the stats view with no saved content
- **THEN** the screen shows a total count of zero without error, and no oldest-unread item is shown
