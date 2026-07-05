from __future__ import annotations

from dataclasses import dataclass
from typing import Protocol


@dataclass
class EnrichmentResult:
    summary: str
    topics: list[str]


class AIProvider(Protocol):
    def enrich(self, text: str) -> EnrichmentResult: ...
