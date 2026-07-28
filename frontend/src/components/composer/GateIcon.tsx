import type { DragEvent } from "react";
import type { GateDefinition } from "../../lib/gates";

interface GateIconProps {
  gate: GateDefinition;
  onGateDragStart: (gate: GateDefinition) => void;
}

export default function GateIcon({
  gate,
  onGateDragStart,
}: GateIconProps) {
  function handleDragStart(
    event: DragEvent<HTMLButtonElement>,
  ) {
    event.dataTransfer.setData("text/plain", gate.id);
    event.dataTransfer.effectAllowed = "copy";

    onGateDragStart(gate);
  }

  return (
    <button
      type="button"
      draggable
      onDragStart={handleDragStart}
      title={gate.description}
      className="aspect-square w-full cursor-grab rounded-md border border-gray-300 bg-white text-xs font-semibold text-gray-800 hover:border-indigo-400 hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 active:cursor-grabbing dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:border-indigo-500 dark:hover:bg-indigo-950"
    >
      {gate.label}
    </button>
  );
}