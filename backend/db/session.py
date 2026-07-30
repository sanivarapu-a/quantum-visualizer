"""
Database engine + session handling.

SQLite for local dev — zero setup, single file on disk. To move to
Postgres later, change DATABASE_URL and add `psycopg2-binary` to
requirements.txt; nothing else in this file or the models needs to
change, since SQLModel/SQLAlchemy abstract the dialect.
"""

import os
from sqlmodel import SQLModel, Session, create_engine

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./quantum_visualizer.db")

# check_same_thread=False is only needed for SQLite (FastAPI can call
# from multiple threads); it's a no-op / unused for other databases.
connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}
engine = create_engine(DATABASE_URL, connect_args=connect_args)


def init_db() -> None:
    """Create tables if they don't exist. Fine for dev; use Alembic
    migrations instead once the schema needs to evolve in production."""
    SQLModel.metadata.create_all(engine)


def get_session():
    """FastAPI dependency: yields a session, closes it after the request."""
    with Session(engine) as session:
        yield session