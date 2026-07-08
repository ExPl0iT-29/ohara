## MODIFIED Requirements

### Requirement: Pending Content Is Processed Asynchronously
The system SHALL process `Content` entities in `pending` status without blocking the capture UI, and SHALL sweep and retry any entity left in `pending` or `processing` on app launch (in case processing was interrupted, e.g. the app was killed mid-extraction).

#### Scenario: Pending content picked up immediately after capture
- **WHEN** a `Content` entity is captured
- **THEN** the app transitions its status to `processing` and begins extraction in the background, without blocking the capture screen from closing

#### Scenario: Interrupted processing is retried on next launch
- **WHEN** the app launches and a `Content` entity is found in `pending` or `processing` status
- **THEN** the app retries processing for that entity

### Requirement: Extraction Failure Does Not Crash Other Processing
The system SHALL catch extraction errors for a single Content entity and mark that entity `failed` with the error recorded, without affecting processing of any other entity.

#### Scenario: Extractor raises an error
- **WHEN** an extractor raises an exception while processing a `pending` Content entity
- **THEN** that entity's status becomes `failed` with the error reason recorded
- **AND** processing of other entities is unaffected
