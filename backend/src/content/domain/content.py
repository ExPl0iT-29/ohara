from __future__ import annotations

from dataclasses import dataclass, field
from datetime import datetime
from uuid import UUID

from .enums import ContentStatus, ContentType


@dataclass
class Content:
    # Immutable at capture — never rewritten after creation.
    id: UUID
    url: str
    source: str
    saved_at: datetime

    content_type: ContentType

    # Replaceable — nullable at creation, filled/updated by later processing.
    title: str | None = None
    description: str | None = None
    summary: str | None = None
    hero_image: str | None = None
    author: str | None = None
    extracted_text: str | None = None
    reading_time: int | None = None
    duration: int | None = None
    metadata: dict = field(default_factory=dict)
    topics: list[str] = field(default_factory=list)
    status: ContentStatus = ContentStatus.PENDING
    updated_at: datetime | None = None
    completed_at: datetime | None = None

    def __post_init__(self) -> None:
        if not isinstance(self.content_type, ContentType):
            try:
                self.content_type = ContentType(self.content_type)
            except ValueError as exc:
                raise ValueError(f"Invalid content_type: {self.content_type!r}") from exc
        if not isinstance(self.status, ContentStatus):
            try:
                self.status = ContentStatus(self.status)
            except ValueError as exc:
                raise ValueError(f"Invalid status: {self.status!r}") from exc
