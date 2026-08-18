import type { CircuitState, PlacedGate } from "../circuit";

function makeGate(gateId: string, qubitIndices: number[], timeStep: number, params?: number[]): PlacedGate {
  return { id: crypto.randomUUID(), gateId, qubitIndices, timeStep, params };
}

export function generateQFTCircuit(): CircuitState {
  const gates: PlacedGate[] = [];
  let t = 0;

  gates.push(makeGate("h", [0], t)); t++;
  gates.push(makeGate("rz", [0], t, [Math.PI / 2])); t++;
  gates.push(makeGate("cx", [0, 1], t)); t++;
  gates.push(makeGate("rz", [1], t, [Math.PI / 2])); t++;
  gates.push(makeGate("cx", [0, 1], t)); t++;
  gates.push(makeGate("h", [1], t)); t++;
  gates.push(makeGate("swap", [0, 1], t));

  return { qubitCount: 2, gates };
}