from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime
from uuid import UUID


@dataclass
class Project:
    id: UUID
    name: str
    created_at: datetime
