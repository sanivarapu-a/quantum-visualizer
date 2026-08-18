import type { CircuitState, PlacedGate } from "../circuit";

export interface GroverParams {
  qubitCount: number;
  targetState: string;
  iterations?: number;
}

function makeGate(
  gateId: string,
  qubitIndices: number[],
  timeStep: number,
): PlacedGate {
  return { id: crypto.randomUUID(), gateId, qubitIndices, timeStep };
}

export function optimalGroverIterations(qubitCount: number): number {
  const n = Math.pow(2, qubitCount);
  return Math.max(1, Math.round((Math.PI / 4) * Math.sqrt(n)));
}

export function generateGroverCircuit(params: GroverParams): CircuitState {
  const { qubitCount, targetState } = params;

  if (qubitCount !== 2) {
    throw new Error(
      "Grover's is currently supported for 2 qubits only — the backend has no 3+ qubit controlled-Z gate yet.",
    );
  }
  if (targetState.length !== qubitCount) {
    throw new Error(
      `targetState length (${targetState.length}) must equal qubitCount (${qubitCount})`,
    );
  }

  const iterations = params.iterations ?? optimalGroverIterations(qubitCount);
  const gates: PlacedGate[] = [];
  let timeStep = 0;

  for (let q = 0; q < qubitCount; q++) {
    gates.push(makeGate("H", [q], timeStep));
  }
  timeStep++;

  for (let i = 0; i < iterations; i++) {
    const zeroBitQubits: number[] = [];
    for (let q = 0; q < qubitCount; q++) {
      if (targetState[q] === "0") {
        gates.push(makeGate("X", [q], timeStep));
        zeroBitQubits.push(q);
      }
    }
    timeStep++;

    gates.push(makeGate("CZ", [0, 1], timeStep));
    timeStep++;

    for (const q of zeroBitQubits) {
      gates.push(makeGate("X", [q], timeStep));
    }
    timeStep++;

    for (let q = 0; q < qubitCount; q++) {
      gates.push(makeGate("H", [q], timeStep));
    }
    timeStep++;

    for (let q = 0; q < qubitCount; q++) {
      gates.push(makeGate("X", [q], timeStep));
    }
    timeStep++;

    gates.push(makeGate("CZ", [0, 1], timeStep));
    timeStep++;

    for (let q = 0; q < qubitCount; q++) {
      gates.push(makeGate("X", [q], timeStep));
    }
    timeStep++;

    for (let q = 0; q < qubitCount; q++) {
      gates.push(makeGate("H", [q], timeStep));
    }
    timeStep++;
  }

  return { qubitCount, gates };
}