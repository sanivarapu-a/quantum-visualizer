import type { CircuitState, PlacedGate } from "../circuit";

function makeGate(gateId: string, qubitIndices: number[], timeStep: number): PlacedGate {
  return { id: crypto.randomUUID(), gateId, qubitIndices, timeStep };
}

export type BellVariant = "phi+" | "phi-" | "psi+" | "psi-";

export interface BellStateParams {
  variant: BellVariant;
}

export function generateBellStateCircuit(params: BellStateParams): CircuitState {
  const gates: PlacedGate[] = [];
  let t = 0;

  gates.push(makeGate("H", [0], t));
  t++;

  gates.push(makeGate("CNOT", [0, 1], t));
  t++;

  if (params.variant === "phi-" || params.variant === "psi-") {
    gates.push(makeGate("Z", [0], t));
  }
  if (params.variant === "psi+" || params.variant === "psi-") {
    gates.push(makeGate("X", [1], t));
  }
  t++;

  /* Need these for later but justdoing a temporty afix. 
  gates.push(makeGate("MEASURE", [0], t));
  gates.push(makeGate("MEASURE", [1], t));
    */
  return { qubitCount: 2, gates };
}