from __future__ import annotations

from dataclasses import dataclass
from typing import Protocol


@dataclass
class ExtractionResult:
    title: str | None = None
    description: str | None = None
    hero_image: str | None = None
    author: str | None = None
    extracted_text: str | None = None
    duration: int | None = None


class ContentExtractor(Protocol):
    def extract(self, url: str) -> ExtractionResult: ...


class UnsupportedContentTypeError(Exception):
    pass
