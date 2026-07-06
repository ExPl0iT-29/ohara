## Why

Ohara can only write content (`POST /content`), never read it back over HTTP. No app, script, or manual check can retrieve saved items. A reader-facing API is the minimum needed before any UI work (reader-view, home-feed-ui, capture-ui) can start.

## What Changes

- Add `GET /content/{id}` — fetch a single content item by id, 404 if missing.
- Add `GET /content` — list content items, newest-saved first, with pagination (`limit`/`offset`), optional filtering by `status` and `contentType`.
- Response schema exposes the full `Content` entity (all fields set by capture, processing-pipeline, and ai-enrichment).

## Capabilities

### New Capabilities
- `reader-api`: read endpoints (`GET /content/{id}`, `GET /content`) for retrieving saved content, including list filtering and pagination.

### Modified Capabilities
(none — no existing requirement changes, purely additive read endpoints)

## Impact

- `backend/src/main.py` — new routes.
- `backend/src/content/presentation/` — new schemas/routes for read responses.
- `backend/src/content/domain/repository.py` / `infrastructure/repository.py` — new read methods (`get_by_id` already exists; need `list` with filter/pagination).
- New tests: `backend/tests/test_reader_api.py`.
