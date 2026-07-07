from __future__ import annotations

import os
from collections.abc import Iterator

from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker

_engine = create_engine(os.environ["DATABASE_URL"], pool_pre_ping=True, pool_recycle=300)
_SessionLocal = sessionmaker(bind=_engine)


def get_session() -> Iterator[Session]:
    session = _SessionLocal()
    try:
        yield session
    finally:
        session.close()
