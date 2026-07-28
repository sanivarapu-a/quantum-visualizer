import type { PlacedGate } from "../../lib/circuit";
import { GATES } from "../../lib/gates";

interface GateChipProps {
  gate: PlacedGate;
  onRemoveGate: (gateInstanceId: string) => void;
}

export default function GateChip({
  gate,
  onRemoveGate,
}: GateChipProps) {
  const definition = GATES.find(
    (item) => item.id === gate.gateId,
  );

  return (
    <button
      type="button"
      onDoubleClick={() => onRemoveGate(gate.id)}
      title="Double-click to remove"
      style={{
        left: `${gate.timeStep * 72 + 24}px`,
      }}
      className="absolute top-1/2 z-10 grid size-10 -translate-y-1/2 place-items-center rounded-md border border-indigo-500 bg-indigo-600 text-xs font-semibold text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
    >
      {definition?.label ?? gate.gateId.toUpperCase()}
    </button>
  );
}