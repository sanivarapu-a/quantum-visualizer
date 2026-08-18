import type { CircuitState, PlacedGate } from "../circuit";

function makeGate(gateId: string, qubitIndices: number[], timeStep: number): PlacedGate {
  return { id: crypto.randomUUID(), gateId, qubitIndices, timeStep };
}

export type TwoBitMessage = "00" | "01" | "10" | "11";

export interface SuperdenseCodingParams {
  message: TwoBitMessage;
}

export function generateSuperdenseCodingCircuit(
  params: SuperdenseCodingParams,
): CircuitState {
  const gates: PlacedGate[] = [];
  let t = 0;

  gates.push(makeGate("h", [0], t)); t++;
  gates.push(makeGate("cx", [0, 1], t)); t++;

  switch (params.message) {
    case "00": break;
    case "01": gates.push(makeGate("x", [0], t)); break;
    case "10": gates.push(makeGate("z", [0], t)); break;
    case "11":
      gates.push(makeGate("x", [0], t));
      gates.push(makeGate("z", [0], t));
      break;
  }
  t++;
  gates.push(makeGate("cx", [0, 1], t)); t++;
  gates.push(makeGate("h", [0], t)); t++;
  gates.push(makeGate("measure", [0], t));
  gates.push(makeGate("measure", [1], t));
  return { qubitCount: 2, gates };
}