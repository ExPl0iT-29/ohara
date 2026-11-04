## MODIFIED Requirements

### Requirement: Render a full reading experience for ready content
The system SHALL render the content item's title, hero image (when present), author, source, reading time (when present), and full extracted text body using reading-optimized typography (comfortable line length, spacing, and font sizing) when a content item's status is `ready` and `extractedText` is present, and SHALL NOT render a summary section.

#### Scenario: Ready content with full metadata
- **WHEN** the reader screen loads a content item with `status: "ready"`, a non-null `heroImage`, `author`, `readingTime`, and `extractedText`
- **THEN** the screen displays the hero image, title, author, reading time, and full extracted text body in a readable layout

#### Scenario: Ready content without AI enrichment
- **WHEN** the reader screen loads a content item with `status: "ready"` and non-null `extractedText`, whether or not it carries a legacy `summary`
- **THEN** the screen renders the full reading experience (hero image, title, metadata, body text) without a summary section, and no gap, placeholder, or error is shown

#### Scenario: Ready content without a hero image
- **WHEN** the reader screen loads a content item with `status: "ready"` and `heroImage` is null
- **THEN** the screen renders without a hero image section and without a broken-image placeholder
