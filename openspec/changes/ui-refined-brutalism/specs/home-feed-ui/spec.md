## ADDED Requirements

### Requirement: Featured Lead Card
The system SHALL render the first item of the unfiltered Active feed as a full card showing its hero image (or a band in its type colour), type, title, source, length and reading progress, and render all other items as compact rows.

#### Scenario: Unfiltered library
- **WHEN** the Active feed shows items with no search or filter
- **THEN** the first item is a full card and the rest are compact rows

#### Scenario: Searching
- **WHEN** the user enters a search query
- **THEN** every result is a compact row

### Requirement: Content Type Colour Coding
The system SHALL use one accent colour per content-type family for type pills and tiles: yellow for articles and websites, pink for video, violet for PDFs, papers and books, mint for docs and code, blue for social posts.

#### Scenario: Mixed library
- **WHEN** the feed shows a YouTube item and a PDF without hero images
- **THEN** the YouTube item's tile is pink and the PDF's tile is violet
