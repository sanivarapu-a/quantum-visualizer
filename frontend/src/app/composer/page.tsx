"use client";


import { useEffect, useState } from "react";


import ComposerToolbar from "../../components/composer/ComposerToolbar";
import GatePalette from "../../components/composer/GatePalette";
import CircuitCanvas from "../../components/composer/CircuitCanvas";
import ComposerBottomPanel, {
  type BottomTab,
} from "../../components/composer/ComposerBottomPanel";

import { GATES, type GateDefinition } from "../../lib/gates";
import { INITIAL_CIRCUIT, type CircuitState } from "../../lib/circuit";
import { serializeCircuit } from "../../lib/serializeCircuit";
import { circuitToQiskit, runCircuit} from "../../lib/api";

export default function ComposerPage() {
  const [circuit, setCircuit] = useState<CircuitState>(INITIAL_CIRCUIT);

  const [activeTab, setActiveTab] = useState<BottomTab>("results");
  const [qasmCode, setQasmCode] = useState("");
  const [qiskitCode, setQiskitCode] = useState("");
  const [probabilities, setProbabilities] = useState<Record<string, number>>({});
  const [isGeneratingCode, setIsGeneratingCode] = useState(false);
  const [isRunning, setIsRunning] = useState(false);

  // Generate Qiskit code whenever the user views the Code tab.
  useEffect(() => {
    if (activeTab !== "code") return;

    async function generateCode() {
      setIsGeneratingCode(true);
      try {
        const payload = serializeCircuit(circuit);
        const { code } = await circuitToQiskit(payload);
        setQiskitCode(code);
        // setQasmCode(...) — no QASM endpoint confirmed yet on the backend.
      } catch (error) {
        console.error(error);
      } finally {
        setIsGeneratingCode(false);
      }
    }

    generateCode();
  }, [activeTab, circuit]);

  function handleAddQubit() {
    setCircuit((current) => ({
      ...current,
      qubitCount: current.qubitCount + 1,
    }));
  }

  function handleClear() {
    setCircuit((current) => ({
      ...current,
      gates: [],
    }));
  }



// ...

async function handleRun() {
  setIsRunning(true);
  try {
    const payload = serializeCircuit(circuit);
    const { counts, shots } = await runCircuit(payload);

    const asProbabilities: Record<string, number> = {};
    for (const [outcome, count] of Object.entries(counts)) {
      asProbabilities[outcome] = count / shots;
    }
    setProbabilities(asProbabilities);
  } catch (error) {
    console.error(error);
  } finally {
    setIsRunning(false);
  }
}

  function handleGateDragStart(gate: GateDefinition) {
    // TODO: implement drag state.
    console.log("onGateDragStart", gate);
  }

  function handleDropGate(gateId: string, qubitIndex: number, timeStep: number) {
    const gateDefinition = GATES.find((gate) => gate.id === gateId);
    if (!gateDefinition) return;

    const qubitIndices = Array.from(
      { length: gateDefinition.qubitCount },
      (_, offset) => qubitIndex + offset,
    ).filter((index) => index < circuit.qubitCount);

    const newGate = {
      id: crypto.randomUUID(),
      gateId,
      qubitIndices,
      timeStep,
    };

    setCircuit((current) => ({
      ...current,
      gates: [...current.gates, newGate],
    }));
  }

  function handleRemoveGate(gateInstanceId: string) {
    setCircuit((current) => ({
      ...current,
      gates: current.gates.filter((gate) => gate.id !== gateInstanceId),
    }));
  }

  return (
    <main className="flex h-screen min-w-[1024px] flex-col overflow-hidden bg-gray-50 text-gray-900 dark:bg-zinc-950 dark:text-zinc-100">
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
        probabilities={probabilities}
        explanation=""
        qasmCode={qasmCode}
        qiskitCode={qiskitCode}
        onTabChange={setActiveTab}
      />
    </main>
  );
}