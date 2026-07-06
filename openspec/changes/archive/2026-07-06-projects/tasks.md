## 1. Domain

- [x] 1.1 Add `backend/src/projects/domain/project.py` — `Project` dataclass (`id`, `name`, `created_at`)
- [x] 1.2 Add `backend/src/projects/domain/repository.py` — `ProjectRepository` Protocol (`save`, `get_by_id`, `list_all`, `delete`, `add_content`, `remove_content`, `list_content_ids`)

## 2. Infrastructure

- [x] 2.1 Add `backend/src/projects/infrastructure/models.py` — `ProjectModel` SQLAlchemy model + `content_project` association table
- [x] 2.2 Add Alembic migration creating `project` and `content_project` tables (composite PK on `content_project`, `ON DELETE CASCADE` from `project`)
- [x] 2.3 Add `backend/src/projects/infrastructure/mapping.py` — entity/model conversion
- [x] 2.4 Add `backend/src/projects/infrastructure/repository.py` — `SqlAlchemyProjectRepository` implementing the Protocol

## 3. Presentation

- [x] 3.1 Add `backend/src/projects/presentation/schemas.py` — `CreateProjectRequest`, `ProjectResponse`
- [x] 3.2 Add `backend/src/projects/presentation/router.py`:
  - `POST /projects`
  - `GET /projects`
  - `DELETE /projects/{projectId}`
  - `POST /projects/{projectId}/content/{contentId}`
  - `DELETE /projects/{projectId}/content/{contentId}`
  - `GET /projects/{projectId}/content` (reusing reader-api's `ContentResponse`)
- [x] 3.3 Register the projects router in `backend/src/main.py`

## 4. Tests

- [x] 4.1 Test `POST /projects` creates a project
- [x] 4.2 Test `GET /projects` lists projects
- [x] 4.3 Test `DELETE /projects/{id}` removes the project but leaves associated content untouched
- [x] 4.4 Test `POST /projects/{id}/content/{contentId}` associates content, content appears in `GET /projects/{id}/content`
- [x] 4.5 Test content can be associated with multiple projects simultaneously
- [x] 4.6 Test `DELETE /projects/{id}/content/{contentId}` removes the association without deleting content
- [x] 4.7 Run full backend suite, confirm no regressions in existing content/reader-api/ai-enrichment/processing-pipeline tests
