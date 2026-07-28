export interface GateDefinition {
  id: string;
  label: string;
  category: "single-qubit" | "rotation" | "multi-qubit" | "other";
  qubitCount: 1 | 2 | 3;
  description: string;
}

export const GATES: GateDefinition[] = [
  { id: "h", label: "H", category: "single-qubit", qubitCount: 1, description: "Hadamard — puts a qubit into superposition." },
  { id: "x", label: "X", category: "single-qubit", qubitCount: 1, description: "Pauli-X — flips the qubit state (quantum NOT)." },
  { id: "y", label: "Y", category: "single-qubit", qubitCount: 1, description: "Pauli-Y — rotation around the Y axis of the Bloch sphere." },
  { id: "z", label: "Z", category: "single-qubit", qubitCount: 1, description: "Pauli-Z — flips the phase of the qubit." },
  { id: "s", label: "S", category: "single-qubit", qubitCount: 1, description: "S gate — quarter phase rotation." },
  { id: "t", label: "T", category: "single-qubit", qubitCount: 1, description: "T gate — eighth phase rotation." },
  { id: "rx", label: "Rx", category: "rotation", qubitCount: 1, description: "Parametrized rotation around the X axis." },
  { id: "ry", label: "Ry", category: "rotation", qubitCount: 1, description: "Parametrized rotation around the Y axis." },
  { id: "rz", label: "Rz", category: "rotation", qubitCount: 1, description: "Parametrized rotation around the Z axis." },
  { id: "cx", label: "CNOT", category: "multi-qubit", qubitCount: 2, description: "Controlled-NOT — flips the target qubit if the control is |1⟩." },
  { id: "swap", label: "SWAP", category: "multi-qubit", qubitCount: 2, description: "Exchanges the state of two qubits." },
  { id: "ccx", label: "Toffoli", category: "multi-qubit", qubitCount: 3, description: "Controlled-controlled-NOT — flips the target if both controls are |1⟩." },
  { id: "measure", label: "Measure", category: "other", qubitCount: 1, description: "Measures the qubit, collapsing it to a classical bit." },
  { id: "reset", label: "Reset", category: "other", qubitCount: 1, description: "Resets the qubit to the |0⟩ state." },
  { id: "barrier", label: "Barrier", category: "other", qubitCount: 1, description: "Visual separator — prevents optimizations across it." },
];

export const CATEGORY_LABELS: Record<GateDefinition["category"], string> = {
  "single-qubit": "Single-qubit",
  rotation: "Rotation",
  "multi-qubit": "Multi-qubit",
  other: "Other",
};

export const CATEGORY_ORDER: GateDefinition["category"][] = [
  "single-qubit",
  "rotation",
  "multi-qubit",
  "other",
];

export function getGateById(id: string): GateDefinition | undefined {
  return GATES.find((g) => g.id === id);
}