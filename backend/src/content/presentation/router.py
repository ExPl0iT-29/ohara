from __future__ import annotations

from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from ..application.capture_content import CaptureContentUseCase
from ..domain.enums import ContentStatus, ContentType
from ..infrastructure.repository import SqlAlchemyContentRepository
from .schemas import CaptureContentRequest, CaptureContentResponse, ContentResponse
from .dependencies import get_session

router = APIRouter()


@router.post("/content", response_model=CaptureContentResponse, status_code=201)
def capture_content(
    request: CaptureContentRequest, session: Session = Depends(get_session)
) -> CaptureContentResponse:
    repository = SqlAlchemyContentRepository(session)
    use_case = CaptureContentUseCase(repository)
    content = use_case.execute(url=str(request.url), content_type=request.contentType)
    return CaptureContentResponse.from_entity(content)


@router.get("/content/{content_id}", response_model=ContentResponse)
def get_content(content_id: UUID, session: Session = Depends(get_session)) -> ContentResponse:
    repository = SqlAlchemyContentRepository(session)
    content = repository.get_by_id(content_id)
    if content is None:
        raise HTTPException(status_code=404, detail="Content not found")
    return ContentResponse.from_entity(content)


@router.get("/content", response_model=list[ContentResponse])
def list_content(
    limit: int = Query(default=20, le=100, gt=0),
    offset: int = Query(default=0, ge=0),
    status: ContentStatus | None = None,
    contentType: ContentType | None = None,
    session: Session = Depends(get_session),
) -> list[ContentResponse]:
    repository = SqlAlchemyContentRepository(session)
    items = repository.list_content(limit, offset, status=status, content_type=contentType)
    return [ContentResponse.from_entity(item) for item in items]
