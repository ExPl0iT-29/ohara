## Context

Ohara has no code yet. This change lays the domain model every future capability (capture, processing, reader, search, projects) builds on. Per DEVELOPMENT_PRINCIPLES.md, dependencies point inward: domain depends on nothing, infrastructure depends on domain. Per TECHNICAL_ARCHITECTURE.md, all sources normalize into one unified Content model.

## Goals / Non-Goals

**Goals:**
- Define `Content` as a framework-free domain entity.
- Define which fields are set once at capture (immutable) vs. produced by AI/processing later (replaceable).
- Persist it via SQLAlchemy + Alembic migration.
- Keep the schema stable enough that later changes (capture, processing) only ever *add* nullable columns or *replace* enrichment fields — never restructure core identity fields.

**Non-Goals:**
- No API routes (that's the `capture-endpoint` change).
- No extraction/AI calls (that's `processing-pipeline` / `ai-enrichment`).
- No project relationship (per ADR-002, deferred to a `projects` capability; content has no FK to project).
- No search indexing (deferred to `search` capability).

## Decisions

**Domain entity as plain Python dataclass, ORM model separate.**
Keeps domain layer free of SQLAlchemy per DEVELOPMENT_PRINCIPLES.md ("business rules should never depend on frameworks"). `backend/src/content/domain/content.py` holds the entity + enums; `backend/src/content/infrastructure/models.py` holds the SQLAlchemy `ContentModel`. A repository interface (`ContentRepository` protocol) in domain, implemented in infrastructure. Alternative considered: single SQLAlchemy model used everywhere — rejected, couples business rules to ORM, violates layering.

**Status enum tracks processing lifecycle without blocking capture.**
`pending -> processing -> ready | failed`. Matches ADR-008 (processing asynchronous, capture returns immediately). Content row exists in `pending` state before any extraction happens.

**Immutable vs. replaceable fields, enforced by convention not DB constraint.**
Immutable at capture: `id`, `url`, `source`, `savedAt`. Replaceable (nullable, AI/processing-derived): `title`, `description`, `summary`, `heroImage`, `author`, `extractedText`, `readingTime`, `duration`, `metadata`, `topics`, `status`, `completedAt`, `updatedAt`. No DB-level immutability enforcement in this change — repository layer (future change) will only expose an `update_enrichment()` method, never allowing capture fields to be rewritten. Documented here so future code respects it without needing DB triggers.

**`metadata` and `topics` as JSONB.**
Content-type-specific metadata varies (GitHub repo has stars, YouTube has channel, PDF has page count). Per ADR-003, "source-specific metadata remains optional" — JSONB avoids a wide sparse table or premature per-type subtables. `topics` as JSONB array of strings for now; revisit only if topic-based querying needs relational structure.

**contentType as a Python/DB enum, not free text.**
Fixed list from PRODUCT_SPECIFICATIONS.md (blog, website, documentation, pdf, paper, youtube, github, book, tweet, reddit) plus `other` fallback. Enum keeps the type space closed and typed at both layers.

## Risks / Trade-offs

- [Risk] JSONB metadata could become a dumping ground for logic that belongs in typed fields. → Mitigation: only content-type-specific display metadata goes here; anything queried/filtered on gets promoted to a real column in a later migration.
- [Risk] No DB constraint stops core fields being overwritten. → Mitigation: enforced at repository API surface in the next change; acceptable for now since no write path exists yet.
- [Risk] Enum for contentType requires a migration to add new types later. → Mitigation: acceptable per ADR-012 (migrations are first-class, not something to avoid); closed set matches product spec's explicit content type list.

## Migration Plan

Single Alembic migration: create `content` table with columns per entity, plus a DB-level enum type for `content_type` and `status`. No existing data. No rollback complexity — `downgrade()` drops the table.

## Open Questions

None — scope is intentionally narrow (model + persistence only).
