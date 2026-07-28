"use client";

import type { GateDefinition } from "@/lib/gates";

interface GateIconProps {
  gate: GateDefinition;
  onDragStart: (gate: GateDefinition) => void;
}

const CATEGORY_ACCENT: Record<string, string> = {
  "single-qubit": "border-cyan-400/60 text-cyan-300",
  rotation: "border-violet-400/60 text-violet-300",
  "multi-qubit": "border-fuchsia-400/60 text-fuchsia-300",
  other: "border-amber-400/60 text-amber-300",
};

export default function GateIcon({ gate, onDragStart }: GateIconProps) {
  return (
    <button
      type="button"
      draggable
      title={gate.description}
      onDragStart={(event) => {
        event.dataTransfer.setData("text/plain", gate.id);
        event.dataTransfer.effectAllowed = "copy";
        onDragStart(gate);
      }}
      className={`flex aspect-square items-center justify-center rounded-md border bg-[#0a0e17] font-mono text-sm font-semibold transition-colors hover:border-cyan-400 hover:text-cyan-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${CATEGORY_ACCENT[gate.category] ?? "border-gray-500/60 text-gray-300"}`}
    >
      {gate.label}
    </button>
  );
}
