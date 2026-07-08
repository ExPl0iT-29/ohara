## ADDED Requirements

### Requirement: Render extracted article HTML with formatting preserved
The system SHALL render `extractedText` as formatted rich content (headings, paragraphs, links, lists, blockquotes, inline images) when it contains HTML markup, and SHALL fall back to plain-text rendering when it does not.

#### Scenario: Extracted text contains HTML markup
- **WHEN** the reader screen loads a content item with `status: "ready"` and `extractedText` containing HTML tags
- **THEN** the screen renders paragraphs, headings, links, lists, blockquotes, and images with styling matching the app's design tokens, instead of showing raw tags or flattened text

#### Scenario: Extracted text is plain text
- **WHEN** the reader screen loads a content item with `status: "ready"` and `extractedText` containing no HTML tags (e.g. a YouTube description)
- **THEN** the screen renders it as plain reading-optimized text, unchanged from prior behavior
