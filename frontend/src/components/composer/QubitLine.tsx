"use client";

import type { PlacedGate } from "@/lib/circuit";
import { LABEL_WIDTH, ROW_HEIGHT, STEP_WIDTH, CHIP_SIZE } from "@/lib/circuit";
import { getGateById } from "@/lib/gates";
import GateChip from "./GateChip";
import GateIcon from "./GateIcon";

interface QubitLineProps {
  qubitIndex: number;
  gates: PlacedGate[];
  onRemoveGate: (gateInstanceId: string) => void;
}

export default function QubitLine({ qubitIndex, gates, onRemoveGate }: QubitLineProps) {
  const half = ROW_HEIGHT / 2;

  return (
    <div className="relative flex items-center" style={{ height: ROW_HEIGHT }}>
      <div
        className="flex shrink-0 items-center font-mono text-xs text-gray-500"
        style={{ width: LABEL_WIDTH }}
      >
        q{qubitIndex}
      </div>

      <div className="relative flex-1" style={{ height: ROW_HEIGHT }}>
        <div
          className="absolute left-0 right-0 border-t border-white/10"
          style={{ top: half }}
        />

        {gates.map((placedGate) => {
          if (!placedGate.qubitIndices.includes(qubitIndex)) return null;

          const isTarget =
            placedGate.qubitIndices[placedGate.qubitIndices.length - 1] === qubitIndex;
          const left = placedGate.timeStep * STEP_WIDTH;

          if (isTarget) {
            return (
              <div
                key={placedGate.id}
                className="absolute"
                style={{ left, top: half - CHIP_SIZE / 2 }}
              >
                <GateChip
                  placedGate={placedGate}
                  gateDefinition={getGateById(placedGate.gateId)}
                  onRemove={onRemoveGate}
                />
              </div>
            );
          }

          return (
            <div
              key={placedGate.id}
              className="absolute h-3 w-3 rounded-full border border-fuchsia-400 bg-fuchsia-400"
              style={{ left: left + CHIP_SIZE / 2 - 6, top: half - 6 }}
              title="Control qubit"
            />
          );
        })}
      </div>
    </div>
  );
}