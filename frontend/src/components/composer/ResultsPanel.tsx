"use client";

interface ResultsPanelProps {
  probabilities: Record<string, number>;
}

export default function ResultsPanel({ probabilities }: ResultsPanelProps) {
  const entries = Object.entries(probabilities);

  if (entries.length === 0) {
    return (
      <div className="flex h-full items-center justify-center px-6 text-sm text-gray-500">
        Run the circuit to see measurement probabilities.
      </div>
    );
  }

  const max = Math.max(...entries.map(([, value]) => value), 1);

  return (
    <div className="flex h-full items-end gap-3 overflow-x-auto px-6 pb-6">
      {entries.map(([state, value]) => (
        <div key={state} className="flex flex-col items-center gap-2">
          <div className="flex h-32 w-10 items-end overflow-hidden rounded-md bg-white/5">
            <div
              className="w-full rounded-md bg-gradient-to-t from-violet-500 to-cyan-400"
              style={{ height: `${(value / max) * 100}%` }}
            />
          </div>
          <span className="font-mono text-[11px] text-gray-500">|{state}⟩</span>
        </div>
      ))}
    </div>
  );
}