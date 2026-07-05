## ADDED Requirements

### Requirement: Save URL Endpoint
The system SHALL expose a `POST /content` endpoint that accepts a URL and creates a new `Content` entity in `pending` status.

#### Scenario: Valid URL captured
- **WHEN** a client sends `POST /content` with a well-formed URL
- **THEN** the system creates a `Content` entity with that URL, status `pending`, a generated id, and a `savedAt` timestamp
- **AND** the response includes the created entity's id, url, status, and savedAt

#### Scenario: Content type defaults when not supplied
- **WHEN** a client sends `POST /content` with a URL and no `contentType`
- **THEN** the created `Content` entity has `contentType` set to `other`

#### Scenario: Content type honored when supplied
- **WHEN** a client sends `POST /content` with a URL and `contentType` of `youtube`
- **THEN** the created `Content` entity has `contentType` set to `youtube`

### Requirement: Malformed URL Rejected
The system SHALL reject capture requests where the URL is not well-formed, without creating a `Content` entity.

#### Scenario: Invalid URL rejected
- **WHEN** a client sends `POST /content` with a value that is not a valid URL
- **THEN** the system responds with a validation error
- **AND** no `Content` entity is created

### Requirement: Capture Returns Without Waiting On Processing
The system SHALL return a response from `POST /content` without performing extraction, enrichment, or any AI processing on the captured content.

#### Scenario: Capture response contains no enrichment data
- **WHEN** a client sends `POST /content` with a valid URL
- **THEN** the response is returned without title, summary, topics, or any other enrichment field being populated
- **AND** the entity's status is `pending`
