## RENAMED Requirements

- FROM: `### Requirement: Search Matches Title, Summary, And Body`
- TO: `### Requirement: Search Matches Title And Body`

## MODIFIED Requirements

### Requirement: Search Matches Title And Body
The system SHALL let a user search their library by a free-text query matched against each Content item's `title` and `extractedText`.

#### Scenario: Query matches a title
- **WHEN** a user searches for a term that appears in a saved item's `title`
- **THEN** that item is included in the search results

#### Scenario: Query matches extracted body text
- **WHEN** a user searches for a term that appears only in a saved item's `extractedText`, not its title
- **THEN** that item is included in the search results

#### Scenario: Legacy summary text is not searched
- **WHEN** a user searches for a term that appears only in a legacy `summary` value
- **THEN** that item is not included in the search results

#### Scenario: No matches
- **WHEN** a user searches for a term that matches no saved item
- **THEN** the feed shows no items for that query, distinct from the normal empty-library state
