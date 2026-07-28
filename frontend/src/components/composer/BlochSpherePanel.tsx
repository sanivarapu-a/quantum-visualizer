interface BlochSpherePanelProps {
  qubitCount: number;
}

export default function BlochSpherePanel({
  qubitCount,
}: BlochSpherePanelProps) {
  return (
    <div className="flex h-36 gap-3 overflow-x-auto">
      {Array.from(
        { length: qubitCount },
        (_, index) => (
          <div
            key={index}
            className="grid aspect-square h-full shrink-0 place-items-center rounded-md border border-dashed border-gray-300 text-xs text-gray-500 dark:border-zinc-700 dark:text-zinc-400"
          >
            Bloch sphere q{index}
          </div>
        ),
      )}
    </div>
  );
}