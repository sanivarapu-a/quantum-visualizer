"""
Database table models.

Deliberately separate from app/models/circuit.py. That file defines the
API *contract* (what a Circuit looks like over the wire, drag-and-drop
UI <-> backend). This file defines *storage* (how a circuit row looks
in the database).
"""

from datetime import datetime, timezone
from typing import Optional
from sqlmodel import SQLModel, Field, Column, JSON


def _utcnow() -> datetime:
    return datetime.now(timezone.utc)


class CircuitRecord(SQLModel, table=True):
    __tablename__ = "circuits"

    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    owner_id: Optional[int] = Field(default=None, index=True)  # unused until accounts exist

    # The circuit's qubits+gates, stored as-is. Validated on the way in
    # by the Circuit Pydantic model at the API boundary — by the time
    # it's written here, it's already known-good JSON.
    data: dict = Field(sa_column=Column(JSON))

    created_at: datetime = Field(default_factory=_utcnow)
    updated_at: datetime = Field(default_factory=_utcnow)


class RunRecord(SQLModel, table=True):
    __tablename__ = "runs"

    id: Optional[int] = Field(default=None, primary_key=True)
    circuit_id: int = Field(foreign_key="circuits.id", index=True)

    backend: str = Field(default="aer_simulator")
    shots: int = Field(default=1024)
    status: str = Field(default="queued")  # queued | running | complete | failed

    result: Optional[dict] = Field(default=None, sa_column=Column(JSON))
    error: Optional[str] = Field(default=None)

    created_at: datetime = Field(default_factory=_utcnow)