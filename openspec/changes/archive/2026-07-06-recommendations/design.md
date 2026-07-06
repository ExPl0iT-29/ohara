## Context

`Content.topics: list[str]` is populated by `ai-enrichment` (or stays empty if AI is disabled/hasn't run yet). `content` table stores `topics` as JSONB. No relationship data or embeddings exist. This change adds one query method, not a new module — it's small enough to live directly on `ContentRepository` alongside `search`/`list_content`.

## Goals / Non-Goals

**Goals:**
- Related content purely from topic overlap — deterministic, explainable, zero AI cost at request time (the AI cost already happened during `ai-enrichment`).
- Graceful degradation: no topics → no related content, not an error.

**Non-Goals:**
- Embeddings/semantic similarity (pgvector) — explicitly "Future" per STACK.md/PRODUCT_SPECIFICATIONS.md; this change is the non-semantic stopgap, not a replacement.
- Collaborative filtering / usage-based recommendations — no user interaction data exists to base this on (single-user app, no read/click tracking).
- Mobile UI — backend only.
- Considering `pending`/`processing`/`failed` items as candidates — only `ready` items have stable topics worth recommending from/to.

## Decisions

- **`find_related(content_id, limit) -> list[Content]` on `ContentRepository`**, not a new module. Rationale: same shape as `search` — a different read query over the same aggregate, not a new domain concept worth a `backend/src/recommendations/` module.
- **Overlap computed in SQL via JSONB containment/intersection**, not fetched-then-filtered in Python: use Postgres's `jsonb` array functions to count shared elements between two `topics` arrays, ordered by overlap count descending, limited. Rationale: avoids pulling the entire `content` table into the app process to compute overlap client-side; scales fine at current data volumes and stays correct as the table grows.
- **Route**: `GET /content/{content_id}/related?limit=<n>` (default 5, max 20) on the existing content router. Returns 404 if the source `content_id` doesn't exist (consistent with `GET /content/{id}`'s existing behavior), then an empty list (not 404) if it exists but has no topics or no overlapping items.
- **Route ordering**: must be registered before the existing `GET /content/{content_id}` route's sibling static paths (`/content/search`) but its own path shape (`/content/{content_id}/related`) doesn't collide with `/content/{content_id}` since FastAPI matches full path segments — no reordering needed beyond what `search` already required.

## Risks / Trade-offs

- [Topic vocabulary is AI-generated per-item, not a controlled taxonomy — two conceptually related items might use slightly different topic strings and never overlap] → Acceptable limitation of a zero-new-dependency approach; a controlled taxonomy or embeddings would fix this but is exactly the "Future" work being deferred.
- [No use of `contentType` as a secondary relatedness signal] → Kept intentionally simple (topics only) for this first cut; can be extended later without a breaking change to the endpoint shape.
