from __future__ import annotations

from datetime import datetime, timezone
from uuid import UUID

from sqlalchemy import func
from sqlalchemy.orm import Session

from ..domain.content import Content
from ..domain.enums import ContentStatus, ContentType
from .mapping import to_entity, to_model
from .models import ContentModel

# Fields update_enrichment is allowed to touch — capture fields never appear here.
_ENRICHMENT_FIELDS = {
    "title",
    "description",
    "summary",
    "hero_image",
    "author",
    "extracted_text",
    "reading_time",
    "duration",
    "metadata",
    "topics",
    "status",
    "completed_at",
}


class SqlAlchemyContentRepository:
    def __init__(self, session: Session):
        self._session = session

    def save(self, content: Content) -> Content:
        model = to_model(content)
        self._session.add(model)
        self._session.commit()
        self._session.refresh(model)
        return to_entity(model)

    def get_pending_batch(self, limit: int) -> list[Content]:
        models = (
            self._session.query(ContentModel)
            .filter(ContentModel.status == ContentStatus.PENDING)
            .order_by(ContentModel.saved_at)
            .limit(limit)
            .all()
        )
        return [to_entity(model) for model in models]

    def get_ready_unenriched_batch(self, limit: int) -> list[Content]:
        models = (
            self._session.query(ContentModel)
            .filter(
                ContentModel.status == ContentStatus.READY,
                ContentModel.summary.is_(None),
                ContentModel.extracted_text.isnot(None),
            )
            .order_by(ContentModel.saved_at)
            .limit(limit)
            .all()
        )
        return [to_entity(model) for model in models]

    def list_content(
        self,
        limit: int,
        offset: int,
        status: ContentStatus | None = None,
        content_type: ContentType | None = None,
    ) -> list[Content]:
        query = self._session.query(ContentModel)
        if status is not None:
            query = query.filter(ContentModel.status == status)
        if content_type is not None:
            query = query.filter(ContentModel.content_type == content_type)
        models = (
            query.order_by(ContentModel.saved_at.desc())
            .offset(offset)
            .limit(limit)
            .all()
        )
        return [to_entity(model) for model in models]

    def search(self, query: str, limit: int) -> list[Content]:
        if not query or not query.strip():
            return []

        tsquery = func.plainto_tsquery("english", query)
        rank = func.ts_rank(ContentModel.search_vector, tsquery)
        models = (
            self._session.query(ContentModel)
            .filter(ContentModel.search_vector.op("@@")(tsquery))
            .order_by(rank.desc())
            .limit(limit)
            .all()
        )
        return [to_entity(model) for model in models]

    def get_by_id(self, content_id: UUID) -> Content | None:
        model = self._session.get(ContentModel, content_id)
        return to_entity(model) if model else None

    def update_enrichment(self, content_id: UUID, **fields) -> Content:
        unknown = set(fields) - _ENRICHMENT_FIELDS
        if unknown:
            raise ValueError(f"Cannot update non-enrichment fields: {unknown}")

        model = self._session.get(ContentModel, content_id)
        if model is None:
            raise ValueError(f"Content {content_id} not found")

        for key, value in fields.items():
            column = "metadata_" if key == "metadata" else key
            setattr(model, column, value)
        model.updated_at = datetime.now(timezone.utc)

        self._session.commit()
        self._session.refresh(model)
        return to_entity(model)
