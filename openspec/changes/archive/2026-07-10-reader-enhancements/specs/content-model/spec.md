## MODIFIED Requirements

### Requirement: Unified Content Entity
The system SHALL represent every saved item, regardless of source (blog, website, documentation, pdf, paper, youtube, github, book, tweet, reddit, other), as a single `Content` domain entity with a consistent set of core fields.

#### Scenario: Content from any supported source uses the same shape
- **WHEN** a Content entity is constructed for any supported source type
- **THEN** it exposes the same core fields: id, url, contentType, title, description, summary, heroImage, author, source, extractedText, readingTime, duration, metadata, topics, tags, status, savedAt, updatedAt, completedAt, archivedAt, scrollProgress, highlights

### Requirement: Content Persistence
The system SHALL persist Content entities in an on-device SQLite table with a schema matching the domain entity's fields, with `metadata`, `topics`, `tags`, and `highlights` serialized as JSON text columns, `archivedAt` stored as a nullable timestamp column, and `scrollProgress` stored as a nullable float column.

#### Scenario: Content entity round-trips through persistence
- **WHEN** a Content entity is saved to the on-device SQLite database and then retrieved by id
- **THEN** the retrieved entity has identical field values to the entity that was saved, including `scrollProgress` and `highlights`

#### Scenario: Existing installs gain the reading-progress and highlights columns
- **WHEN** the app launches on a device with a pre-existing `content` table that lacks `scrollProgress` or `highlights` columns
- **THEN** the system SHALL add the missing columns without data loss to any existing row
