## 1. Backend Scaffolding

- [x] 1.1 Create `backend/` module skeleton (`src/content/domain/`, `src/content/infrastructure/`) per DEVELOPMENT_PRINCIPLES.md domain-driven layout
- [x] 1.2 Set up `uv` project with FastAPI, SQLAlchemy, Alembic, Pydantic dependencies per STACK.md

## 2. Domain Layer

- [x] 2.1 Define `ContentType` enum (blog, website, documentation, pdf, paper, youtube, github, book, tweet, reddit, other)
- [x] 2.2 Define `ContentStatus` enum (pending, processing, ready, failed)
- [x] 2.3 Define `Content` dataclass entity with all fields from spec, no ORM/framework imports
- [x] 2.4 Define `ContentRepository` protocol/interface (save, get_by_id, update_enrichment) in domain layer

## 3. Infrastructure Layer

- [x] 3.1 Create SQLAlchemy `ContentModel` mapping to `content` table, with DB enums for contentType/status
- [x] 3.2 Implement `SqlAlchemyContentRepository` implementing the domain repository interface
- [x] 3.3 Add mapping functions between `Content` entity and `ContentModel` ORM row

## 4. Migration

- [x] 4.1 Generate Alembic migration creating `content` table (columns, enums, indexes on id and url)
- [x] 4.2 Verify migration applies cleanly (upgrade) and reverses cleanly (downgrade) against Neon Postgres

## 5. Verification

- [x] 5.1 Write unit test: constructing `Content` with invalid contentType raises validation error
- [x] 5.2 Write unit test: entity round-trips through repository save/get_by_id with identical field values
- [x] 5.3 Write unit test: `update_enrichment()` changes enrichment fields but leaves id/url/source/savedAt untouched
