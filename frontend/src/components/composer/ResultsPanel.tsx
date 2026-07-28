import { BarChart3 } from "lucide-react";

interface ResultsPanelProps {
  probabilities: Record<string, number>;
}

export default function ResultsPanel({
  probabilities,
}: ResultsPanelProps) {
  const entries = Object.entries(probabilities);

  if (entries.length === 0) {
    return (
      <div className="flex h-36 flex-col items-center justify-center text-center text-gray-500 dark:text-zinc-400">
        <BarChart3 size={24} />

        <p className="mt-2 text-sm font-medium">
          No results yet
        </p>

        <p className="mt-1 text-xs">
          Run the circuit to see measurement
          probabilities.
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-36 items-end gap-4">
      {entries.map(([state, probability]) => (
        <div
          key={state}
          className="flex h-full flex-1 flex-col justify-end gap-2"
        >
          <span className="text-center text-xs">
            {Math.round(probability * 100)}%
          </span>

          <div
            className="mx-auto w-10 bg-indigo-500"
            style={{
              height: `${probability * 100}%`,
            }}
          />

          <span className="text-center font-mono text-xs">
            |{state}⟩
          </span>
        </div>
      ))}
    </div>
  );
}