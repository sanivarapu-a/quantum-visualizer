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
  qubitCount: 3,
  gates: [],
};

export interface PlacedGate {
  gateId: string;
  qubitIndices: number[];
  timeStep: number;
  id: string;
  params?: number[];
}