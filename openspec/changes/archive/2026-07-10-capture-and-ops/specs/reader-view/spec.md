## ADDED Requirements

### Requirement: Retry Control For Failed Content
The system SHALL provide a retry control on the failure notice for a `failed` Content item that re-runs processing for that same item without creating a new entry.

#### Scenario: Retrying a failed item
- **WHEN** a user taps the retry control on a `failed` Content item
- **THEN** the system re-runs processing for that item's existing id, and its status updates accordingly (`processing` then `ready` or `failed` again)
