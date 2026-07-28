import GateIcon from "./GateIcon";

import type {
  GateCategory,
  GateDefinition,
} from "../../lib/gates";

interface GatePaletteProps {
  gates: GateDefinition[];
  onGateDragStart: (gate: GateDefinition) => void;
}

const sections: {
  category: GateCategory;
  label: string;
}[] = [
  {
    category: "single-qubit",
    label: "Single qubit",
  },
  {
    category: "rotation",
    label: "Rotation",
  },
  {
    category: "multi-qubit",
    label: "Multi-qubit",
  },
  {
    category: "other",
    label: "Other",
  },
];

export default function GatePalette({
  gates,
  onGateDragStart,
}: GatePaletteProps) {
  return (
    <aside className="w-44 shrink-0 overflow-y-auto border-r border-gray-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
      <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-zinc-400">
        Gate library
      </p>

      <div className="space-y-5">
        {sections.map((section) => (
          <section key={section.category}>
            <h2 className="mb-2 text-xs font-medium text-gray-600 dark:text-zinc-400">
              {section.label}
            </h2>

            <div className="grid grid-cols-3 gap-2">
              {gates
                .filter(
                  (gate) =>
                    gate.category === section.category,
                )
                .map((gate) => (
                  <GateIcon
                    key={gate.id}
                    gate={gate}
                    onGateDragStart={onGateDragStart}
                  />
                ))}
            </div>
          </section>
        ))}
      </div>
    </aside>
  );
}