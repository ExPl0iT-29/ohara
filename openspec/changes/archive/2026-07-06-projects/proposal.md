## Why

Per ADR-002 and PRODUCT_SPECIFICATIONS.md, projects are an explicitly optional, deferred feature: "contextual overlays" that provide context during work without organizing or owning content. Nothing in the app depends on them, but the roadmap lists them as an available-to-build optional feature now that the core content/reading loop (capture → process → enrich → read) is complete.

## What Changes

- Add a `Project` entity: `id`, `name`, `createdAt`. Deliberately minimal — no description, no color, no icon, no nesting (ADR-002/PRODUCT_SPECIFICATIONS.md explicitly rule out "folder-heavy organization").
- Add a many-to-many association between `Content` and `Project` (a join table), since content can belong to zero, one, or many projects (ADR-002).
- `POST /projects` — create a project.
- `GET /projects` — list projects.
- `POST /projects/{projectId}/content/{contentId}` — associate an existing content item with a project.
- `DELETE /projects/{projectId}/content/{contentId}` — remove the association (never deletes content).
- `GET /projects/{projectId}/content` — list content associated with a project (reuses reader-api's list/pagination shape).
- `DELETE /projects/{projectId}` — delete a project; per ADR-002, this must never delete or modify the content it was associated with, only the association rows.
- No changes to the `Content` entity itself or its existing endpoints — content has no knowledge of projects (ADR-002: "content never belongs exclusively to projects").
- Backend only — no mobile UI in this change (matches the deferred/optional scope; UI can follow as its own change if wanted later).

## Capabilities

### New Capabilities
- `projects`: project entity, content-project association, and CRUD/list endpoints for both.

### Modified Capabilities
(none — `content-model` and `reader-api` are unchanged; projects reference content, content has zero knowledge of projects, per ADR-002)

## Impact

- New backend module: `backend/src/projects/` (domain entity, SQLAlchemy model + migration for `project` table and `content_project` join table, repository, use cases, FastAPI routes).
- New Alembic migration.
- No changes to `backend/src/content/`.
