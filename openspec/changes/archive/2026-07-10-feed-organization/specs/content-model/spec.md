## MODIFIED Requirements

### Requirement: Unified Content Entity
The system SHALL represent every saved item, regardless of source (blog, website, documentation, pdf, paper, youtube, github, book, tweet, reddit, other), as a single `Content` domain entity with a consistent set of core fields.

#### Scenario: Content from any supported source uses the same shape
- **WHEN** a Content entity is constructed for any supported source type
- **THEN** it exposes the same core fields: id, url, contentType, title, description, summary, heroImage, author, source, extractedText, readingTime, duration, metadata, topics, status, savedAt, updatedAt, completedAt, archivedAt

### Requirement: Content Persistence
The system SHALL persist Content entities in an on-device SQLite table with a schema matching the domain entity's fields, with `metadata` and `topics` serialized as JSON text columns and `archivedAt` stored as a nullable timestamp column.

#### Scenario: Content entity round-trips through persistence
- **WHEN** a Content entity is saved to the on-device SQLite database and then retrieved by id
- **THEN** the retrieved entity has identical field values to the entity that was saved, including `archivedAt`

#### Scenario: Library is portable across devices
- **WHEN** a user exports their library
- **THEN** the system SHALL produce a JSON file containing every Content entity, including each item's `archivedAt` value, importable on another device to reconstruct the same library

#### Scenario: Existing installs gain the archive column
- **WHEN** the app launches on a device with a pre-existing `content` table that lacks an `archivedAt` column
- **THEN** the system SHALL add the column without data loss to any existing row
