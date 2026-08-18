"use client";

import { useState } from "react";
import type { CircuitState } from "../../lib/circuit";
import { generateGroverCircuit, optimalGroverIterations } from "../../lib/algorithms/grover";
import { generateDeutschJozsaCircuit, type OracleType } from "../../lib/algorithms/deutschJozsa";
import { generateQFTCircuit } from "../../lib/algorithms/qft";
import { generateBellStateCircuit, type BellVariant } from "../../lib/algorithms/bellState";
import {
  generateSuperdenseCodingCircuit,
  type TwoBitMessage,
} from "../../lib/algorithms/superdenseCoding";
import { ALGORITHMS } from "../../lib/algorithms/algorithmInfo";

interface EducationPaneProps {
  selectedAlgo: string;
  onSelectAlgo: (id: string) => void;
  onLoadCircuit: (circuit: CircuitState) => void;
}

const GROVER_QUBIT_COUNT = 2;

export default function EducationPane({
  selectedAlgo,
  onSelectAlgo,
  onLoadCircuit,
}: EducationPaneProps) {
  const [targetState, setTargetState] = useState("10");
  const [useCustomIterations, setUseCustomIterations] = useState(false);
  const [iterations, setIterations] = useState(optimalGroverIterations(GROVER_QUBIT_COUNT));

  const [oracleType, setOracleType] = useState<OracleType>("balanced");
  const [bellVariant, setBellVariant] = useState<BellVariant>("phi+");
  const [message, setMessage] = useState<TwoBitMessage>("00");

  const [error, setError] = useState<string | null>(null);

  function handleLoad() {
    setError(null);
    try {
      if (selectedAlgo === "grover") {
        onLoadCircuit(
          generateGroverCircuit({
            qubitCount: GROVER_QUBIT_COUNT,
            targetState,
            iterations: useCustomIterations ? iterations : undefined,
          }),
        );
      } else if (selectedAlgo === "deutsch-jozsa") {
        onLoadCircuit(generateDeutschJozsaCircuit({ oracleType }));
      } else if (selectedAlgo === "qft") {
        onLoadCircuit(generateQFTCircuit());
      } else if (selectedAlgo === "bell-state") {
        onLoadCircuit(generateBellStateCircuit({ variant: bellVariant }));
      } else if (selectedAlgo === "superdense-coding") {
        onLoadCircuit(generateSuperdenseCodingCircuit({ message }));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate circuit");
    }
  }

  return (
    <div className="border-t border-gray-200 p-4 dark:border-zinc-800">
      <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-zinc-400">
        Algorithms
      </h3>

      <select
        value={selectedAlgo}
        onChange={(e) => onSelectAlgo(e.target.value)}
        className="w-full rounded-md border border-gray-300 bg-white px-2 py-1.5 text-sm dark:border-zinc-700 dark:bg-zinc-900"
      >
        <option value="">Choose an algorithm…</option>
        {ALGORITHMS.map((a) => (
          <option key={a.id} value={a.id}>
            {a.label}
          </option>
        ))}
      </select>

      {selectedAlgo === "bell-state" && (
        <div className="mt-3 space-y-3">
          <label className="block text-xs text-gray-600 dark:text-zinc-400">
            Variant
            <select
              value={bellVariant}
              onChange={(e) => setBellVariant(e.target.value as BellVariant)}
              className="mt-1 w-full rounded-md border border-gray-300 px-2 py-1 text-sm dark:border-zinc-700 dark:bg-zinc-900"
            >
              <option value="phi+">|Φ+⟩</option>
              <option value="phi-">|Φ-⟩</option>
              <option value="psi+">|Ψ+⟩</option>
              <option value="psi-">|Ψ-⟩</option>
            </select>
          </label>
        </div>
      )}

      {selectedAlgo === "deutsch-jozsa" && (
        <div className="mt-3 space-y-3">
          <p className="text-[11px] text-gray-400">2 qubits: q0 = input, q1 = ancilla.</p>
          <label className="block text-xs text-gray-600 dark:text-zinc-400">
            Oracle type
            <select
              value={oracleType}
              onChange={(e) => setOracleType(e.target.value as OracleType)}
              className="mt-1 w-full rounded-md border border-gray-300 px-2 py-1 text-sm dark:border-zinc-700 dark:bg-zinc-900"
            >
              <option value="constant0">Constant (always 0)</option>
              <option value="constant1">Constant (always 1)</option>
              <option value="balanced">Balanced</option>
            </select>
          </label>
        </div>
      )}

      {selectedAlgo === "grover" && (
        <div className="mt-3 space-y-3">
          <p className="text-[11px] text-gray-400">Currently supports 2 qubits only.</p>
          <label className="block text-xs text-gray-600 dark:text-zinc-400">
            Target state (binary, 2 bits)
            <input
              type="text"
              value={targetState}
              onChange={(e) =>
                setTargetState(e.target.value.replace(/[^01]/g, "").slice(0, GROVER_QUBIT_COUNT))
              }
              placeholder="10"
              className="mt-1 w-full rounded-md border border-gray-300 px-2 py-1 font-mono text-sm dark:border-zinc-700 dark:bg-zinc-900"
            />
          </label>
          <label className="flex items-center gap-2 text-xs text-gray-600 dark:text-zinc-400">
            <input
              type="checkbox"
              checked={useCustomIterations}
              onChange={(e) => setUseCustomIterations(e.target.checked)}
            />
            Override iteration count
          </label>
          <label className="block text-xs text-gray-600 dark:text-zinc-400">
            Iterations
            <input
              type="number"
              min={1}
              value={iterations}
              disabled={!useCustomIterations}
              onChange={(e) => setIterations(Number(e.target.value))}
              className="mt-1 w-full rounded-md border border-gray-300 px-2 py-1 text-sm disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-900"
            />
            {!useCustomIterations && (
              <span className="mt-1 block text-[11px] text-gray-400">
                Optimal for {GROVER_QUBIT_COUNT} qubits: {optimalGroverIterations(GROVER_QUBIT_COUNT)}
              </span>
            )}
          </label>
        </div>
      )}

      {selectedAlgo === "qft" && (
        <p className="mt-3 text-[11px] text-gray-400">2 qubits, no parameters — click Load.</p>
      )}

      {selectedAlgo === "superdense-coding" && (
        <div className="mt-3 space-y-3">
          <p className="text-[11px] text-gray-400">q0 = sender, q1 = receiver.</p>
          <label className="block text-xs text-gray-600 dark:text-zinc-400">
            Message to send
            <select
              value={message}
              onChange={(e) => setMessage(e.target.value as TwoBitMessage)}
              className="mt-1 w-full rounded-md border border-gray-300 px-2 py-1 text-sm dark:border-zinc-700 dark:bg-zinc-900"
            >
              <option value="00">00</option>
              <option value="01">01</option>
              <option value="10">10</option>
              <option value="11">11</option>
            </select>
          </label>
        </div>
      )}

      {selectedAlgo && (
        <>
          {error && <p className="mt-2 text-xs text-red-500">{error}</p>}
          <button
            onClick={handleLoad}
            className="mt-3 w-full rounded-md border border-gray-300 bg-gray-900 px-3 py-1.5 text-sm font-medium text-white disabled:opacity-40 dark:border-zinc-700"
          >
            Load
          </button>
        </>
      )}
    </div>
  );
}