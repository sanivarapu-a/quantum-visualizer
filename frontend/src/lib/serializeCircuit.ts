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

// Maps frontend gate-palette ids to the backend's GateType literals.
// Add an entry here whenever a palette button's label/id differs from
// the backend name, not just in casing.
const GATE_ID_MAP: Record<string, GateType> = {
  CX: "CNOT",
  SW: "SWAP",
};

function toBackendGateType(gateId: string): GateType {
  const upper = gateId.toUpperCase();
  return (GATE_ID_MAP[upper] ?? upper) as GateType;
}

/**
 * Converts the composer's CircuitState into the JSON shape the backend's
 * `Circuit` Pydantic model expects.
 */
export function serializeCircuit(state: CircuitState): ApiCircuit {
  const qubits: ApiQubit[] = Array.from({ length: state.qubitCount }, (_, i) => ({
    id: `q${i}`,
    index: i,
  }));

  const qubitIdForIndex = (i: number) => `q${i}`;

  const gates: ApiGate[] = state.gates.map((g: PlacedGate) => ({
    id: g.id,
    type: toBackendGateType(g.gateId),
    qubits: g.qubitIndices.map(qubitIdForIndex),
    params: g.params,
    column: g.timeStep,
  }));

  return {
    id: crypto.randomUUID(),
    qubits,
    gates,
    classical_bits: state.qubitCount,
  };
}

import type { CircuitState, PlacedGate } from "./circuit";
import { GATES, type GateDefinition } from "./gates";
import type { ApiCircuit, ApiGate } from "./api";

// Explicit overrides for backend GateType values whose lowercase form
// doesn't match a GATES[].id directly (mirrors GATE_ID_MAP in serializeCircuit,
// but keyed by the *correct* backend name rather than the palette label).
const BACKEND_TYPE_OVERRIDES: Record<string, string> = {
  CNOT: "cx", // backend "CNOT" -> palette id "cx" (label "CX")
  // SWAP needs no override: "swap".toUpperCase() collides with GATE_ID_MAP's
  // "SW" key and falls through to the raw uppercase value anyway, which is
  // why serializeCircuit "works" for it today.
};

const VALID_GATE_IDS = new Set(GATES.map((g) => g.id));

function toPaletteGateId(backendType: string): string {
  const override = BACKEND_TYPE_OVERRIDES[backendType];
  if (override) return override;

  const lower = backendType.toLowerCase();
  if (VALID_GATE_IDS.has(lower)) return lower;

  throw new Error(`Unknown backend gate type: "${backendType}"`);
}

function indexForQubitId(id: string, qubits: ApiCircuit["qubits"]): number {
  const match = /^q(\d+)$/.exec(id);
  if (match) return Number(match[1]);

  const found = qubits.find((q) => q.id === id);
  if (found) return found.index;

  throw new Error(`Cannot resolve qubit index for id "${id}"`);
}

/**
 * Converts the backend's `ApiCircuit` JSON shape back into the composer's
 * CircuitState. Inverse of serializeCircuit.
 */
export function deserializeCircuit(api: ApiCircuit): CircuitState {
  const gates: PlacedGate[] = api.gates.map((g: ApiGate) => {
    const gateId = toPaletteGateId(g.type);
    const def = GATES.find((d) => d.id === gateId) as GateDefinition | undefined;

    if (def && g.qubits.length !== def.qubitCount) {
      throw new Error(
        `Gate "${gateId}" expects ${def.qubitCount} qubit(s), got ${g.qubits.length} (gate id: ${g.id})`
      );
    }

    return {
      id: g.id,
      gateId,
      qubitIndices: g.qubits.map((qid) => indexForQubitId(qid, api.qubits)),
      timeStep: g.column,
    };
  });

  return {
    qubitCount: api.qubits.length,
    gates,
  };
}