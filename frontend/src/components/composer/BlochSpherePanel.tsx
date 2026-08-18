export interface BlochVector {
  qubit: number;
  x: number;
  y: number;
  z: number;
}

import BlochSphere from "./BlochSphere";

interface BlochSpherePanelProps {
  qubitCount: number;
  blochVectors?: BlochVector[];
  isFetchingBloch?: boolean;
}

export default function BlochSpherePanel({
  qubitCount,
  blochVectors = [],
  isFetchingBloch = false,
}: BlochSpherePanelProps) {
  // Look up each qubit's vector by index; fall back to origin (0,0,0)
  // until real data arrives, so the layout is stable either way.
  const vectorsByQubit = new Map(blochVectors.map((v) => [v.qubit, v]));

  return (
    <div className="flex h-36 gap-3 overflow-x-auto">
      {Array.from({ length: qubitCount }, (_, index) => {
        const vector = vectorsByQubit.get(index) ?? {
          qubit: index,
          x: 0,
          y: 0,
          z: 1, // default to |0⟩ — matches the actual initial state, not a meaningless placeholder
        };

        return (
          <div
            key={index}
            className="grid aspect-square h-full shrink-0 place-items-center rounded-md border border-dashed border-gray-300 text-xs text-gray-500 dark:border-zinc-700 dark:text-zinc-400"
          >
            {isFetchingBloch ? (
              <span>Loading q{index}…</span>
            ) : (
              <BlochSphere x={vector.x} y={vector.y} z={vector.z} label={`q${index}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}