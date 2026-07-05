## Why

Ohara has no domain model yet. Every other feature (capture, processing, reader, search, projects) depends on a single, stable representation of saved content. ADR-001 and ADR-003 require content to be the primary entity and every source (blog, PDF, YouTube, GitHub, book, tweet, Reddit post) to normalize into one unified model. This must exist before any endpoint, worker, or UI can be built.

## What Changes

- Introduce a `Content` domain entity (Clean Architecture domain layer, no framework dependencies) representing any saved item regardless of source.
- Add a `ContentType` enum (blog, website, documentation, pdf, paper, youtube, github, book, tweet, reddit, other).
- Add a `ContentStatus` enum (pending, processing, ready, failed) to track processing lifecycle without blocking on it.
- Add SQLAlchemy ORM model + Alembic migration creating the `content` table.
- Core fields are immutable once set by capture (id, url, source, savedAt); AI-derived fields (summary, topics, readingTime) are nullable and replaceable.
- No relationship from `content` to `project` — per ADR-002, projects reference content, content never references projects.
- No API endpoints, no processing pipeline, no AI calls in this change — model and persistence only.

## Capabilities

### New Capabilities
- `content-model`: unified Content domain entity, its persistence schema, and the invariants governing which fields are immutable vs. replaceable.

### Modified Capabilities
(none — first capability in the system)

## Impact

- New backend module: `backend/src/content/domain/` (entity, enums, value objects).
- New backend module: `backend/src/content/infrastructure/` (SQLAlchemy model, repository interface + implementation).
- New Alembic migration under `backend/migrations/`.
- No existing code affected (greenfield).
- Establishes the schema every later change (capture, processing, reader, search, projects) will build on — changing it later means a migration, not a rewrite.
