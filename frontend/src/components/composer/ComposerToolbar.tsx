"use client";

import { MoreHorizontal, Play } from "lucide-react";

interface ComposerToolbarProps {
  onAddQubit: () => void;
  onClear: () => void;
  onRun: () => void;
  qubitCount?: number;
  circuitName?: string;
  isRunning?: boolean;
}

export default function ComposerToolbar({
  onAddQubit,
  onClear,
  onRun,
  qubitCount,
  circuitName = "Untitled circuit",
  isRunning = false,
}: ComposerToolbarProps) {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-white/10 bg-[#0a0e17] px-5">
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-cyan-400 to-violet-500" />
        <span className="text-[15px] font-medium text-gray-100">{circuitName}</span>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onAddQubit}
          className="rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-xs font-medium text-gray-300 transition-colors hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
        >
          {qubitCount} qubit{qubitCount === 1 ? "" : "s"}
        </button>

        <button
          type="button"
          onClick={onRun}
          disabled={isRunning}
          className="flex items-center gap-1.5 rounded-full bg-cyan-400 px-4 py-1.5 text-xs font-semibold text-[#0a0e17] transition-colors hover:bg-cyan-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0e17]"
        >
          <Play className="h-3.5 w-3.5 fill-current" aria-hidden="true" />
           {isRunning ? "Running…" : "Run"}
        </button>

        <button
          type="button"
          onClick={onClear}
          title="Clear circuit"
          className="rounded-full p-1.5 text-gray-400 transition-colors hover:bg-white/10 hover:text-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
        >
          <MoreHorizontal className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </header>
  );
}