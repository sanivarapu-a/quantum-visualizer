export interface PlacedGate {
  gateId: string;
  qubitIndices: number[];
  timeStep: number;
  id: string;
}

export interface CircuitState {
  qubitCount: number;
  gates: PlacedGate[];
}

export const INITIAL_CIRCUIT: CircuitState = {
  qubitCount: 2,
  gates: [],
};

export const ROW_HEIGHT = 64;
export const STEP_WIDTH = 72;
export const LABEL_WIDTH = 48;
export const CHIP_SIZE = 44;

export function createPlacedGate(
  gateId: string,
  qubitIndices: number[],
  timeStep: number
): PlacedGate {
  return {
    id: `${gateId}-${qubitIndices.join("-")}-${timeStep}-${Date.now()}`,
    gateId,
    qubitIndices,
    timeStep,
  };
}

export function toApiCircuitPayload(circuit: CircuitState) {
  console.log("toApiCircuitPayload (stub)", circuit);
  return null;
}