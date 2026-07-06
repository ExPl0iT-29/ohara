"""add content search_vector

Revision ID: c2b8e4a1f6d3
Revises: b1a9f3c2d4e5
Create Date: 2026-07-06 18:20:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'c2b8e4a1f6d3'
down_revision: Union[str, Sequence[str], None] = 'b1a9f3c2d4e5'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.execute(
        """
        ALTER TABLE content ADD COLUMN search_vector tsvector
        GENERATED ALWAYS AS (
            setweight(to_tsvector('english', coalesce(title, '')), 'A') ||
            setweight(to_tsvector('english', coalesce(author, '')), 'B') ||
            setweight(to_tsvector('english', coalesce(summary, '')), 'B') ||
            setweight(to_tsvector('english', coalesce(translate(topics::text, '[]"', '   '), '')), 'B') ||
            setweight(to_tsvector('english', coalesce(url, '')), 'C') ||
            setweight(to_tsvector('english', coalesce(extracted_text, '')), 'D')
        ) STORED
        """
    )
    op.create_index("ix_content_search_vector", "content", ["search_vector"], postgresql_using="gin")


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_index("ix_content_search_vector", table_name="content")
    op.drop_column("content", "search_vector")
