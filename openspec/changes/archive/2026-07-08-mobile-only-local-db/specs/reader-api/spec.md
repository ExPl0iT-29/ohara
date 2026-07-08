## REMOVED Requirements

### Requirement: HTTP Reader Endpoints
**Reason**: Ohara moved to a mobile-only architecture with on-device SQLite storage. Reads (list/get) now query the local database directly with no HTTP hop.
**Migration**: None needed — this was Ohara's own backend contract, not a third-party dependency. `mobile/src/api/content.ts` keeps the same exported `listContent()`/`getContent()` function signatures, so no calling code needed to change.
