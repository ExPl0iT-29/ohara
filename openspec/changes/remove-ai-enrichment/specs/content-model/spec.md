## MODIFIED Requirements

### Requirement: Enrichment Fields Are Replaceable
The system SHALL treat `title`, `description`, `heroImage`, `author`, `extractedText`, `readingTime`, `duration`, `metadata`, `status`, and `completedAt` as nullable at creation and replaceable by later processing without affecting capture fields, and SHALL retain `summary` and `topics` only as legacy fields that are never populated for new items.

#### Scenario: Content created before enrichment runs
- **WHEN** a Content entity is created immediately after capture, before any processing has occurred
- **THEN** extracted fields are null and status is `pending`

#### Scenario: Enrichment fields updated later
- **WHEN** processing completes and produces a title, extractedText, and readingTime for an existing Content entity
- **THEN** those fields are updated on the entity while id, url, source, and savedAt remain unchanged
- **AND** `summary` is null and `topics` is empty

#### Scenario: Legacy values survive import and export
- **WHEN** a library containing items with non-empty `summary` or `topics` is exported and re-imported
- **THEN** those legacy values are preserved unchanged
