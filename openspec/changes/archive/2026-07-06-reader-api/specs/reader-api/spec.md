## ADDED Requirements

### Requirement: Get single content item
The system SHALL expose `GET /content/{id}` returning the full content item for a given id.

#### Scenario: Existing item
- **WHEN** a client requests `GET /content/{id}` for an id that exists
- **THEN** the system returns 200 with the full content item (all fields set by capture, processing, and enrichment)

#### Scenario: Missing item
- **WHEN** a client requests `GET /content/{id}` for an id that does not exist
- **THEN** the system returns 404

### Requirement: List content items
The system SHALL expose `GET /content` returning a paginated list of content items ordered by `savedAt` descending (newest first).

#### Scenario: Default list
- **WHEN** a client requests `GET /content` with no query parameters
- **THEN** the system returns up to 20 items, newest-saved first

#### Scenario: Pagination
- **WHEN** a client requests `GET /content?limit=5&offset=10`
- **THEN** the system returns at most 5 items starting after the first 10, in the same newest-first order

### Requirement: Filter list by status and content type
The system SHALL allow filtering `GET /content` results by `status` and/or `contentType`.

#### Scenario: Filter by status
- **WHEN** a client requests `GET /content?status=ready`
- **THEN** the system returns only items whose status is `ready`

#### Scenario: Filter by content type
- **WHEN** a client requests `GET /content?contentType=youtube`
- **THEN** the system returns only items whose contentType is `youtube`

#### Scenario: Invalid filter value
- **WHEN** a client requests `GET /content?status=not-a-real-status`
- **THEN** the system returns 422 (consistent with other boundary validation, e.g. capture-endpoint's malformed URL)
