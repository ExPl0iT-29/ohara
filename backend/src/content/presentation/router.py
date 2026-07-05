from __future__ import annotations

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from ..application.capture_content import CaptureContentUseCase
from ..infrastructure.repository import SqlAlchemyContentRepository
from .schemas import CaptureContentRequest, CaptureContentResponse
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
