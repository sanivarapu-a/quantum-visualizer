import type { ApiCircuit } from "./serializeCircuit";
import { getStoredAuth } from "./auth";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export interface ToQiskitResponse {
  code: string;
}

export interface BlochVector {
  qubit: number;
  x: number;
  y: number;
  z: number;
}
export interface BlochResponse {
  vectors: BlochVector[];
}

function authHeaders(): Record<string, string> {
  const stored = getStoredAuth();
  if (!stored) {
    throw new Error("You must be logged in to do this.");
  }
  return { Authorization: `Bearer ${stored.token}` };
}

export async function circuitToQiskit(circuit: ApiCircuit): Promise<ToQiskitResponse> {
  const res = await fetch(`${API_BASE_URL}/circuits/to-qiskit`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(circuit),
  });

  if (!res.ok) {
    const detail = await res.json().catch(() => null);
    throw new Error(detail?.detail ? JSON.stringify(detail.detail) : `Request failed: ${res.status}`);
  }

  return res.json();
}

export interface RunRecord {
  id: number;
  circuit_id: number;
  backend: string;
  shots: number;
  status: "queued" | "running" | "complete" | "failed";
  result: { counts: Record<string, number> } | null;
  error: string | null;
  created_at: string;
}

export async function runCircuit(circuitId: number, shots = 1024): Promise<RunRecord> {
  const res = await fetch(`${API_BASE_URL}/circuits/versions/${circuitId}/run`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
    },
    body: JSON.stringify({ shots }),
  });

  if (!res.ok) {
    const detail = await res.json().catch(() => null);
    throw new Error(detail?.detail ? JSON.stringify(detail.detail) : `Request failed: ${res.status}`);
  }

  return res.json();
}

export interface ToQasmResponse {
  code: string;
}

export async function generateQASM(circuit: ApiCircuit): Promise<ToQasmResponse> {
  const res = await fetch(`${API_BASE_URL}/circuits/to-qasm`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(circuit),
  });

  if (!res.ok) {
    const detail = await res.json().catch(() => null);
    throw new Error(detail?.detail ? JSON.stringify(detail.detail) : `Request failed: ${res.status}`);
  }

  return res.json();
}

export async function getBlochVectors(circuit: ApiCircuit): Promise<BlochResponse> {
  const res = await fetch(`${API_BASE_URL}/circuits/bloch`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(circuit),
  });
  if (!res.ok) {
    const detail = await res.json().catch(() => null);
    throw new Error(detail?.detail ? JSON.stringify(detail.detail) : `Request failed: ${res.status}`);
  }
  return res.json();
}

export interface CircuitRecord {
  id: number;
  name: string;
  owner_id: number | null;
  root_id: number;
  version: number;
  data: ApiCircuit;
  qasm: string | null;
  created_at: string;
  updated_at: string;
}

export async function exportCircuit(
  name: string,
  circuit: ApiCircuit,
  rootId?: number,
): Promise<CircuitRecord> {
  const url = new URL(`${API_BASE_URL}/circuits/export`);
  if (rootId != null) url.searchParams.set("root_id", String(rootId));

  const res = await fetch(url.toString(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
    },
    body: JSON.stringify({ name, circuit }),
  });

  if (!res.ok) {
    const detail = await res.json().catch(() => null);
    throw new Error(detail?.detail ? JSON.stringify(detail.detail) : `Request failed: ${res.status}`);
  }

  return res.json();
}