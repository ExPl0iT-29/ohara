## ADDED Requirements

### Requirement: Content processing runs without a paid worker service
The system SHALL process pending content (extraction, AI enrichment) without requiring a separately-billed background worker process.

#### Scenario: Content saved on a free-tier deployment
- **WHEN** a user saves a link and the backend is deployed as a single free-tier web service
- **THEN** the content is still extracted and enriched, moving from `pending` to `ready`, without any additional paid service

### Requirement: Background processing does not run during tests
The system SHALL NOT start the background content-processing loop when the test suite instantiates the FastAPI app, to avoid non-deterministic interference with test database state.

#### Scenario: Test suite runs
- **WHEN** the backend test suite creates a `TestClient` for the FastAPI app without `ENABLE_BACKGROUND_WORKER` set
- **THEN** no background polling loop starts against the database
