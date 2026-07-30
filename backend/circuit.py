"""
Circuit data models.

This is the single source of truth for what a "circuit" looks like as data.
The frontend's drag-and-drop builder produces JSON matching this shape;
every backend route and service works with these types, never raw dicts.
"""

from typing import Literal, Optional
from pydantic import BaseModel, field_validator

# Gate types currently supported by the circuit builder.
# Add new gate types here first — everything downstream (translator,
# validation) switches on this literal, so the type checker will flag
# any place that needs updating when you add one.
GateType = Literal[
    "H", "X", "Y", "Z",       # single-qubit, no params
    "RX", "RY", "RZ",         # single-qubit, parametrized (angle in radians)
    "CNOT", "CZ", "SWAP",     # two-qubit
    "MEASURE",                # single-qubit -> classical bit
]

# Gates that take exactly one qubit vs exactly two, used for validation.
SINGLE_QUBIT_GATES = {"H", "X", "Y", "Z", "RX", "RY", "RZ", "MEASURE"}
TWO_QUBIT_GATES = {"CNOT", "CZ", "SWAP"}
PARAMETRIZED_GATES = {"RX", "RY", "RZ"}


class Qubit(BaseModel):
    id: str
    index: int


class Gate(BaseModel):
    id: str
    type: GateType
    qubits: list[str]                     # ids of qubits this gate acts on, in order
    params: Optional[list[float]] = None  # e.g. [theta] for RX/RY/RZ
    column: int                           # position on the circuit timeline (>= 0)

    @field_validator("qubits")
    @classmethod
    def check_qubit_count(cls, qubits: list[str], info) -> list[str]:
        gate_type = info.data.get("type")
        if gate_type in SINGLE_QUBIT_GATES and len(qubits) != 1:
            raise ValueError(f"{gate_type} requires exactly 1 qubit, got {len(qubits)}")
        if gate_type in TWO_QUBIT_GATES and len(qubits) != 2:
            raise ValueError(f"{gate_type} requires exactly 2 qubits, got {len(qubits)}")
        return qubits

    @field_validator("params")
    @classmethod
    def check_params(cls, params: Optional[list[float]], info) -> Optional[list[float]]:
        gate_type = info.data.get("type")
        if gate_type in PARAMETRIZED_GATES and not params:
            raise ValueError(f"{gate_type} requires a params list, e.g. [theta]")
        return params


class Circuit(BaseModel):
    id: str
    qubits: list[Qubit]
    gates: list[Gate]
    classical_bits: Optional[int] = None

    @field_validator("gates")
    @classmethod
    def check_gate_qubit_refs(cls, gates: list[Gate], info) -> list[Gate]:
        """Every qubit id a gate references must exist in the qubits list."""
        qubits = info.data.get("qubits") or []
        known_ids = {q.id for q in qubits}
        for gate in gates:
            unknown = [qid for qid in gate.qubits if qid not in known_ids]
            if unknown:
                raise ValueError(
                    f"Gate {gate.id} references unknown qubit id(s): {unknown}"
                )
        return gates


# --- Request/response shapes for the API routes ---

class ToQiskitResponse(BaseModel):
    code: str


class RunRequest(BaseModel):
    circuit: Circuit
    shots: int = 1024


class RunResponse(BaseModel):
    counts: dict[str, int]
    shots: int