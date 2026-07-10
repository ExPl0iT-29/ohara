## ADDED Requirements

### Requirement: Reader Restores Saved Scroll Position
The system SHALL restore the reader's scroll position to a previously saved `scrollProgress` once the content has rendered, for `ready` content items.

#### Scenario: Reopening a partially-read article
- **WHEN** the reader screen loads a `ready` content item with a saved `scrollProgress`
- **THEN** once the article body has rendered, the screen scrolls to approximately that position without a visible jump-scroll animation

### Requirement: Reader Shows A Highlights List
The system SHALL render a highlights/notes list below the article body for `ready` content items, showing each saved quote and its optional note, with controls to add a new entry and remove an existing one.

#### Scenario: Item has saved highlights
- **WHEN** the reader screen loads a `ready` content item with a non-empty `highlights` list
- **THEN** the screen displays each highlight's quote and note (if present) in a list below the article body

#### Scenario: Item has no saved highlights
- **WHEN** the reader screen loads a `ready` content item with an empty `highlights` list
- **THEN** the screen shows the add-highlight control without an empty-list placeholder cluttering the view
