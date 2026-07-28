"use client";

import type { GateDefinition } from "@/lib/gates";
import { CATEGORY_LABELS, CATEGORY_ORDER } from "@/lib/gates";
import GateIcon from "./GateIcon";

interface GatePaletteProps {
  gates: GateDefinition[];
  onGateDragStart: (gate: GateDefinition) => void;
}

export default function GatePalette({ gates, onGateDragStart }: GatePaletteProps) {
  return (
    <aside className="flex w-44 shrink-0 flex-col gap-6 overflow-y-auto border-r border-white/10 bg-[#0a0e17] p-4">
      {CATEGORY_ORDER.map((category) => {
        const gatesInCategory = gates.filter((g) => g.category === category);
        if (gatesInCategory.length === 0) return null;

        return (
          <section key={category} className="flex flex-col gap-2.5">
            <h3 className="text-[11px] font-medium uppercase tracking-wider text-gray-500">
              {CATEGORY_LABELS[category]}
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {gatesInCategory.map((gate) => (
                <GateIcon key={gate.id} gate={gate} onDragStart={onGateDragStart} />
              ))}
            </div>
          </section>
        );
      })}
    </aside>
  );
}