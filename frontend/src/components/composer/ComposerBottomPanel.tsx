"use client";

import { useState } from "react";

import {
  BarChart3,
  BookOpen,
  CircleDot,
  Code2,
} from "lucide-react";

import ResultsPanel from "./ResultsPanel";
import ExplainPanel from "./ExplainPanel";
import CodePanel from "./CodePanel";
import BlochSpherePanel from "./BlochSpherePanel";

export type BottomTab =
  | "results"
  | "explain"
  | "code"
  | "bloch";

interface ComposerBottomPanelProps {
  probabilities: Record<string, number>;
  explanation: string;
  qasmCode: string;
  qiskitCode: string;
  qubitCount: number;
  onTabChange: (tab: BottomTab) => void;
}

const tabs = [
  {
    id: "results" as const,
    label: "Results",
    icon: BarChart3,
  },
  {
    id: "explain" as const,
    label: "Explain",
    icon: BookOpen,
  },
  {
    id: "code" as const,
    label: "Code",
    icon: Code2,
  },
  {
    id: "bloch" as const,
    label: "Bloch sphere",
    icon: CircleDot,
  },
];

export default function ComposerBottomPanel(
  props: ComposerBottomPanelProps,
) {
  const [activeTab, setActiveTab] =
    useState<BottomTab>("results");

  return (
    <section className="h-56 shrink-0 border-t border-gray-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex h-11 items-end gap-1 border-b border-gray-200 px-4 dark:border-zinc-800">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => {
              setActiveTab(id);
              props.onTabChange(id);
            }}
            className={`flex h-11 items-center gap-2 border-b-2 px-3 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 ${
              activeTab === id
                ? "border-indigo-600 text-indigo-700 dark:text-indigo-300"
                : "border-transparent text-gray-500 hover:text-gray-800 dark:text-zinc-400 dark:hover:text-zinc-100"
            }`}
          >
            <Icon size={15} />
            {label}
          </button>
        ))}
      </div>

      <div className="h-[calc(100%-2.75rem)] overflow-auto p-4">
        {activeTab === "results" && (
          <ResultsPanel
            probabilities={props.probabilities}
          />
        )}

        {activeTab === "explain" && (
          <ExplainPanel
            explanation={props.explanation}
          />
        )}

        {activeTab === "code" && (
          <CodePanel
            qasmCode={props.qasmCode}
            qiskitCode={props.qiskitCode}
          />
        )}

        {activeTab === "bloch" && (
          <BlochSpherePanel
            qubitCount={props.qubitCount}
          />
        )}
      </div>
    </section>
  );
}