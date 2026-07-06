"""create project tables

Revision ID: b1a9f3c2d4e5
Revises: 92743bcab4b1
Create Date: 2026-07-06 18:05:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


# revision identifiers, used by Alembic.
revision: str = 'b1a9f3c2d4e5'
down_revision: Union[str, Sequence[str], None] = '92743bcab4b1'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.create_table(
        "project",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("name", sa.String(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
    )
    op.create_table(
        "content_project",
        sa.Column("content_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("content.id"), primary_key=True),
        sa.Column(
            "project_id",
            postgresql.UUID(as_uuid=True),
            sa.ForeignKey("project.id", ondelete="CASCADE"),
            primary_key=True,
        ),
    )


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_table("content_project")
    op.drop_table("project")
