"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { BlochVector } from "../../components/composer/BlochSpherePanel";

import ComposerToolbar from "../../components/composer/ComposerToolbar";
import GatePalette from "../../components/composer/GatePalette";
import CircuitCanvas from "../../components/composer/CircuitCanvas";
import ComposerBottomPanel, {
  type BottomTab,
} from "../../components/composer/ComposerBottomPanel";

import { GATES, type GateDefinition } from "../../lib/gates";
import { INITIAL_CIRCUIT, type CircuitState } from "../../lib/circuit";
import { serializeCircuit } from "../../lib/serializeCircuit";
import {
  circuitToQiskit,
  runCircuit,
  generateQASM,
  exportCircuit,
  getBlochVectors,
  type CircuitRecord,
} from "../../lib/api";
import EducationPane from "../../components/composer/EducationPane";
import { ALGORITHMS } from "../../lib/algorithms/algorithmInfo";
import { downloadFile } from "../../lib/downloadFile";

function errorMessage(error: unknown, fallback: string): string {
  return error instanceof Error ? error.message : fallback;
}

export default function ComposerPage() {
  const [circuit, setCircuit] = useState<CircuitState>(INITIAL_CIRCUIT);

  const [activeTab, setActiveTab] = useState<BottomTab>("results");
  const [qasmCode, setQasmCode] = useState("");
  const [qiskitCode, setQiskitCode] = useState("");
  const [probabilities, setProbabilities] = useState<Record<string, number>>({});
  const [isGeneratingCode, setIsGeneratingCode] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedAlgo, setSelectedAlgo] = useState<string>("");
  const activeAlgorithm = ALGORITHMS.find((a) => a.id === selectedAlgo);

  const [savedCircuitId, setSavedCircuitId] = useState<number | null>(null);
  const [rootId, setRootId] = useState<number | null>(null);
  const [isDirty, setIsDirty] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Generate Qiskit code whenever the user views the Code tab.
  useEffect(() => {
    if (activeTab !== "code") return;

    async function generateCode() {
      setIsGeneratingCode(true);
      try {
        const payload = serializeCircuit(circuit);
        const { code } = await circuitToQiskit(payload);
        setQiskitCode(code);
      } catch (error) {
        toast.error(errorMessage(error, "Failed to generate Qiskit code."));
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
    setIsDirty(true);
  }

  function handleClear() {
    setCircuit((current) => ({
      ...current,
      gates: [],
    }));
    setIsDirty(true);
  }

  async function handleSave() {
    setIsSaving(true);
    try {
      const payload = serializeCircuit(circuit);
      const record: CircuitRecord = await exportCircuit(
        "Untitled circuit",
        payload,
        rootId ?? undefined,
      );
      setSavedCircuitId(record.id);
      setRootId(record.root_id);
      setIsDirty(false);
      toast.success("Circuit saved.");
    } catch (error) {
      toast.error(errorMessage(error, "Failed to save circuit."));
    } finally {
      setIsSaving(false);
    }
  }

  async function handleRun() {
    if (savedCircuitId == null) return;

    setIsRunning(true);
    try {
      const run = await runCircuit(savedCircuitId);
      if (run.status === "failed") {
        toast.error(run.error ?? "Circuit run failed.");
        return;
      }
      const counts = run.result?.counts ?? {};
      const asProbabilities: Record<string, number> = {};
      for (const [outcome, count] of Object.entries(counts)) {
        asProbabilities[outcome] = count / run.shots;
      }
      setProbabilities(asProbabilities);
      toast.success("Circuit ran successfully.");
    } catch (error) {
      toast.error(errorMessage(error, "Failed to run circuit."));
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
    setIsDirty(true);
  }

  function handleRemoveGate(gateInstanceId: string) {
    setCircuit((current) => ({
      ...current,
      gates: current.gates.filter((gate) => gate.id !== gateInstanceId),
    }));
    setIsDirty(true);
  }

  const [blochVectors, setBlochVectors] = useState<BlochVector[]>([]);
  const [isFetchingBloch, setIsFetchingBloch] = useState(false);

  async function handleFetchBloch() {
    setIsFetchingBloch(true);
    try {
      const payload = serializeCircuit(circuit);
      const { vectors } = await getBlochVectors(payload);
      setBlochVectors(vectors);
    } catch (error) {
      toast.error(errorMessage(error, "Failed to fetch Bloch vectors."));
    } finally {
      setIsFetchingBloch(false);
    }
  }

  const [isGeneratingQASM, setIsGeneratingQASM] = useState(false);
  async function handleQASMCode() {
    setIsGeneratingQASM(true);
    try {
      const payload = serializeCircuit(circuit);
      const { code } = await generateQASM(payload);
      setQasmCode(code);
    } catch (error) {
      toast.error(errorMessage(error, "Failed to generate QASM code."));
    } finally {
      setIsGeneratingQASM(false);
    }
  }

  function handleLoadCircuit(newCircuit: CircuitState) {
    setCircuit(newCircuit);
    setIsDirty(true);
    setSavedCircuitId(null);
    setRootId(null);
  }

  function handleExportJSON() {
    const payload = serializeCircuit(circuit);
    downloadFile("circuit.json", JSON.stringify(payload, null, 2), "application/json");
    toast.success("Circuit downloaded.");
  }

  return (
    <main className="flex h-screen min-w-[1024px] flex-col overflow-hidden bg-gray-50 text-gray-900 dark:bg-zinc-950 dark:text-zinc-100">
      <ComposerToolbar
        onAddQubit={handleAddQubit}
        onClear={handleClear}
        onRun={handleRun}
        onSave={handleSave}
        onExportJSON={handleExportJSON}
        qubitCount={circuit.qubitCount}
        isRunning={isRunning}
        isSaving={isSaving}
        canRun={savedCircuitId != null && !isDirty}
      />

      <div className="flex min-h-0 flex-1">
        <div className="flex flex-col overflow-y-auto">
          <GatePalette gates={GATES} onGateDragStart={handleGateDragStart} />
          <EducationPane
            selectedAlgo={selectedAlgo}
            onSelectAlgo={setSelectedAlgo}
            onLoadCircuit={handleLoadCircuit}
          />
        </div>

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
        blochVectors={blochVectors}
        isFetchingBloch={isFetchingBloch}
        activeAlgorithm={activeAlgorithm}
        onTabChange={setActiveTab}
        onGenerateQASM={handleQASMCode}
        isGeneratingQASM={isGeneratingQASM}
      />
    </main>
  );
}