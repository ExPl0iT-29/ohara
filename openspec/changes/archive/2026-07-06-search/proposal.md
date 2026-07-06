## Why

PRODUCT_SPECIFICATIONS.md specifies search across title, extracted text, summaries, topics, authors, and URLs — described as memory rather than keyword lookup. STACK.md fixes the mechanism as PostgreSQL full-text search now, with pgvector/semantic search explicitly deferred to "Future". This change delivers the now-scoped keyword/full-text layer; nothing currently lets a user find previously-saved content except scrolling the feed.

## What Changes

- Add `GET /content/search?q=<query>` — full-text search across `title`, `extracted_text`, `summary`, `topics`, `author`, and `url`, using PostgreSQL's built-in FTS (`tsvector`/`tsquery` + a GIN index), ranked by relevance.
- Add a generated `search_vector` column (or an indexed expression) on the `content` table combining the searchable fields, kept in sync automatically (Postgres generated column or a trigger — decided in design).
- Response reuses reader-api's existing `ContentResponse` shape — search is a different query path, not a different content shape.
- No AI/semantic search — that's explicitly "Future" per STACK.md/PRODUCT_SPECIFICATIONS.md and out of scope here.
- No mobile UI in this change — backend only, matching how `reader-api` preceded `reader-view`/`home-feed-ui`.

## Capabilities

### New Capabilities
- `search`: full-text search endpoint over existing content fields.

### Modified Capabilities
(none — `search_vector` is a DB-only index column, never exposed on the `Content` domain entity or any existing response schema; no content-model requirement changes)

## Impact

- New backend module: `backend/src/search/` (a thin presentation-layer route reusing content's repository/schema, or a search method added to `ContentRepository` — decided in design).
- New Alembic migration adding `search_vector` + GIN index to the `content` table.
- No changes to `POST /content`, `GET /content`, `GET /content/{id}` behavior.
