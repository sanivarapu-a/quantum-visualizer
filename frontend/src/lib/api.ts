import type { ApiCircuit } from "./serializeCircuit";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export interface ToQiskitResponse {
  code: string;
}

export async function circuitToQiskit(circuit: ApiCircuit): Promise<ToQiskitResponse> {
  const res = await fetch(`${API_BASE_URL}/circuits/to-qiskit`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(circuit),
  });

  if (!res.ok) {
    // FastAPI validation errors (422) or your HTTPException(400) land here.
    const detail = await res.json().catch(() => null);
    throw new Error(detail?.detail ? JSON.stringify(detail.detail) : `Request failed: ${res.status}`);
  }

  return res.json();
}

export interface RunCircuitResponse {
  counts: Record<string, number>;
  shots: number;
}

export async function runCircuit(
  circuit: ApiCircuit,
  shots = 1024,
): Promise<RunCircuitResponse> {
  const res = await fetch(`${API_BASE_URL}/circuits/run`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ circuit, shots }), // matches backend's RunRequest shape
  });

  if (!res.ok) {
    const detail = await res.json().catch(() => null);
    throw new Error(detail?.detail ? JSON.stringify(detail.detail) : `Request failed: ${res.status}`);
  }

  return res.json();
}