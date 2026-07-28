export type GateCategory =
  | "single-qubit"
  | "rotation"
  | "multi-qubit"
  | "other";

export interface GateDefinition {
  id: string;
  label: string;
  category: GateCategory;
  qubitCount: 1 | 2 | 3;
  description: string;
}

export const GATES: GateDefinition[] = [
  {
    id: "h",
    label: "H",
    category: "single-qubit",
    qubitCount: 1,
    description: "Hadamard gate",
  },
  {
    id: "x",
    label: "X",
    category: "single-qubit",
    qubitCount: 1,
    description: "Pauli-X gate",
  },
  {
    id: "y",
    label: "Y",
    category: "single-qubit",
    qubitCount: 1,
    description: "Pauli-Y gate",
  },
  {
    id: "z",
    label: "Z",
    category: "single-qubit",
    qubitCount: 1,
    description: "Pauli-Z gate",
  },
  {
    id: "s",
    label: "S",
    category: "single-qubit",
    qubitCount: 1,
    description: "S phase gate",
  },
  {
    id: "t",
    label: "T",
    category: "single-qubit",
    qubitCount: 1,
    description: "T phase gate",
  },
  {
    id: "rx",
    label: "Rx",
    category: "rotation",
    qubitCount: 1,
    description: "X-axis rotation",
  },
  {
    id: "ry",
    label: "Ry",
    category: "rotation",
    qubitCount: 1,
    description: "Y-axis rotation",
  },
  {
    id: "rz",
    label: "Rz",
    category: "rotation",
    qubitCount: 1,
    description: "Z-axis rotation",
  },
  {
    id: "cx",
    label: "CX",
    category: "multi-qubit",
    qubitCount: 2,
    description: "Controlled-X gate",
  },
  {
    id: "swap",
    label: "SW",
    category: "multi-qubit",
    qubitCount: 2,
    description: "Swap gate",
  },
  {
    id: "ccx",
    label: "CCX",
    category: "multi-qubit",
    qubitCount: 3,
    description: "Toffoli gate",
  },
  {
    id: "measure",
    label: "M",
    category: "other",
    qubitCount: 1,
    description: "Measure a qubit",
  },
  {
    id: "reset",
    label: "R",
    category: "other",
    qubitCount: 1,
    description: "Reset a qubit",
  },
  {
    id: "barrier",
    label: "│",
    category: "other",
    qubitCount: 1,
    description: "Circuit barrier",
  },
];