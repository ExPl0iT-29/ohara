## Purpose

Related-content surfacing based on shared AI-generated topics — the non-embeddings stopgap for the "recommendation engine" deferred in PRODUCT_SPECIFICATIONS.md's AI Features > Future.

## Requirements

### Requirement: Related content by shared topics
The system SHALL expose `GET /content/{contentId}/related` returning other `ready` content items that share at least one topic with the given content item, ordered by number of shared topics descending.

#### Scenario: Related items share topics
- **WHEN** a client requests `GET /content/{contentId}/related` for a `ready` item with topics `["rust", "systems"]`, and another `ready` item exists with topics `["rust", "networking"]`
- **THEN** the second item is included in the results

#### Scenario: More overlap ranks first
- **WHEN** two other items overlap with the source item's topics by different amounts
- **THEN** the item with more shared topics appears first in the results

#### Scenario: Source item excluded from its own results
- **WHEN** a client requests `GET /content/{contentId}/related`
- **THEN** the source item itself never appears in the results

### Requirement: No topics yields no related content
The system SHALL return an empty list from `GET /content/{contentId}/related` when the source item has no topics, rather than an error or unrelated results.

#### Scenario: Source item has no topics
- **WHEN** a client requests `GET /content/{contentId}/related` for an item whose `topics` is empty (not yet AI-enriched)
- **THEN** the system returns an empty list

### Requirement: Related content endpoint 404s for missing content
The system SHALL return 404 from `GET /content/{contentId}/related` when the given `contentId` does not exist.

#### Scenario: Nonexistent content id
- **WHEN** a client requests `GET /content/{contentId}/related` for an id that does not exist
- **THEN** the system returns 404
