"""create content table

Revision ID: 92743bcab4b1
Revises: 
Create Date: 2026-07-05 16:08:07.418575

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


# revision identifiers, used by Alembic.
revision: str = '92743bcab4b1'
down_revision: Union[str, Sequence[str], None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

content_type_enum = postgresql.ENUM(
    "blog", "website", "documentation", "pdf", "paper", "youtube",
    "github", "book", "tweet", "reddit", "other",
    name="content_type",
    create_type=False,
)
content_status_enum = postgresql.ENUM(
    "pending", "processing", "ready", "failed",
    name="content_status",
    create_type=False,
)


def upgrade() -> None:
    """Upgrade schema."""
    content_type_enum.create(op.get_bind(), checkfirst=True)
    content_status_enum.create(op.get_bind(), checkfirst=True)

    op.create_table(
        "content",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("url", sa.String(), nullable=False),
        sa.Column("source", sa.String(), nullable=False),
        sa.Column("saved_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("content_type", content_type_enum, nullable=False),
        sa.Column("title", sa.String(), nullable=True),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("summary", sa.Text(), nullable=True),
        sa.Column("hero_image", sa.String(), nullable=True),
        sa.Column("author", sa.String(), nullable=True),
        sa.Column("extracted_text", sa.Text(), nullable=True),
        sa.Column("reading_time", sa.Integer(), nullable=True),
        sa.Column("duration", sa.Integer(), nullable=True),
        sa.Column("metadata", postgresql.JSONB(), nullable=False),
        sa.Column("topics", postgresql.JSONB(), nullable=False),
        sa.Column("status", content_status_enum, nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("completed_at", sa.DateTime(timezone=True), nullable=True),
    )
    op.create_index("ix_content_url", "content", ["url"])


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_index("ix_content_url", table_name="content")
    op.drop_table("content")
    content_status_enum.drop(op.get_bind(), checkfirst=True)
    content_type_enum.drop(op.get_bind(), checkfirst=True)
