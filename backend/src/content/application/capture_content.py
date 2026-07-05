from __future__ import annotations

from datetime import datetime, timezone
from uuid import uuid4

from ..domain.content import Content
from ..domain.enums import ContentType
from ..domain.repository import ContentRepository


class CaptureContentUseCase:
    def __init__(self, repository: ContentRepository):
        self._repository = repository

    def execute(self, url: str, content_type: ContentType | None = None) -> Content:
        content = Content(
            id=uuid4(),
            url=url,
            source="api",
            saved_at=datetime.now(timezone.utc),
            content_type=content_type or ContentType.OTHER,
        )
        return self._repository.save(content)
