## ADDED Requirements

### Requirement: Render A Distinct Preview For Stub Captures
The system SHALL render a distinct "preview only" reading experience — title, description, hero image when present, and a prominent control to open the original URL — instead of an empty reader body, when a content item has `status: "ready"` and `isStub: true`.

#### Scenario: Stub content with title and description
- **WHEN** the reader screen loads a content item with `status: "ready"`, `isStub: true`, non-null `title`/`description`, and null `extractedText`
- **THEN** the screen displays the title, description, and hero image (if present), plus a prominent "Open original link" control
- **AND** the screen does not attempt to render a reader body or show it as empty/broken

#### Scenario: Stub content with no metadata at all
- **WHEN** the reader screen loads a content item with `status: "ready"`, `isStub: true`, and all of `title`/`description`/`heroImage` null
- **THEN** the screen displays the item's `url` plus the same "preview only, open original link" treatment
