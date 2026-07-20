## MODIFIED Requirements

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

#### Scenario: PDF content extracted
- **WHEN** a `pending` Content entity has contentType `pdf` and its source PDF contains extractable text
- **THEN** the system extracts `extractedText` from the PDF, derives a `title` from PDF metadata (or the first heading-like line of text, or the URL filename if neither is available), and computes `readingTime` from the extracted text
- **AND** `heroImage` and `author` are `null` unless present in PDF metadata
- **AND** the entity's status becomes `ready`

### Requirement: Unsupported Content Types Fail Gracefully
The system SHALL mark `Content` entities with no registered extractor for their contentType as `failed`, without leaving them stuck in `pending` or `processing`.

#### Scenario: Content type has no extractor
- **WHEN** a `pending` Content entity has contentType `paper`, `github`, `book`, `tweet`, or `reddit`
- **THEN** the entity's status becomes `failed`
- **AND** the failure reason is recorded on the entity

### Requirement: Extraction Failure Does Not Crash Other Processing
The system SHALL catch extraction errors for a single Content entity and mark that entity `failed` with the error recorded, without affecting processing of any other entity.

#### Scenario: Extractor raises an error
- **WHEN** an extractor raises an exception while processing a `pending` Content entity
- **THEN** that entity's status becomes `failed` with the error reason recorded

#### Scenario: PDF is corrupted or unparseable
- **WHEN** a `pending` Content entity has contentType `pdf` and the source file cannot be parsed as a valid PDF
- **THEN** the entity's status becomes `failed`
- **AND** the failure reason is recorded on the entity

#### Scenario: PDF has no extractable text
- **WHEN** a `pending` Content entity has contentType `pdf` and text extraction across all pages yields no non-whitespace content (e.g. a scanned or image-only PDF)
- **THEN** the entity's status becomes `failed` with a reason indicating no extractable text was found
- **AND** the app does not attempt OCR
