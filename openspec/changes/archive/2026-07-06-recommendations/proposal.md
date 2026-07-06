## Why

PRODUCT_SPECIFICATIONS.md lists "recommendation engine" under AI Features > Future, alongside "semantic search" and "contextual resurfacing" — all deferred, more advanced capabilities. FEATURES.md lists `recommendations` as an available-to-build optional feature. A recommendation engine proper (embeddings, collaborative filtering) is out of scope for a single-user, local-first app and duplicates the deferred "semantic search" effort. This change delivers the smallest genuinely useful slice: surfacing other saved content that shares topics with a given item, using data ai-enrichment already produces — nothing new to compute, no ML dependency.

## What Changes

- Add `GET /content/{id}/related` — returns other `ready` content items sharing at least one topic with the given item, ranked by number of shared topics (most overlap first), excluding the item itself and any item with no topics.
- If the source item has no topics (not yet AI-enriched, or `ai-enrichment` disabled), the endpoint returns an empty list — consistent with "AI is invisible infrastructure": related content is an optional enhancement layered on `topics`, never a hard requirement.
- No new AI calls, no embeddings, no new dependency — pure topic-overlap query over existing JSONB `topics` data.
- No mobile UI in this change — backend only, matching how every other deferred/optional feature (`projects`, `search`) shipped.

## Capabilities

### New Capabilities
- `recommendations`: related-content-by-shared-topics endpoint.

### Modified Capabilities
(none — no changes to `Content` entity, `ai-enrichment`, or any existing endpoint's behavior)

## Impact

- Affected code: `backend/src/content/presentation/router.py` (new route), `backend/src/content/infrastructure/repository.py` / `domain/repository.py` (new `find_related` method).
- No new backend module, no migration, no new dependency.
