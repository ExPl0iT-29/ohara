from __future__ import annotations

from ..domain.content import Content
from .models import ContentModel


def to_entity(model: ContentModel) -> Content:
    return Content(
        id=model.id,
        url=model.url,
        source=model.source,
        saved_at=model.saved_at,
        content_type=model.content_type,
        title=model.title,
        description=model.description,
        summary=model.summary,
        hero_image=model.hero_image,
        author=model.author,
        extracted_text=model.extracted_text,
        reading_time=model.reading_time,
        duration=model.duration,
        metadata=model.metadata_,
        topics=model.topics,
        status=model.status,
        updated_at=model.updated_at,
        completed_at=model.completed_at,
    )


def to_model(entity: Content) -> ContentModel:
    return ContentModel(
        id=entity.id,
        url=entity.url,
        source=entity.source,
        saved_at=entity.saved_at,
        content_type=entity.content_type,
        title=entity.title,
        description=entity.description,
        summary=entity.summary,
        hero_image=entity.hero_image,
        author=entity.author,
        extracted_text=entity.extracted_text,
        reading_time=entity.reading_time,
        duration=entity.duration,
        metadata_=entity.metadata,
        topics=entity.topics,
        status=entity.status,
        updated_at=entity.updated_at,
        completed_at=entity.completed_at,
    )
