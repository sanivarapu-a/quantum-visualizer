"""
Database engine + session handling.

Schema is managed by Alembic migrations (see backend/alembic/), not by
create_all(). init_db() is kept only as a convenience for quick local
scratch/testing — it is not called on app startup.
"""

import os
from sqlmodel import SQLModel, Session, create_engine

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./quantum_visualizer.db")

connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}
engine = create_engine(DATABASE_URL, connect_args=connect_args)


def init_db() -> None:
    """Create tables directly from models, bypassing Alembic. Only for
    quick local experiments — never call this against a database that
    Alembic is managing, since it can silently diverge from migration
    history."""
    SQLModel.metadata.create_all(engine)


def get_session():
    """FastAPI dependency: yields a session, closes it after the request."""
    with Session(engine) as session:
        yield session