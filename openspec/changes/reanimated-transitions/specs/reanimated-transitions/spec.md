## ADDED Requirements

### Requirement: FAB press feedback
The system SHALL scale down the capture FAB when pressed and spring it back to normal size on release.

#### Scenario: User presses the FAB
- **WHEN** a user presses down on the capture FAB
- **THEN** the FAB scales down smoothly
- **AND** returns to normal size with a spring effect when released

### Requirement: Feed list entrance animation
The system SHALL animate feed list items with a fade + slide entrance when they first render.

#### Scenario: Feed list renders
- **WHEN** the feed list displays content items
- **THEN** each item fades and slides into place rather than appearing instantly

### Requirement: Reader hero image fade-in
The system SHALL fade in the reader screen's hero image rather than have it appear instantly.

#### Scenario: Reader screen opens with a hero image
- **WHEN** a content item with a hero image is displayed on the reader screen
- **THEN** the hero image fades in rather than popping in abruptly
