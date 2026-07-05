## ADDED Requirements

### Requirement: Pending Content Is Processed Asynchronously
The system SHALL detect `Content` entities in `pending` status and process them without any involvement from the capture request path.

#### Scenario: Pending content picked up by worker
- **WHEN** a `Content` entity exists with status `pending`
- **THEN** the worker transitions its status to `processing` and begins extraction
- **AND** no capture-endpoint request is involved in triggering this transition

### Requirement: Supported Content Types Are Extracted
The system SHALL extract `title`, `description`, `heroImage`, `author`, `extractedText`, and (for video) `duration` for content types with a registered extractor.

#### Scenario: Web page content extracted
- **WHEN** a `pending` Content entity has contentType `blog`, `website`, `documentation`, or `other`
- **THEN** the system extracts title, description, extractedText, heroImage, and author from the page
- **AND** the entity's status becomes `ready`

#### Scenario: YouTube content extracted
- **WHEN** a `pending` Content entity has contentType `youtube`
- **THEN** the system extracts title, description, heroImage, author, and duration from the video
- **AND** the entity's status becomes `ready`

### Requirement: Reading Time Computed From Extracted Text
The system SHALL compute `readingTime` algorithmically from `extractedText` word count, without any AI involvement.

#### Scenario: Reading time set after text extraction
- **WHEN** extraction produces non-empty `extractedText` for a Content entity
- **THEN** `readingTime` is set to a value derived from the word count of that text

### Requirement: Unsupported Content Types Fail Gracefully
The system SHALL mark `Content` entities with no registered extractor for their contentType as `failed`, without leaving them stuck in `pending` or `processing`.

#### Scenario: Content type has no extractor
- **WHEN** a `pending` Content entity has contentType `pdf`, `paper`, `github`, `book`, `tweet`, or `reddit`
- **THEN** the entity's status becomes `failed`
- **AND** the failure reason is recorded on the entity

### Requirement: Extraction Failure Does Not Crash The Worker
The system SHALL catch extraction errors for a single Content entity, mark that entity `failed` with the error recorded, and continue processing other pending entities.

#### Scenario: Extractor raises an error
- **WHEN** an extractor raises an exception while processing a `pending` Content entity
- **THEN** that entity's status becomes `failed` with the error reason recorded
- **AND** the worker continues processing remaining `pending` entities

### Requirement: Processing Never Populates AI-Derived Fields
The system SHALL NOT populate `summary` or `topics` during processing; those fields remain null after this pipeline runs.

#### Scenario: Ready content has no summary or topics
- **WHEN** a Content entity's status becomes `ready` after processing
- **THEN** its `summary` and `topics` fields remain null
