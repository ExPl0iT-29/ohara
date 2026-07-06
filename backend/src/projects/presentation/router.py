from __future__ import annotations

import uuid
from datetime import datetime, timezone
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from content.infrastructure.repository import SqlAlchemyContentRepository
from content.presentation.schemas import ContentResponse
from content.presentation.dependencies import get_session

from ..domain.project import Project
from ..infrastructure.repository import SqlAlchemyProjectRepository
from .schemas import CreateProjectRequest, ProjectResponse

router = APIRouter()


@router.post("/projects", response_model=ProjectResponse, status_code=201)
def create_project(
    request: CreateProjectRequest, session: Session = Depends(get_session)
) -> ProjectResponse:
    repository = SqlAlchemyProjectRepository(session)
    project = Project(id=uuid.uuid4(), name=request.name, created_at=datetime.now(timezone.utc))
    saved = repository.save(project)
    return ProjectResponse.from_entity(saved)


@router.get("/projects", response_model=list[ProjectResponse])
def list_projects(session: Session = Depends(get_session)) -> list[ProjectResponse]:
    repository = SqlAlchemyProjectRepository(session)
    return [ProjectResponse.from_entity(project) for project in repository.list_all()]


@router.delete("/projects/{project_id}", status_code=204)
def delete_project(project_id: UUID, session: Session = Depends(get_session)) -> None:
    repository = SqlAlchemyProjectRepository(session)
    repository.delete(project_id)


@router.post("/projects/{project_id}/content/{content_id}", status_code=204)
def associate_content(
    project_id: UUID, content_id: UUID, session: Session = Depends(get_session)
) -> None:
    project_repository = SqlAlchemyProjectRepository(session)
    if project_repository.get_by_id(project_id) is None:
        raise HTTPException(status_code=404, detail="Project not found")

    content_repository = SqlAlchemyContentRepository(session)
    if content_repository.get_by_id(content_id) is None:
        raise HTTPException(status_code=404, detail="Content not found")

    project_repository.add_content(project_id, content_id)


@router.delete("/projects/{project_id}/content/{content_id}", status_code=204)
def remove_content(
    project_id: UUID, content_id: UUID, session: Session = Depends(get_session)
) -> None:
    repository = SqlAlchemyProjectRepository(session)
    repository.remove_content(project_id, content_id)


@router.get("/projects/{project_id}/content", response_model=list[ContentResponse])
def list_project_content(
    project_id: UUID, session: Session = Depends(get_session)
) -> list[ContentResponse]:
    project_repository = SqlAlchemyProjectRepository(session)
    if project_repository.get_by_id(project_id) is None:
        raise HTTPException(status_code=404, detail="Project not found")

    content_repository = SqlAlchemyContentRepository(session)
    content_ids = project_repository.list_content_ids(project_id)
    items = [content_repository.get_by_id(cid) for cid in content_ids]
    return [ContentResponse.from_entity(item) for item in items if item is not None]
