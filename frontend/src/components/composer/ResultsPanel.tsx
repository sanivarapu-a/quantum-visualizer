import { BarChart3, Download } from "lucide-react";
import { downloadFile } from "../../lib/downloadFile";

interface ResultsPanelProps {
  probabilities: Record<string, number>;
}

export default function ResultsPanel({ probabilities }: ResultsPanelProps) {
  const entries = Object.entries(probabilities);

  if (entries.length === 0) {
    return (
      <div className="flex h-36 flex-col items-center justify-center text-center text-gray-500 dark:text-zinc-400">
        <BarChart3 size={24} />
        <p className="mt-2 text-sm font-medium">No results yet</p>
        <p className="mt-1 text-xs">Run the circuit to see measurement probabilities.</p>
      </div>
    );
  }

  function handleDownloadCSV() {
    const rows = ["state,probability"];
    for (const [state, prob] of entries) {
      rows.push(`${state},${prob}`);
    }
    downloadFile("results.csv", rows.join("\n"), "text/csv");
  }

  return (
    <div>
      <div className="mb-2 flex justify-end">
        <button
          onClick={handleDownloadCSV}
          className="flex items-center gap-1 rounded p-1 text-xs text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-zinc-400 dark:hover:bg-zinc-800"
        >
          <Download size={14} /> CSV
        </button>
      </div>
      <div className="flex h-36 items-end gap-4">
        {entries.map(([state, probability]) => (
          <div key={state} className="flex h-full flex-1 flex-col justify-end gap-2">
            <span className="text-center text-xs">{Math.round(probability * 100)}%</span>
            <div className="mx-auto w-10 bg-indigo-500" style={{ height: `${probability * 100}%` }} />
            <span className="text-center font-mono text-xs">|{state}⟩</span>
          </div>
        ))}
      </div>
    </div>
  );
}