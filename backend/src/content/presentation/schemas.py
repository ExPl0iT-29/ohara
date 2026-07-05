from __future__ import annotations

from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, HttpUrl

from ..domain.enums import ContentStatus, ContentType


class CaptureContentRequest(BaseModel):
    url: HttpUrl
    contentType: ContentType | None = None


class CaptureContentResponse(BaseModel):
    id: UUID
    url: str
    contentType: ContentType
    status: ContentStatus
    savedAt: datetime

    @classmethod
    def from_entity(cls, content) -> "CaptureContentResponse":
        return cls(
            id=content.id,
            url=content.url,
            contentType=content.content_type,
            status=content.status,
            savedAt=content.saved_at,
        )
