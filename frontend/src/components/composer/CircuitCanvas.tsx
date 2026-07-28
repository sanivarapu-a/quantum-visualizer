"use client";

import type { CircuitState } from "@/lib/circuit";
import { LABEL_WIDTH, ROW_HEIGHT, STEP_WIDTH, CHIP_SIZE } from "@/lib/circuit";
import QubitLine from "./QubitLine";

interface CircuitCanvasProps {
  circuit: CircuitState;
  onDropGate: (gateId: string, qubitIndex: number, timeStep: number) => void;
  onRemoveGate: (gateInstanceId: string) => void;
}

const VISIBLE_STEPS = 8;

function circuitDepth(circuit: CircuitState): number {
  if (circuit.gates.length === 0) return 0;
  return Math.max(...circuit.gates.map((g) => g.timeStep)) + 1;
}

export default function CircuitCanvas({ circuit, onDropGate, onRemoveGate }: CircuitCanvasProps) {
  const { qubitCount, gates } = circuit;
  const canvasWidth = LABEL_WIDTH + VISIBLE_STEPS * STEP_WIDTH;
  const canvasHeight = qubitCount * ROW_HEIGHT;
  const half = ROW_HEIGHT / 2;

  function handleDragOver(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
  }

  function handleDrop(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    const gateId = event.dataTransfer.getData("text/gate-id");
    console.log("onDrop (stub)", { gateId });
    onDropGate(gateId, 0, 0);
  }

  const multiQubitGates = gates.filter((g) => g.qubitIndices.length > 1);

  return (
    <div
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className="flex flex-1 flex-col overflow-auto bg-[#0a0e17] p-6"
    >
      <span className="mb-4 text-[11px] font-medium uppercase tracking-wider text-gray-500">
        Circuit
      </span>

      <div className="relative" style={{ width: canvasWidth, height: canvasHeight }}>
        <svg
          className="pointer-events-none absolute left-0 top-0"
          width={canvasWidth}
          height={canvasHeight}
        >
          {multiQubitGates.map((gate) => {
            const indices = gate.qubitIndices;
            const top = Math.min(...indices) * ROW_HEIGHT + half;
            const bottom = Math.max(...indices) * ROW_HEIGHT + half;
            const x = LABEL_WIDTH + gate.timeStep * STEP_WIDTH + CHIP_SIZE / 2;

            return (
              <line
                key={gate.id}
                x1={x}
                y1={top}
                x2={x}
                y2={bottom}
                stroke="currentColor"
                strokeWidth={2}
                className="text-fuchsia-400"
              />
            );
          })}
        </svg>

        <div className="relative flex flex-col">
          {Array.from({ length: qubitCount }, (_, qubitIndex) => (
            <QubitLine
              key={qubitIndex}
              qubitIndex={qubitIndex}
              gates={gates}
              onRemoveGate={onRemoveGate}
            />
          ))}
        </div>
      </div>

      <p className="mt-6 font-mono text-xs text-gray-600">
        depth {circuitDepth(circuit)} · gates {gates.length} · qubits {qubitCount}
      </p>
    </div>
  );
}