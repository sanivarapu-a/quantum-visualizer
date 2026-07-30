"""
Circuit -> Qiskit translation.

Deliberately has zero FastAPI/HTTP knowledge in this file. Both the
/circuits/to-qiskit route and the /circuits/run route call
build_qiskit_circuit() — this is the one place that understands how
our Circuit JSON maps onto Qiskit's API, so it only needs to be
correct once.
"""

from qiskit import QuantumCircuit, transpile
from qiskit_aer import AerSimulator

from circuit import Circuit, Gate

# Maps our gate type strings to the QuantumCircuit method name to call.
_SINGLE_QUBIT_NO_PARAM = {"H": "h", "X": "x", "Y": "y", "Z": "z"}
_SINGLE_QUBIT_PARAM = {"RX": "rx", "RY": "ry", "RZ": "rz"}
_TWO_QUBIT = {"CNOT": "cx", "CZ": "cz", "SWAP": "swap"}


def build_qiskit_circuit(circuit: Circuit) -> QuantumCircuit:
    """Convert a validated Circuit into an executable qiskit.QuantumCircuit."""

    qubit_index = {q.id: q.index for q in circuit.qubits}
    num_qubits = len(circuit.qubits)
    num_clbits = circuit.classical_bits or 0

    qc = QuantumCircuit(num_qubits, num_clbits)

    for gate in sorted(circuit.gates, key=lambda g: g.column):
        _apply_gate(qc, gate, qubit_index)

    return qc


def _apply_gate(qc: QuantumCircuit, gate: Gate, qubit_index: dict[str, int]) -> None:
    indices = [qubit_index[qid] for qid in gate.qubits]

    if gate.type in _SINGLE_QUBIT_NO_PARAM:
        method = getattr(qc, _SINGLE_QUBIT_NO_PARAM[gate.type])
        method(indices[0])

    elif gate.type in _SINGLE_QUBIT_PARAM:
        method = getattr(qc, _SINGLE_QUBIT_PARAM[gate.type])
        theta = gate.params[0]
        method(theta, indices[0])

    elif gate.type in _TWO_QUBIT:
        method = getattr(qc, _TWO_QUBIT[gate.type])
        method(indices[0], indices[1])

    elif gate.type == "MEASURE":
        qc.measure(indices[0], indices[0])

    else:
        raise ValueError(f"No translation defined for gate type: {gate.type}")


def qiskit_circuit_to_code(qc: QuantumCircuit) -> str:
    """Render a QuantumCircuit as readable, standalone Qiskit Python source."""

    lines = [
        "from qiskit import QuantumCircuit",
        "",
        f"qc = QuantumCircuit({qc.num_qubits}, {qc.num_clbits})" if qc.num_clbits
        else f"qc = QuantumCircuit({qc.num_qubits})",
        "",
    ]

    for instruction in qc.data:
        op = instruction.operation
        qubits = [qc.find_bit(q).index for q in instruction.qubits]
        clbits = [qc.find_bit(c).index for c in instruction.clbits]

        if op.name == "measure":
            lines.append(f"qc.measure({qubits[0]}, {clbits[0]})")
        elif op.params:
            params_str = ", ".join(str(p) for p in op.params)
            qubits_str = ", ".join(str(q) for q in qubits)
            lines.append(f"qc.{op.name}({params_str}, {qubits_str})")
        else:
            qubits_str = ", ".join(str(q) for q in qubits)
            lines.append(f"qc.{op.name}({qubits_str})")

    return "\n".join(lines)


def run_simulation(circuit: Circuit, shots: int = 1024) -> dict[str, int]:
    """
    Builds the Qiskit circuit and runs it on Aer's simulator, returning
    measurement counts, e.g. {"000": 512, "111": 512}.

    If the circuit has no MEASURE gates (no classical registers), measures
    all qubits by default so the user still gets a result.
    """
    qc = build_qiskit_circuit(circuit)

    if not qc.cregs:
        qc.measure_all()

    simulator = AerSimulator()
    compiled = transpile(qc, simulator)
    job = simulator.run(compiled, shots=shots)
    result = job.result()

    return result.get_counts()