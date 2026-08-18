import type { CircuitState, PlacedGate } from "../circuit";

export type OracleType = "constant0" | "constant1" | "balanced";

export interface DeutschJozsaParams {
  oracleType: OracleType;
}

function makeGate(gateId: string, qubitIndices: number[], timeStep: number): PlacedGate {
  return { id: crypto.randomUUID(), gateId, qubitIndices, timeStep };
}

// 2 qubits: q0 = input, q1 = ancilla
export function generateDeutschJozsaCircuit(params: DeutschJozsaParams): CircuitState {
  const gates: PlacedGate[] = [];
  let t = 0;

  gates.push(makeGate("X", [1], t)); // ancilla -> |1>
  t++;

  gates.push(makeGate("H", [0], t));
  gates.push(makeGate("H", [1], t));
  t++;

  switch (params.oracleType) {
    case "constant0":
      break;
    case "constant1":
      gates.push(makeGate("X", [1], t));
      break;
    case "balanced":
      gates.push(makeGate("CNOT", [0, 1], t));
      break;
  }
  t++;

  gates.push(makeGate("H", [0], t));
  t++;


  //gates.push(makeGate("MEASURE", [0], t));

  return { qubitCount: 2, gates };
}