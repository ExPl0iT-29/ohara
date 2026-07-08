## REMOVED Requirements

### Requirement: HTTP Capture Endpoint
**Reason**: Ohara moved to a mobile-only architecture with on-device SQLite storage. Capture now writes directly to the local database (`src/db/contentRepository.ts`) with no HTTP hop.
**Migration**: None needed — this was Ohara's own backend contract, not a third-party dependency. `mobile/src/api/content.ts` keeps the same exported `captureContent()` function signature, so no calling code needed to change.
