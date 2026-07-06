## Context

Existing `backend/src/content/` follows Clean Architecture/DDD layering: `domain/` (entities, Protocols, no framework imports), `infrastructure/` (SQLAlchemy models + repository implementing the domain Protocol), `application/` (use cases), `presentation/` (FastAPI routes + Pydantic schemas). One Alembic migration exists (`92743bcab4b1_create_content_table.py`). This change follows the exact same shape for a new `backend/src/projects/` module.

## Goals / Non-Goals

**Goals:**
- A `Project` entity and a `Content`-`Project` many-to-many association, exactly matching ADR-002/PRODUCT_SPECIFICATIONS.md: projects never own content, content has zero knowledge of projects, deleting a project never touches content.
- CRUD + association endpoints, following capture-endpoint/reader-api's existing route conventions (plain REST, no auth).

**Non-Goals:**
- No mobile UI (deferred/optional backend feature per FEATURES.md; UI is a separate future change if wanted).
- No project metadata beyond `name` — no description, color, icon, nesting/hierarchy (explicitly ruled out by PRODUCT_SPECIFICATIONS.md's "folder-heavy organization" non-goal).
- No content-side association field/endpoint — the association is only reachable via `/projects/{id}/content/...` routes, never via `/content/...` routes, to keep ADR-002's "content never belongs exclusively to projects... content has zero knowledge of projects" true at the API level too.

## Decisions

- **New top-level module `backend/src/projects/`**, mirroring `content/`'s exact directory shape (`domain/`, `infrastructure/`, `application/`, `presentation/`). Rationale: consistency with the established pattern; a project is its own aggregate root, not a sub-concern of content.
- **Association as a join table (`content_project`)**, not a foreign key on either side. Rationale: many-to-many per ADR-002 ("zero, one, or many projects"); a plain association table with `(content_id, project_id)` composite key and no additional columns is the simplest correct model — no ORM-level relationship needed on the `Content` SQLAlchemy model itself (content's own module stays untouched).
- **Repository pattern**: `ProjectRepository` Protocol in `domain/repository.py` (`save`, `get_by_id`, `list_all`, `delete`, `add_content`, `remove_content`, `list_content_ids`), `SqlAlchemyProjectRepository` implementation — same shape as `ContentRepository`.
- **Association routes live under `/projects`, not `/content`**: `POST/DELETE /projects/{projectId}/content/{contentId}` and `GET /projects/{projectId}/content`. Rationale: keeps `backend/src/content/` completely untouched (matches the proposal's explicit "no changes to `Content` entity or its existing endpoints") and keeps the "projects reference content" direction (ADR-001) literal in the API shape.
- **`GET /projects/{projectId}/content` reuses reader-api's `ContentResponse` shape** (import/reuse the existing schema rather than duplicating it), returning full content items for the ids associated with that project. Pagination deferred — early usage won't need it, and reader-api's own list endpoint already supports pagination for the full library.
- **Deleting a project deletes only join-table rows** (`ON DELETE CASCADE` from `project` to `content_project`, no cascade in the other direction — there's no FK from `content` to `content_project` requiring one). Content rows are never touched by a project delete.

## Risks / Trade-offs

- [No content-side visibility of its own projects via `/content/{id}`] → Acceptable per Non-Goals; a future `home-feed-ui`-style change can add a "which projects is this in" read if wanted, without changing this change's scope.
- [No UI for this change] → Explicitly deferred/optional scope; backend-only is consistent with how `reader-api` shipped before `reader-view`/`capture-ui`/`home-feed-ui` existed.
