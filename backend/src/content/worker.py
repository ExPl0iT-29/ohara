from __future__ import annotations

import asyncio
import logging
import os
import time

from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker

from content.domain.enums import ContentStatus
from content.domain.extraction import UnsupportedContentTypeError
from content.domain.reading_time import compute_reading_time
from content.infrastructure.ai_providers.selector import get_active_provider
from content.infrastructure.extractors.registry import get_extractor
from content.infrastructure.repository import SqlAlchemyContentRepository

log = logging.getLogger(__name__)

POLL_INTERVAL_SECONDS = 5
BATCH_SIZE = 10


def process_batch(repository: SqlAlchemyContentRepository) -> int:
    pending = repository.get_pending_batch(BATCH_SIZE)
    for content in pending:
        repository.update_enrichment(content.id, status=ContentStatus.PROCESSING)
        try:
            extractor = get_extractor(content.content_type)
            result = extractor.extract(content.url)

            fields = {
                "title": result.title,
                "description": result.description,
                "hero_image": result.hero_image,
                "author": result.author,
                "extracted_text": result.extracted_text,
                "duration": result.duration,
                "status": ContentStatus.READY,
            }
            if result.extracted_text:
                fields["reading_time"] = compute_reading_time(result.extracted_text)

            repository.update_enrichment(content.id, **fields)
        except UnsupportedContentTypeError as exc:
            repository.update_enrichment(
                content.id,
                status=ContentStatus.FAILED,
                metadata={"processingError": str(exc)},
            )
        except Exception as exc:  # noqa: BLE001 - one bad row must not stop the worker
            log.exception("Extraction failed for content %s", content.id)
            repository.update_enrichment(
                content.id,
                status=ContentStatus.FAILED,
                metadata={"processingError": f"{type(exc).__name__}: {exc}"},
            )
    return len(pending)


def enrich_ready_content(repository: SqlAlchemyContentRepository) -> int:
    provider = get_active_provider()
    if provider is None:
        return 0

    unenriched = repository.get_ready_unenriched_batch(BATCH_SIZE)
    for content in unenriched:
        try:
            result = provider.enrich(content.extracted_text)
            repository.update_enrichment(
                content.id, summary=result.summary, topics=result.topics
            )
        except Exception:
            log.exception("Enrichment failed for content %s", content.id)
    return len(unenriched)


def run_iteration(session_factory) -> int:
    session: Session = session_factory()
    try:
        repository = SqlAlchemyContentRepository(session)
        processed = process_batch(repository)
        enrich_ready_content(repository)
        return processed
    finally:
        session.close()


def run() -> None:
    engine = create_engine(os.environ["DATABASE_URL"], pool_pre_ping=True, pool_recycle=300)
    session_factory = sessionmaker(bind=engine)

    while True:
        processed = run_iteration(session_factory)
        if processed == 0:
            time.sleep(POLL_INTERVAL_SECONDS)


async def run_forever_async() -> None:
    """Runs the same polling loop as `run()`, but as a background asyncio task
    inside the web process instead of a separate process — avoids needing a
    paid Render worker service for a single-user app."""
    engine = create_engine(os.environ["DATABASE_URL"], pool_pre_ping=True, pool_recycle=300)
    session_factory = sessionmaker(bind=engine)

    while True:
        try:
            processed = await asyncio.to_thread(run_iteration, session_factory)
        except Exception:
            log.exception("Worker iteration failed")
            processed = 0
        if processed == 0:
            await asyncio.sleep(POLL_INTERVAL_SECONDS)


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    run()
