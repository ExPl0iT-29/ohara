## ADDED Requirements

### Requirement: Full-text search across content
The system SHALL expose `GET /content/search?q=<query>` returning content items whose title, extracted text, summary, author, url, or topics match the query, ranked by relevance.

#### Scenario: Query matches title
- **WHEN** a client requests `GET /content/search?q=<term>` where `<term>` appears in a content item's `title`
- **THEN** that content item is included in the results

#### Scenario: Query matches extracted text
- **WHEN** a client requests `GET /content/search?q=<term>` where `<term>` appears only in a content item's `extractedText`
- **THEN** that content item is included in the results

#### Scenario: Query matches topics
- **WHEN** a client requests `GET /content/search?q=<term>` where `<term>` matches one of a content item's `topics`
- **THEN** that content item is included in the results

#### Scenario: No matches
- **WHEN** a client requests `GET /content/search?q=<term>` where no content item matches
- **THEN** the system returns an empty list

#### Scenario: Results ranked by relevance
- **WHEN** a client's query matches multiple content items with differing relevance
- **THEN** results are ordered with the most relevant match first

### Requirement: Blank search query returns no results
The system SHALL return an empty list for a blank or whitespace-only `q` parameter, rather than matching all content.

#### Scenario: Blank query
- **WHEN** a client requests `GET /content/search?q=` (empty) or `q=%20` (whitespace)
- **THEN** the system returns an empty list
