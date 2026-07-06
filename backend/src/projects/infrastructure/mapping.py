from __future__ import annotations

from ..domain.project import Project
from .models import ProjectModel


def to_entity(model: ProjectModel) -> Project:
    return Project(id=model.id, name=model.name, created_at=model.created_at)


def to_model(entity: Project) -> ProjectModel:
    return ProjectModel(id=entity.id, name=entity.name, created_at=entity.created_at)
