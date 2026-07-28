"use client";

import { useState } from "react";

import ComposerToolbar from "../../components/composer/ComposerToolbar";
import GatePalette from "../../components/composer/GatePalette";
import CircuitCanvas from "../../components/composer/CircuitCanvas";
import ComposerBottomPanel from "../../components/composer/ComposerBottomPanel";

import { GATES, type GateDefinition } from "../../lib/gates";
import { INITIAL_CIRCUIT, type CircuitState } from "../../lib/circuit";

export default function ComposerPage() {
  const [circuit] = useState<CircuitState>(INITIAL_CIRCUIT);

  function handleAddQubit() {
    // TODO: implement adding a qubit.
    console.log("onAddQubit");
  }

  function handleClear() {
    // TODO: implement clearing the circuit.
    console.log("onClear");
  }

  function handleRun() {
    // TODO: implement circuit execution.
    console.log("onRun", circuit);
  }

  function handleGateDragStart(gate: GateDefinition) {
    // TODO: implement drag state.
    console.log("onGateDragStart", gate);
  }

  function handleDropGate(
    gateId: string,
    qubitIndex: number,
    timeStep: number,
  ) {
    // TODO: implement gate placement.
    console.log("onDropGate", {
      gateId,
      qubitIndex,
      timeStep,
    });
  }

  function handleRemoveGate(gateInstanceId: string) {
    // TODO: implement gate removal.
    console.log("onRemoveGate", gateInstanceId);
  }

  return (
    <main className="flex h-screen min-w-[1024px] flex-col overflow-hidden bg-gray-50 text-gray-900 dark:bg-zinc-950 dark:text-zinc-100">
      <ComposerToolbar
        onAddQubit={handleAddQubit}
        onClear={handleClear}
        onRun={handleRun}
      />

      <div className="flex min-h-0 flex-1">
        <GatePalette
          gates={GATES}
          onGateDragStart={handleGateDragStart}
        />

        <CircuitCanvas
          circuit={circuit}
          onDropGate={handleDropGate}
          onRemoveGate={handleRemoveGate}
        />
      </div>

      <ComposerBottomPanel
        qubitCount={circuit.qubitCount}
        probabilities={{}}
        explanation=""
        qasmCode=""
        qiskitCode=""
      />
    </main>
  );
}