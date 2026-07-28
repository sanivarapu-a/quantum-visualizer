import type { PlacedGate } from "../../lib/circuit";
import GateChip from "./GateChip";

interface QubitLineProps {
  index: number;
  gates: PlacedGate[];
  onRemoveGate: (gateInstanceId: string) => void;
}

export default function QubitLine({
  index,
  gates,
  onRemoveGate,
}: QubitLineProps) {
  return (
    <div className="flex h-20 items-center">
      <div className="w-16 shrink-0 text-right font-mono text-sm text-gray-600 dark:text-zinc-400">
        q{index}
      </div>

      <div className="relative ml-5 h-full flex-1">
        <div className="absolute inset-x-0 top-1/2 h-px bg-gray-400 dark:bg-zinc-600" />

        {gates.map((gate) => (
          <GateChip
            key={gate.id}
            gate={gate}
            onRemoveGate={onRemoveGate}
          />
        ))}
      </div>
    </div>
  );
}