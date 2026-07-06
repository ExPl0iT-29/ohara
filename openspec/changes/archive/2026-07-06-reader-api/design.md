## Context

Content-model, capture-endpoint, processing-pipeline, and ai-enrichment are all implemented. `SqlAlchemyContentRepository` already has `get_by_id`, `save`, `update_enrichment`, `get_pending_batch`, `get_ready_unenriched_batch`. No list query with filtering/pagination exists yet, and no presentation-layer read schema/route exists.

## Goals / Non-Goals

**Goals:**
- Read single item by id.
- Read a paginated, filterable list (status, contentType), newest-saved first.
- Reuse the existing `Content` domain entity — no new domain concepts.

**Non-Goals:**
- No search/full-text (deferred capability).
- No auth (single-user, local-first app — unchanged from capture-endpoint).
- No write/update endpoints here.

## Decisions

- Add `list_content(limit, offset, status=None, content_type=None) -> list[Content]` to `ContentRepository` protocol + SQLAlchemy impl, ordered by `saved_at DESC`. Mirrors the existing `get_pending_batch` query shape.
- Add a `ContentResponse` Pydantic schema in `content/presentation/schemas.py` mapping every `Content` field (title, summary, topics, status, etc.) — one shared schema for both single-item and list responses.
- `GET /content/{id}` returns 404 via `HTTPException` if `get_by_id` returns `None`.
- `GET /content` query params: `limit` (default 20, max 100), `offset` (default 0), `status`, `contentType` — invalid enum values rejected by FastAPI/Pydantic at the boundary (400).

## Risks / Trade-offs

- No cursor-based pagination (offset-based) → fine at single-user scale, revisit only if it matters.
- Exposing every field (including `processingError` metadata) in one response shape → acceptable for a local-first single-user app; no data leaks to worry about here.
