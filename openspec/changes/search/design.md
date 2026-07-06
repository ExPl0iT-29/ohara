## Context

`backend/src/content/infrastructure/models.py` defines `ContentModel` with `title`, `extracted_text`, `summary`, `topics` (JSONB array), `author`, `url` columns. PostgreSQL FTS is the fixed mechanism per STACK.md; pgvector/semantic search is explicitly deferred. No search infrastructure exists yet.

## Goals / Non-Goals

**Goals:**
- Full-text search across title, extracted_text, summary, topics, author, url.
- Relevance-ranked results using Postgres's native `ts_rank`.
- Reuse the existing `ContentResponse` shape — search returns the same content items reader-api already returns.

**Non-Goals:**
- Semantic/vector search (pgvector) — explicitly "Future" per STACK.md.
- Search UI in the mobile app — backend only, matching reader-api's own precedent.
- Fuzzy/typo-tolerant matching beyond what Postgres FTS provides by default (stemming via `to_tsvector('english', ...)` is sufficient for this change).
- Faceted/filtered search combined with status/contentType filters — a plain `q` param only; combining with reader-api's existing filters can be a follow-up if wanted.

## Decisions

- **Generated `search_vector` column** on `content`, computed via Postgres `GENERATED ALWAYS AS (...) STORED` from `title`, `extracted_text`, `summary`, `author`, `url`, and `topics` (cast via `array_to_string` since topics is JSONB) — kept automatically in sync by Postgres itself, no trigger or application-level bookkeeping needed. Rationale: a generated column is simpler and less error-prone than a manual trigger or an application-side "update the vector on every write" convention that could be forgotten in a future change.
- **GIN index** on `search_vector` for query performance.
- **Search lives on `ContentRepository`**, not a separate module: add `search(query: str, limit: int) -> list[Content]` to the existing `ContentRepository` Protocol/`SqlAlchemyContentRepository`, since it's fundamentally a different query over the same aggregate, not a new domain concept. Rationale: mirrors how `list_content`/`get_pending_batch` already live there; avoids a `backend/src/search/` module that would just re-wrap content's own repository for no benefit.
- **Route**: `GET /content/search?q=<query>&limit=<n>` added to `content/presentation/router.py` (not `/search`) — same rationale, it's a content query, the URL should say so. `limit` defaults to 20/capped at 100, matching `GET /content`'s existing convention.
- **Query construction**: `plainto_tsquery('english', q)` (safe for arbitrary user input, no query-syntax injection surface) ranked via `ts_rank(search_vector, query)` descending.
- **Empty/blank query**: return an empty list rather than erroring or matching everything — a blank search isn't a meaningful "match all" request for this feature.

## Risks / Trade-offs

- [English-only stemming (`to_tsvector('english', ...)`)] → Acceptable for now; multi-language content stemming is a much larger feature, not attempted here.
- [Generated column requires a migration that rewrites the table] → Table is small at this stage (early product); acceptable one-time cost, called out so it isn't a surprise at migration time.
