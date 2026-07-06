## 1. Repository

- [x] 1.1 Add `find_related(content_id: UUID, limit: int) -> list[Content]` to `ContentRepository` Protocol
- [x] 1.2 Implement `find_related` in `SqlAlchemyContentRepository` — JSONB topic-overlap count, `ready` status only, excludes the source item, ordered by overlap count descending

## 2. Presentation

- [x] 2.1 Add `GET /content/{content_id}/related` route — `limit` (default 5, max 20), 404 if source content doesn't exist, empty list if no topics/no overlap

## 3. Tests

- [x] 3.1 Test related items sharing at least one topic are returned
- [x] 3.2 Test items with more shared topics rank first
- [x] 3.3 Test source item never appears in its own results
- [x] 3.4 Test source item with no topics returns empty list
- [x] 3.5 Test nonexistent content id returns 404
- [x] 3.6 Run full backend suite, confirm no regressions
