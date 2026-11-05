## ADDED Requirements

### Requirement: Continue Card On Feed
The system SHALL show the most recently saved started-but-unfinished item as a large Continue card above the list in the unfiltered Active feed, with its percentage read, and SHALL omit it when archived, searching or filtering.

#### Scenario: Library with a started article
- **WHEN** the Active feed has no search or filter and an item has reading progress between 2% and 97%
- **THEN** a Continue card for that item shows its title and percentage read above the other items, and the item is not repeated in the list

#### Scenario: Searching
- **WHEN** the user enters a search query
- **THEN** no Continue card is shown

### Requirement: Bottom Navigation Bar
The system SHALL show a navigation bar on the feed with Library, Archive and Settings destinations, indicating the current one.

#### Scenario: Switching to the archive
- **WHEN** the user taps Archive in the navigation bar
- **THEN** the feed shows archived items, the headline reads "Archive", and Archive is marked selected

#### Scenario: Opening settings
- **WHEN** the user taps Settings in the navigation bar
- **THEN** the Settings screen opens
