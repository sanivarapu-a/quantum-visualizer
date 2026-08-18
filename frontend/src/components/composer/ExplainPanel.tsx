"use client";

import type { AlgorithmInfo } from "../../lib/algorithms/algorithmInfo";

interface ExplainPanelProps {
  explanation: string;
  activeAlgorithm?: AlgorithmInfo;
}

export default function ExplainPanel({ explanation, activeAlgorithm }: ExplainPanelProps) {
  if (activeAlgorithm) {
    return (
      <div className="text-sm">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-zinc-100">
          {activeAlgorithm.label}
        </h3>
        <p className="mt-2 text-xs text-gray-700 dark:text-zinc-300">
          {activeAlgorithm.summary}
        </p>
        <h4 className="mt-3 text-[11px] font-semibold uppercase tracking-wide text-gray-500 dark:text-zinc-400">
          How it works
        </h4>
        <ol className="mt-1 list-decimal space-y-1 pl-4 text-xs text-gray-700 dark:text-zinc-300">
          {activeAlgorithm.howItWorks.map((step, i) => (
            <li key={i}>{step}</li>
          ))}
        </ol>
        <h4 className="mt-3 text-[11px] font-semibold uppercase tracking-wide text-gray-500 dark:text-zinc-400">
          Where it's used
        </h4>
        <ul className="mt-1 list-disc space-y-1 pl-4 text-xs text-gray-700 dark:text-zinc-300">
          {activeAlgorithm.useCases.map((useCase, i) => (
            <li key={i}>{useCase}</li>
          ))}
        </ul>
      </div>
    );
  }

  if (explanation) {
    return <p className="text-sm text-gray-700 dark:text-zinc-300">{explanation}</p>;
  }

  return (
    <p className="text-sm text-gray-400">
      Run your circuit to generate a step-by-step educational explanation.
    </p>
  );
}