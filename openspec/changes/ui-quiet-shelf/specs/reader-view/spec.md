## ADDED Requirements

### Requirement: Reader Shows Reading Progress
The system SHALL show a thin progress line at the top of the reader that fills as the user scrolls through the content.

#### Scenario: Halfway through an article
- **WHEN** the user has scrolled half of the reader's scrollable height
- **THEN** the progress line is about half filled

#### Scenario: Short content
- **WHEN** the content fits on one screen without scrolling
- **THEN** the progress line stays empty and nothing else changes
