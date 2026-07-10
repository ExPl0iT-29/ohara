## ADDED Requirements

### Requirement: User Can Save A Quote And Note Per Item
The system SHALL let a user save a quote, with an optional note, attached to a Content item, and remove a previously saved entry.

#### Scenario: Adding a highlight with a note
- **WHEN** a user enters a quote and a note and saves it against a Content item
- **THEN** the item's `highlights` list gains an entry containing that quote and note

#### Scenario: Adding a highlight without a note
- **WHEN** a user enters only a quote and saves it against a Content item
- **THEN** the item's `highlights` list gains an entry with that quote and a null note

#### Scenario: Removing a highlight
- **WHEN** a user removes a previously saved highlight entry
- **THEN** that entry no longer appears in the item's `highlights` list

### Requirement: Highlights Are Not Inline Text Selection
The system SHALL present highlights as a list attached to the Content item, not as inline styling within the rendered article body.

#### Scenario: Highlights list distinct from article body
- **WHEN** the reader screen renders a Content item with saved highlights
- **THEN** the highlights appear in a list separate from the rendered `extractedText`, and the article body itself is unmodified
