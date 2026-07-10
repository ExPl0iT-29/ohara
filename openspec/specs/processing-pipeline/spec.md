# processing-pipeline

## Purpose
TBD

## Requirements

### Requirement: Pending Content Is Processed Asynchronously
The system SHALL process `Content` entities in `pending` status without blocking the capture UI, and SHALL sweep and retry any entity left in `pending` or `processing` on app launch (in case processing was interrupted, e.g. the app was killed mid-extraction).

#### Scenario: Pending content picked up immediately after capture
- **WHEN** a `Content` entity is captured
- **THEN** the app transitions its status to `processing` and begins extraction in the background, without blocking the capture screen from closing

#### Scenario: Interrupted processing is retried on next launch
- **WHEN** the app launches and a `Content` entity is found in `pending` or `processing` status
- **THEN** the app retries processing for that entity

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
The system SHALL compute `readingTime` algorithmically from `extractedText` word count, ignoring HTML markup, without any AI involvement.

#### Scenario: Reading time set after text extraction
- **WHEN** extraction produces non-empty `extractedText` for a Content entity
- **THEN** `readingTime` is set to a value derived from the word count of that text, with any HTML tags excluded from the count

### Requirement: Web Page Extraction Preserves Formatting
The system SHALL preserve an article's structural HTML (headings, paragraphs, links, lists, blockquotes, images) in `extractedText` when extracting web page content, sanitized to remove scripts, styles, and event-handler attributes.

#### Scenario: Web page content extracted with formatting
- **WHEN** a `pending` Content entity has contentType `blog`, `website`, `documentation`, or `other`, and extraction succeeds via the primary extractor
- **THEN** `extractedText` contains sanitized HTML preserving the article's headings, paragraphs, links, lists, blockquotes, and images
- **AND** the entity's status becomes `ready`

### Requirement: Unsupported Content Types Fail Gracefully
The system SHALL mark `Content` entities with no registered extractor for their contentType as `failed`, without leaving them stuck in `pending` or `processing`.

#### Scenario: Content type has no extractor
- **WHEN** a `pending` Content entity has contentType `pdf`, `paper`, `github`, `book`, `tweet`, or `reddit`
- **THEN** the entity's status becomes `failed`
- **AND** the failure reason is recorded on the entity

### Requirement: Extraction Failure Does Not Crash Other Processing
The system SHALL catch extraction errors for a single Content entity and mark that entity `failed` with the error recorded, without affecting processing of any other entity.

#### Scenario: Extractor raises an error
- **WHEN** an extractor raises an exception while processing a `pending` Content entity
- **THEN** that entity's status becomes `failed` with the error reason recorded
- **AND** processing of other entities is unaffected

### Requirement: Processing Never Populates AI-Derived Fields
The system SHALL NOT populate `summary` or `topics` during processing; those fields remain null after this pipeline runs.

#### Scenario: Ready content has no summary or topics
- **WHEN** a Content entity's status becomes `ready` after processing
- **THEN** its `summary` and `topics` fields remain null

### Requirement: Failed Content Can Be Manually Retried
The system SHALL allow processing to be re-run on demand for a single `failed` Content entity, reusing its existing id rather than creating a new entity.

#### Scenario: Manually retrying a failed entity
- **WHEN** a user triggers a retry for a `failed` Content entity
- **THEN** the system re-runs processing for that entity, transitioning it through `processing` to `ready` or back to `failed`, without creating a new Content entity
