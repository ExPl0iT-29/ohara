# content-search Specification

## Purpose
Lets a user find saved content by free-text query against title, summary, and extracted body text.

## Requirements

### Requirement: Search Matches Title, Summary, And Body
The system SHALL let a user search their library by a free-text query matched against each Content item's `title`, `summary`, and `extractedText`.

#### Scenario: Query matches a title
- **WHEN** a user searches for a term that appears in a saved item's `title`
- **THEN** that item is included in the search results

#### Scenario: Query matches extracted body text
- **WHEN** a user searches for a term that appears only in a saved item's `extractedText`, not its title or summary
- **THEN** that item is included in the search results

#### Scenario: No matches
- **WHEN** a user searches for a term that matches no saved item
- **THEN** the feed shows no items for that query, distinct from the normal empty-library state

### Requirement: Search Respects The Active/Archived Filter
The system SHALL apply the current Active/Archived feed filter to search results, consistent with the unfiltered feed.

#### Scenario: Searching within Active view
- **WHEN** a user searches while the feed's Active filter is selected
- **THEN** only non-archived matching items appear in the results
