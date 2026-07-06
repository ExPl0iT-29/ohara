from __future__ import annotations

from typing import Protocol
from uuid import UUID

from .content import Content
from .enums import ContentStatus, ContentType


class ContentRepository(Protocol):
    def save(self, content: Content) -> Content: ...

    def get_by_id(self, content_id: UUID) -> Content | None: ...

    def update_enrichment(self, content_id: UUID, **fields) -> Content: ...

    def get_pending_batch(self, limit: int) -> list[Content]: ...

    def get_ready_unenriched_batch(self, limit: int) -> list[Content]: ...

    def list_content(
        self,
        limit: int,
        offset: int,
        status: ContentStatus | None = None,
        content_type: ContentType | None = None,
    ) -> list[Content]: ...

    def search(self, query: str, limit: int) -> list[Content]: ...

    def find_related(self, content_id: UUID, limit: int) -> list[Content]: ...
