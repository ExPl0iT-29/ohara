# content-model Specification

## Purpose
Defines the unified `Content` domain entity that represents every saved item in the system, regardless of source, and how it is validated and persisted.

## Requirements

### Requirement: Unified Content Entity
The system SHALL represent every saved item, regardless of source (blog, website, documentation, pdf, paper, youtube, github, book, tweet, reddit, other), as a single `Content` domain entity with a consistent set of core fields.

#### Scenario: Content from any supported source uses the same shape
- **WHEN** a Content entity is constructed for any supported source type
- **THEN** it exposes the same core fields: id, url, contentType, title, description, summary, heroImage, author, source, extractedText, readingTime, duration, metadata, topics, status, savedAt, updatedAt, completedAt

### Requirement: Content Type Is A Closed Set
The system SHALL restrict `contentType` to a defined enumeration matching the supported content types in the product specification.

#### Scenario: Valid content type accepted
- **WHEN** a Content entity is created with contentType `youtube`
- **THEN** the entity is created successfully

#### Scenario: Invalid content type rejected
- **WHEN** a Content entity is created with a contentType not in the defined enumeration
- **THEN** the system SHALL reject creation with a validation error

### Requirement: Capture Fields Are Immutable
The system SHALL treat `id`, `url`, `source`, and `savedAt` as set once at creation and never modified afterward.

#### Scenario: Capture fields set at creation
- **WHEN** a Content entity is created
- **THEN** id, url, source, and savedAt are populated and considered final for the lifetime of the entity

### Requirement: Enrichment Fields Are Replaceable
The system SHALL treat `title`, `description`, `summary`, `heroImage`, `author`, `extractedText`, `readingTime`, `duration`, `metadata`, `topics`, `status`, and `completedAt` as nullable at creation and replaceable by later processing without affecting capture fields.

#### Scenario: Content created before enrichment runs
- **WHEN** a Content entity is created immediately after capture, before any processing has occurred
- **THEN** enrichment fields are null and status is `pending`

#### Scenario: Enrichment fields updated later
- **WHEN** processing completes and produces a summary, topics, and readingTime for an existing Content entity
- **THEN** those fields are updated on the entity while id, url, source, and savedAt remain unchanged

### Requirement: Content Has No Direct Project Reference
The system SHALL NOT store a project identifier or project relationship on the Content entity itself.

#### Scenario: Content entity has no project field
- **WHEN** inspecting the Content entity's fields
- **THEN** no field references a project, directly or via foreign key

### Requirement: Content Persistence
The system SHALL persist Content entities in an on-device SQLite table with a schema matching the domain entity's fields, with `metadata` and `topics` serialized as JSON text columns.

#### Scenario: Content entity round-trips through persistence
- **WHEN** a Content entity is saved to the on-device SQLite database and then retrieved by id
- **THEN** the retrieved entity has identical field values to the entity that was saved

#### Scenario: Library is portable across devices
- **WHEN** a user exports their library
- **THEN** the system SHALL produce a JSON file containing every Content entity, importable on another device to reconstruct the same library
