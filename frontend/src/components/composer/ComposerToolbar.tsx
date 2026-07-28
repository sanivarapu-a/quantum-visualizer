import { Atom, Play, Plus, Trash2 } from "lucide-react";

interface ComposerToolbarProps {
  onAddQubit: () => void;
  onClear: () => void;
  onRun: () => void;
}

export default function ComposerToolbar({
  onAddQubit,
  onClear,
  onRun,
}: ComposerToolbarProps) {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-gray-200 bg-white px-5 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex items-center gap-3">
        <span className="grid size-9 place-items-center rounded-md border border-indigo-200 bg-indigo-50 text-indigo-700 dark:border-indigo-900 dark:bg-indigo-950 dark:text-indigo-300">
          <Atom size={20} />
        </span>

        <div>
          <h1 className="text-sm font-semibold">
            Quantum Composer
          </h1>

          <p className="text-xs text-gray-500 dark:text-zinc-400">
            Untitled circuit
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onAddQubit}
          className="flex h-9 items-center gap-2 rounded-md border border-gray-200 px-3 text-sm font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-zinc-700 dark:hover:bg-zinc-900"
        >
          <Plus size={16} />
          Add qubit
        </button>

        <button
          onClick={onClear}
          className="flex h-9 items-center gap-2 rounded-md border border-gray-200 px-3 text-sm font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-zinc-700 dark:hover:bg-zinc-900"
        >
          <Trash2 size={16} />
          Clear
        </button>

        <button
          onClick={onRun}
          className="flex h-9 items-center gap-2 rounded-md bg-indigo-600 px-4 text-sm font-semibold text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <Play size={16} fill="currentColor" />
          Run
        </button>
      </div>
    </header>
  );
}