## ADDED Requirements

### Requirement: Reader Shows Reading Progress
The system SHALL show a progress track at the top of the reader that fills as the user scrolls through the content.

#### Scenario: Halfway through an article
- **WHEN** the user has scrolled half of the reader's scrollable height
- **THEN** the progress track is about half filled

### Requirement: Reader Top Bar
The system SHALL show a back button and an open-original button above the reader content.

#### Scenario: Going back
- **WHEN** the user taps the back button
- **THEN** the previous screen is shown

#### Scenario: Opening the original
- **WHEN** the user taps the open-original button
- **THEN** the item's URL opens in the system browser
