from __future__ import annotations

from uuid import UUID

from sqlalchemy import delete, insert, select
from sqlalchemy.orm import Session

from ..domain.project import Project
from .mapping import to_entity, to_model
from .models import ProjectModel, content_project


class SqlAlchemyProjectRepository:
    def __init__(self, session: Session):
        self._session = session

    def save(self, project: Project) -> Project:
        model = to_model(project)
        self._session.add(model)
        self._session.commit()
        self._session.refresh(model)
        return to_entity(model)

    def get_by_id(self, project_id: UUID) -> Project | None:
        model = self._session.get(ProjectModel, project_id)
        return to_entity(model) if model else None

    def list_all(self) -> list[Project]:
        models = self._session.query(ProjectModel).order_by(ProjectModel.created_at).all()
        return [to_entity(model) for model in models]

    def delete(self, project_id: UUID) -> None:
        model = self._session.get(ProjectModel, project_id)
        if model is None:
            return
        self._session.delete(model)
        self._session.commit()

    def add_content(self, project_id: UUID, content_id: UUID) -> None:
        exists = self._session.execute(
            select(content_project).where(
                content_project.c.project_id == project_id,
                content_project.c.content_id == content_id,
            )
        ).first()
        if exists:
            return
        self._session.execute(
            insert(content_project).values(project_id=project_id, content_id=content_id)
        )
        self._session.commit()

    def remove_content(self, project_id: UUID, content_id: UUID) -> None:
        self._session.execute(
            delete(content_project).where(
                content_project.c.project_id == project_id,
                content_project.c.content_id == content_id,
            )
        )
        self._session.commit()

    def list_content_ids(self, project_id: UUID) -> list[UUID]:
        rows = self._session.execute(
            select(content_project.c.content_id).where(content_project.c.project_id == project_id)
        ).all()
        return [row[0] for row in rows]
