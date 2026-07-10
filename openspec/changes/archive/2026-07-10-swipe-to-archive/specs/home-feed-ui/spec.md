## MODIFIED Requirements

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
