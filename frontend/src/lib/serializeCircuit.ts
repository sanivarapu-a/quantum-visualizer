import type { CircuitState, PlacedGate } from "./circuit";
import type { GateType } from "./gates"; // adjust import if GateType lives elsewhere

// Backend-shaped types (mirrors app/models/circuit.py exactly).
export interface ApiQubit {
  id: string;
  index: number;
}

export interface ApiGate {
  id: string;
  type: GateType;
  qubits: string[];      // qubit ids, not indices
  params?: number[];
  column: number;
}

export interface ApiCircuit {
  id: string;
  qubits: ApiQubit[];
  gates: ApiGate[];
  classical_bits?: number;
}

/**
 * Converts the composer's CircuitState into the JSON shape the backend's
 * `Circuit` Pydantic model expects.
 *
 * ASSUMPTION: PlacedGate.gateId is already one of the backend's GateType
 * literals ("H", "X", "CNOT", etc). If your gate palette uses different
 * ids (e.g. "hadamard"), add a lookup table here to translate them.
 */
export function serializeCircuit(state: CircuitState): ApiCircuit {
  const qubits: ApiQubit[] = Array.from({ length: state.qubitCount }, (_, i) => ({
    id: `q${i}`,
    index: i,
  }));

  const qubitIdForIndex = (i: number) => `q${i}`;

  const gates: ApiGate[] = state.gates.map((g: PlacedGate) => ({
    id: g.id,
    type: g.gateId as GateType,
    qubits: g.qubitIndices.map(qubitIdForIndex),
    column: g.timeStep,
    // params intentionally omitted: PlacedGate doesn't carry params yet.
    // Add `params?: number[]` to PlacedGate if you support RX/RY/RZ.
  }));

  return {
    id: crypto.randomUUID(),
    qubits,
    gates,
  };
}