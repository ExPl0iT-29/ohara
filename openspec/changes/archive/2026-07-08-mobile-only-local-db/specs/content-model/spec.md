## MODIFIED Requirements

### Requirement: Content Persistence
The system SHALL persist Content entities in an on-device SQLite table with a schema matching the domain entity's fields, with `metadata` and `topics` serialized as JSON text columns.

#### Scenario: Content entity round-trips through persistence
- **WHEN** a Content entity is saved to the on-device SQLite database and then retrieved by id
- **THEN** the retrieved entity has identical field values to the entity that was saved

#### Scenario: Library is portable across devices
- **WHEN** a user exports their library
- **THEN** the system SHALL produce a JSON file containing every Content entity, importable on another device to reconstruct the same library
