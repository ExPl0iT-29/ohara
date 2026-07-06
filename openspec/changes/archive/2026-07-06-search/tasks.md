## 1. Schema

- [x] 1.1 Add Alembic migration: `search_vector` generated `tsvector` column on `content` (from title, extracted_text, summary, author, url, topics) + GIN index

## 2. Repository

- [x] 2.1 Add `search(query: str, limit: int) -> list[Content]` to `ContentRepository` Protocol
- [x] 2.2 Implement `search` in `SqlAlchemyContentRepository` using `plainto_tsquery`/`ts_rank`, returning `[]` for blank query

## 3. Presentation

- [x] 3.1 Add `GET /content/search` route to `content/presentation/router.py` — `q` (required), `limit` (default 20, max 100), reusing `ContentResponse`

## 4. Tests

- [x] 4.1 Test search matches on title
- [x] 4.2 Test search matches on extracted text
- [x] 4.3 Test search matches on topics
- [x] 4.4 Test no matches returns empty list
- [x] 4.5 Test blank query returns empty list
- [x] 4.6 Test relevance ranking (multiple matches ordered most-relevant first)
- [x] 4.7 Run full backend suite, confirm no regressions
