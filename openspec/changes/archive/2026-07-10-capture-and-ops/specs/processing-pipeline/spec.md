## ADDED Requirements

### Requirement: Failed Content Can Be Manually Retried
The system SHALL allow processing to be re-run on demand for a single `failed` Content entity, reusing its existing id rather than creating a new entity.

#### Scenario: Manually retrying a failed entity
- **WHEN** a user triggers a retry for a `failed` Content entity
- **THEN** the system re-runs processing for that entity, transitioning it through `processing` to `ready` or back to `failed`, without creating a new Content entity
