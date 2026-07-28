"use client";

import { useState } from "react";
import { BarChart3, BookOpen, Code2, CircleDot } from "lucide-react";
import ResultsPanel from "./ResultsPanel";
import ExplainPanel from "./ExplainPanel";
import CodePanel from "./CodePanel";
import BlochSpherePanel from "./BlochSpherePanel";

export type BottomTab = "results" | "explain" | "code" | "bloch";

interface ComposerBottomPanelProps {
  qubitCount: number;
  probabilities: Record<string, number>;
  explanation: string;
  qasmCode: string;
  qiskitCode: string;
}

const TABS: { id: BottomTab; label: string; icon: typeof BarChart3 }[] = [
  { id: "results", label: "Probabilities", icon: BarChart3 },
  { id: "explain", label: "Explain", icon: BookOpen },
  { id: "code", label: "Code", icon: Code2 },
  { id: "bloch", label: "Bloch sphere", icon: CircleDot },
];

export default function ComposerBottomPanel({
  qubitCount,
  probabilities,
  explanation,
  qasmCode,
  qiskitCode,
}: ComposerBottomPanelProps) {
  const [activeTab, setActiveTab] = useState<BottomTab>("results");

  return (
    <section className="flex h-64 shrink-0 flex-col border-t border-white/10 bg-[#0a0e17]">
      <div className="flex shrink-0 gap-1 p-3">
        {TABS.map(({ id, label, icon: Icon }) => {
          const isActive = activeTab === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
                isActive
                  ? "bg-white text-[#0a0e17]"
                  : "text-gray-400 hover:bg-white/5 hover:text-gray-200"
              }`}
            >
              <Icon className="h-3.5 w-3.5" aria-hidden="true" />
              {label}
            </button>
          );
        })}
      </div>

      <div className="min-h-0 flex-1">
        {activeTab === "results" && <ResultsPanel probabilities={probabilities} />}
        {activeTab === "explain" && <ExplainPanel explanation={explanation} />}
        {activeTab === "code" && <CodePanel qasmCode={qasmCode} qiskitCode={qiskitCode} />}
        {activeTab === "bloch" && <BlochSpherePanel qubitCount={qubitCount} />}
      </div>
    </section>
  );
}