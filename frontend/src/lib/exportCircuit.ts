import type { ApiCircuit } from "./serializeCircuit";
import { downloadFile } from "./downloadFile";

export function exportQASM(qasmCode: string, name: string) {
  if (!qasmCode) throw new Error("Generate QASM code first before exporting.");
  downloadFile(`${name}.qasm`, qasmCode, "text/plain");
}

export function exportQiskit(qiskitCode: string, name: string) {
  if (!qiskitCode) throw new Error("Generate Qiskit code first before exporting.");
  downloadFile(`${name}.py`, qiskitCode, "text/x-python");
}

export function exportCircuitJSON(circuit: ApiCircuit, name: string) {
  downloadFile(`${name}.json`, JSON.stringify(circuit, null, 2), "application/json");
}

export function exportResultsJSON(probabilities: Record<string, number>, name: string) {
  downloadFile(`${name}-results.json`, JSON.stringify(probabilities, null, 2), "application/json");
}

export function exportResultsCSV(probabilities: Record<string, number>, name: string) {
  const rows = ["state,probability"];
  for (const [state, prob] of Object.entries(probabilities)) {
    rows.push(`${state},${prob}`);
  }
  downloadFile(`${name}-results.csv`, rows.join("\n"), "text/csv");
}