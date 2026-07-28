"use client";

import type { PlacedGate } from "@/lib/circuit";
import { CHIP_SIZE } from "@/lib/circuit";
import type { GateDefinition } from "@/lib/gates";

interface GateChipProps {
  placedGate: PlacedGate;
  gateDefinition: GateDefinition | undefined;
  onRemove: (gateInstanceId: string) => void;
}

const CATEGORY_ACCENT: Record<string, string> = {
  "single-qubit": "border-cyan-400 text-cyan-300",
  rotation: "border-violet-400 text-violet-300",
  "multi-qubit": "border-fuchsia-400 text-fuchsia-300",
  other: "border-amber-400 text-amber-300",
};

export default function GateChip({ placedGate, gateDefinition, onRemove }: GateChipProps) {
  const accent = gateDefinition ? CATEGORY_ACCENT[gateDefinition.category] : "border-gray-500 text-gray-300";

  return (
    <button
      type="button"
      onClick={() => onRemove(placedGate.id)}
      title={gateDefinition?.description ?? placedGate.gateId}
      style={{ width: CHIP_SIZE, height: CHIP_SIZE }}
      className={`flex shrink-0 items-center justify-center rounded-lg border-2 bg-[#0a0e17] font-mono text-sm font-medium transition-colors hover:border-red-400 hover:text-red-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${accent}`}
    >
      {gateDefinition?.label ?? "?"}
    </button>
  );
}