"use client";

import type { DragEvent } from "react";
import type { CircuitState } from "../../lib/circuit";
import QubitLine from "./QubitLine";

interface CircuitCanvasProps {
  circuit: CircuitState;

  onDropGate: (
    gateId: string,
    qubitIndex: number,
    timeStep: number,
  ) => void;

  onRemoveGate: (gateInstanceId: string) => void;
}

export default function CircuitCanvas({
  circuit,
  onDropGate,
  onRemoveGate,
}: CircuitCanvasProps) {
  function handleDragOver(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();

    const gateId =
      event.dataTransfer.getData("text/plain");

    // TODO: calculate the real qubit and time step.
    console.log("canvasDrop", gateId);

    onDropGate(gateId, 0, 0);
  }

  return (
    <section
      aria-label="Circuit canvas"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className="min-w-0 flex-1 overflow-auto bg-gray-50 p-6 dark:bg-zinc-950"
    >
      <div className="min-h-full min-w-[720px] rounded-md border border-gray-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900/40">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold">
              Circuit
            </h2>

            <p className="mt-1 text-xs text-gray-500 dark:text-zinc-400">
              Drag gates from the library onto a qubit
              wire
            </p>
          </div>

          <span className="rounded-md border border-gray-200 px-2 py-1 font-mono text-xs text-gray-500 dark:border-zinc-700 dark:text-zinc-400">
            {circuit.qubitCount} qubits
          </span>
        </div>

        <div className="relative pr-8">
          {Array.from(
            { length: circuit.qubitCount },
            (_, index) => (
              <QubitLine
                key={index}
                index={index}
                gates={circuit.gates.filter((gate) =>
                  gate.qubitIndices.includes(index),
                )}
                onRemoveGate={onRemoveGate}
              />
            ),
          )}
        </div>
      </div>
    </section>
  );
}