from __future__ import annotations

import uuid
from datetime import datetime

from sqlalchemy import Column, DateTime, ForeignKey, String, Table
from sqlalchemy.dialects.postgresql import UUID as PGUUID
from sqlalchemy.orm import Mapped, mapped_column

from content.infrastructure.models import Base

content_project = Table(
    "content_project",
    Base.metadata,
    Column("content_id", PGUUID(as_uuid=True), ForeignKey("content.id"), primary_key=True),
    Column(
        "project_id",
        PGUUID(as_uuid=True),
        ForeignKey("project.id", ondelete="CASCADE"),
        primary_key=True,
    ),
)


class ProjectModel(Base):
    __tablename__ = "project"

    id: Mapped[uuid.UUID] = mapped_column(PGUUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name: Mapped[str] = mapped_column(String, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
