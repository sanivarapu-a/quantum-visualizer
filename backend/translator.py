"""
Circuit -> Qiskit translation.

Deliberately has zero FastAPI/HTTP knowledge in this file. Routes call
build_qiskit_circuit() — this is the one place that understands how
our Circuit JSON maps onto Qiskit's API, so it only needs to be
correct once. QASM and Python-code output are both derived from the
same built QuantumCircuit, rather than hand-generated separately, so
there's only one source of truth for "what does this circuit mean."
"""

from qiskit import QuantumCircuit, transpile
from qiskit_aer import AerSimulator
from qiskit.qasm2 import dumps as qasm2_dumps
from circuit import Circuit, Gate, BlochVector
from qiskit.quantum_info import Statevector, partial_trace

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


def qiskit_circuit_to_qasm(qc: QuantumCircuit) -> str:
    """Render a QuantumCircuit as OpenQASM 2.0 source."""
    return qasm2_dumps(qc)


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


def compute_bloch_vectors(circuit: Circuit) -> list[BlochVector]:
    qc = build_qiskit_circuit(circuit)

    # Drop measurement instructions — Statevector simulation requires
    # a circuit with no mid-circuit or terminal measurements.
    qc_no_measure = qc.remove_final_measurements(inplace=False)

    sv = Statevector.from_instruction(qc_no_measure)
    n = qc_no_measure.num_qubits

    vectors = []
    for q in range(n):
        others = [i for i in range(n) if i != q]
        rho = partial_trace(sv, others) if others else sv.to_operator()
        x = 2 * rho.data[0, 1].real
        y = -2 * rho.data[0, 1].imag
        z = (rho.data[0, 0] - rho.data[1, 1]).real
        vectors.append(BlochVector(qubit=q, x=x, y=y, z=z))
    return vectors