"use client";

import { useState } from "react";
import ComposerToolbar from "@/components/composer/ComposerToolbar";
import GatePalette from "@/components/composer/GatePalette";
import CircuitCanvas from "@/components/composer/CircuitCanvas";
import ComposerBottomPanel from "@/components/composer/ComposerBottomPanel";
import { GATES, type GateDefinition } from "@/lib/gates";
import { INITIAL_CIRCUIT, type CircuitState } from "@/lib/circuit";

export default function ComposerPage() {
  const [circuit, setCircuit] = useState<CircuitState>(INITIAL_CIRCUIT);

  function handleAddQubit() {
    console.log("onAddQubit (stub)");
  }

  function handleClear() {
    console.log("onClear (stub)");
  }

  function handleRun() {
    console.log("onRun (stub)", circuit);
  }

  function handleGateDragStart(gate: GateDefinition) {
    console.log("onGateDragStart (stub)", gate);
  }

  function handleDropGate(gateId: string, qubitIndex: number, timeStep: number) {
    console.log("onDropGate (stub)", { gateId, qubitIndex, timeStep });
  }

  function handleRemoveGate(gateInstanceId: string) {
    console.log("onRemoveGate (stub)", gateInstanceId);
  }

  return (
    <div className="flex h-screen flex-col bg-[#0a0e17]">
      <ComposerToolbar
        onAddQubit={handleAddQubit}
        onClear={handleClear}
        onRun={handleRun}
        qubitCount={circuit.qubitCount}
      />

      <div className="flex min-h-0 flex-1">
        <GatePalette gates={GATES} onGateDragStart={handleGateDragStart} />
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
    </div>
  );
}