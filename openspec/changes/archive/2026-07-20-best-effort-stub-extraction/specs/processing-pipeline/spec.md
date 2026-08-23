## MODIFIED Requirements

### Requirement: Unsupported Content Types Fail Gracefully
The system SHALL mark `Content` entities with no registered extractor for their contentType as `failed`, without leaving them stuck in `pending` or `processing`.

#### Scenario: Content type has no extractor
- **WHEN** a `pending` Content entity has contentType `paper`, `github`, `book`, `tweet`, or `reddit`
- **THEN** the entity's status becomes `failed`
- **AND** the failure reason is recorded on the entity

## ADDED Requirements

### Requirement: Meta-Rich Body-Empty Pages Succeed As Stub Captures
The system SHALL treat a page from which no body text could be extracted, but at least one of `title`, `description`, or `heroImage` was found via meta tags, as a successful stub capture rather than a failure.

#### Scenario: JS-rendered page with usable meta tags
- **WHEN** a `pending` Content entity's page yields no extractable body text but at least one of `title`, `description`, or `heroImage` is found via meta tags
- **THEN** the entity's status becomes `ready`
- **AND** `isStub` is set to `true`
- **AND** `extractedText` and `readingTime` remain `null`

#### Scenario: Page with no usable content at all
- **WHEN** a `pending` Content entity's page yields no extractable body text and no meta tags either
- **THEN** the entity's status becomes `ready` with `isStub` set to `true` and all optional fields `null`, consistent with existing generic-extraction behavior for meta-less pages
