from __future__ import annotations

from typing import Protocol
from uuid import UUID

from .content import Content


class ContentRepository(Protocol):
    def save(self, content: Content) -> Content: ...

    def get_by_id(self, content_id: UUID) -> Content | None: ...

    def update_enrichment(self, content_id: UUID, **fields) -> Content: ...

    def get_pending_batch(self, limit: int) -> list[Content]: ...

    def get_ready_unenriched_batch(self, limit: int) -> list[Content]: ...
