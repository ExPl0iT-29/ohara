from __future__ import annotations

from datetime import datetime
from uuid import UUID

from pydantic import BaseModel


class CreateProjectRequest(BaseModel):
    name: str


class ProjectResponse(BaseModel):
    id: UUID
    name: str
    createdAt: datetime

    @classmethod
    def from_entity(cls, project) -> "ProjectResponse":
        return cls(id=project.id, name=project.name, createdAt=project.created_at)
