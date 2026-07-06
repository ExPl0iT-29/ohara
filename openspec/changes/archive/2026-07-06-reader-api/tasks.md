## 1. Repository

- [x] 1.1 Add `list_content(limit, offset, status=None, content_type=None) -> list[Content]` to `ContentRepository` protocol
- [x] 1.2 Implement `list_content` in `SqlAlchemyContentRepository`, ordered by `saved_at DESC`, filters applied when given

## 2. Presentation

- [x] 2.1 Add `ContentResponse` Pydantic schema (all `Content` fields) in `content/presentation/schemas.py`
- [x] 2.2 Add `GET /content/{id}` route — 404 if not found
- [x] 2.3 Add `GET /content` route — query params `limit` (default 20, max 100), `offset` (default 0), `status`, `contentType`

## 3. Tests

- [x] 3.1 Test `GET /content/{id}` returns full item for existing id
- [x] 3.2 Test `GET /content/{id}` returns 404 for missing id
- [x] 3.3 Test `GET /content` default returns newest-saved-first, capped at 20
- [x] 3.4 Test `GET /content` pagination (`limit`/`offset`)
- [x] 3.5 Test `GET /content?status=` filter
- [x] 3.6 Test `GET /content?contentType=` filter
- [x] 3.7 Test `GET /content?status=invalid` returns 422
