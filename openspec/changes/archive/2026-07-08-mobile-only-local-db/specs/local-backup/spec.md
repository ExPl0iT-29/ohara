## ADDED Requirements

### Requirement: Export Library As JSON
The system SHALL export every Content entity as a single JSON file, shareable via the platform share sheet, containing the full field set needed to reconstruct the library on import.

#### Scenario: User exports their library
- **WHEN** the user triggers export from the Settings screen
- **THEN** the system writes a JSON array of every Content entity to a file and opens the platform share sheet for that file

### Requirement: Import Full Backup
The system SHALL detect a full-backup JSON file (entries containing a `status` field) and upsert each entry into local storage by `id`, preserving already-processed content unchanged.

#### Scenario: Importing a previously exported backup
- **WHEN** the user imports a JSON file whose entries contain a `status` field
- **THEN** each entry is inserted or updated by `id` in local storage as-is, without re-running extraction or enrichment

### Requirement: Import Plain Link List
The system SHALL detect a plain link-list JSON file (entries containing only `url` and optionally `contentType`) and capture each as a new Content entity, triggering normal extraction and enrichment — enabling links saved on another device (e.g. a PC) to be brought into the mobile library without any server round-trip.

#### Scenario: Importing links saved from a PC
- **WHEN** the user imports a JSON file whose entries contain only `url` (and optionally `contentType`)
- **THEN** each entry is captured as a new `pending` Content entity and processing begins for each, identical to capturing that URL directly in the app
