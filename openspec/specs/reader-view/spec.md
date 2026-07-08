## Purpose

The reading screen — the core experience of Ohara. Renders a saved content item for reading, handling every processing state (pending/processing/failed/ready) plus loading/not-found, so reading never depends on AI enrichment or full extraction succeeding.

## Requirements

### Requirement: Render a full reading experience for ready content
The system SHALL render the content item's title, hero image (when present), author, source, reading time (when present), summary (when present), and full extracted text body using reading-optimized typography (comfortable line length, spacing, and font sizing) when a content item's status is `ready` and `extractedText` is present.

#### Scenario: Ready content with full metadata
- **WHEN** the reader screen loads a content item with `status: "ready"`, a non-null `heroImage`, `author`, `readingTime`, `summary`, and `extractedText`
- **THEN** the screen displays the hero image, title, author, reading time, summary, and full extracted text body in a readable layout

#### Scenario: Ready content without AI enrichment
- **WHEN** the reader screen loads a content item with `status: "ready"`, non-null `extractedText`, but `summary` and `topics` are null/empty
- **THEN** the screen renders the full reading experience (hero image, title, metadata, body text) without the summary section, and no gap, placeholder, or error is shown for the missing summary

#### Scenario: Ready content without a hero image
- **WHEN** the reader screen loads a content item with `status: "ready"` and `heroImage` is null
- **THEN** the screen renders without a hero image section and without a broken-image placeholder

### Requirement: Distinguish in-progress content from failed or missing content
The system SHALL show a calm, distinct "still being prepared" notice (not a generic loading spinner or error) when a content item's status is `pending` or `processing`, and SHALL NOT treat this state the same as a not-found or network error.

#### Scenario: Content still pending
- **WHEN** the reader screen loads a content item with `status: "pending"`
- **THEN** the screen displays the item's known title/url (if present) plus a calm notice that the content is still being prepared, and does not attempt to render a null `extractedText` as body content

#### Scenario: Content still processing
- **WHEN** the reader screen loads a content item with `status: "processing"`
- **THEN** the screen displays the same calm "still being prepared" treatment as the `pending` state

### Requirement: Render available metadata for failed content
The system SHALL render whatever metadata is available (title, url, source) plus a calm failure notice and a way to open the original URL when a content item's status is `failed`, rather than showing a blank or purely negative error screen.

#### Scenario: Failed extraction with partial metadata
- **WHEN** the reader screen loads a content item with `status: "failed"` and a non-null `title` and `url`
- **THEN** the screen displays the title and a notice that this content could not be fully processed, along with a control to open the original `url`

#### Scenario: Failed extraction with minimal metadata
- **WHEN** the reader screen loads a content item with `status: "failed"` and `title` is null
- **THEN** the screen falls back to displaying the `url` as the identifying label alongside the failure notice

### Requirement: Handle loading and not-found states distinctly from content status
The system SHALL show a loading state while the content item is being fetched, and a distinct not-found state when the fetch fails or returns no item, separate from any `ContentStatus` value.

#### Scenario: Initial fetch in progress
- **WHEN** the reader screen is fetching the content item and no data has returned yet
- **THEN** the screen displays a loading indicator without asserting anything about the item's processing status

#### Scenario: Content item does not exist
- **WHEN** the reader screen's fetch for a content item returns an error or no data (e.g. the id does not exist)
- **THEN** the screen displays a not-found state distinct from the `pending`/`processing`/`failed` content-status notices

### Requirement: Render extracted article HTML with formatting preserved
The system SHALL render `extractedText` as formatted rich content (headings, paragraphs, links, lists, blockquotes, inline images) when it contains HTML markup, and SHALL fall back to plain-text rendering when it does not.

#### Scenario: Extracted text contains HTML markup
- **WHEN** the reader screen loads a content item with `status: "ready"` and `extractedText` containing HTML tags
- **THEN** the screen renders paragraphs, headings, links, lists, blockquotes, and images with styling matching the app's design tokens, instead of showing raw tags or flattened text

#### Scenario: Extracted text is plain text
- **WHEN** the reader screen loads a content item with `status: "ready"` and `extractedText` containing no HTML tags (e.g. a YouTube description)
- **THEN** the screen renders it as plain reading-optimized text, unchanged from prior behavior
