from __future__ import annotations

from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, HttpUrl

from ..domain.enums import ContentStatus, ContentType


class CaptureContentRequest(BaseModel):
    url: HttpUrl
    contentType: ContentType | None = None


class ContentResponse(BaseModel):
    id: UUID
    url: str
    source: str
    savedAt: datetime
    contentType: ContentType
    title: str | None = None
    description: str | None = None
    summary: str | None = None
    heroImage: str | None = None
    author: str | None = None
    extractedText: str | None = None
    readingTime: int | None = None
    duration: int | None = None
    metadata: dict
    topics: list[str]
    status: ContentStatus
    updatedAt: datetime | None = None
    completedAt: datetime | None = None

    @classmethod
    def from_entity(cls, content) -> "ContentResponse":
        return cls(
            id=content.id,
            url=content.url,
            source=content.source,
            savedAt=content.saved_at,
            contentType=content.content_type,
            title=content.title,
            description=content.description,
            summary=content.summary,
            heroImage=content.hero_image,
            author=content.author,
            extractedText=content.extracted_text,
            readingTime=content.reading_time,
            duration=content.duration,
            metadata=content.metadata,
            topics=content.topics,
            status=content.status,
            updatedAt=content.updated_at,
            completedAt=content.completed_at,
        )


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
