"""Initial FastAPI backend schema."""

from alembic import op

revision = "20260726_01"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    # The authoritative schema is kept in SQLAlchemy models; this creates it
    # without coupling the migration to a specific PostgreSQL extension.
    bind = op.get_bind()
    from app import models  # noqa: F401
    from app.db import Base

    Base.metadata.create_all(bind=bind)


def downgrade() -> None:
    bind = op.get_bind()
    from app import models  # noqa: F401
    from app.db import Base

    Base.metadata.drop_all(bind=bind)
