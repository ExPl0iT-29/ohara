# reading-progress Specification

## Purpose
Lets the reader remember and restore roughly where a user left off in a long article.

## Requirements

### Requirement: Reader Persists Scroll Position
The system SHALL record the reader's scroll position, as a fraction of total content height, for the currently open Content item as the user scrolls.

#### Scenario: Scrolling partway through an article
- **WHEN** a user scrolls partway through an article and stops
- **THEN** the item's `scrollProgress` is persisted as the fraction of content height scrolled

### Requirement: Reader Restores Scroll Position On Open
The system SHALL restore the reader's scroll position to a previously saved `scrollProgress` when a Content item is reopened.

#### Scenario: Reopening a partially-read article
- **WHEN** a user reopens a Content item with a previously saved `scrollProgress`
- **THEN** the reader scrolls to approximately that position once the content has rendered

#### Scenario: Opening an article for the first time
- **WHEN** a user opens a Content item with no saved `scrollProgress`
- **THEN** the reader opens at the top, with no restore attempted
