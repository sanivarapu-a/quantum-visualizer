"use client";

interface ExplainPanelProps {
  explanation: string;
}

export default function ExplainPanel({ explanation }: ExplainPanelProps) {
  return (
    <div className="h-full overflow-y-auto px-6 py-4">
      <p className="max-w-2xl text-sm leading-relaxed text-gray-400">
        {explanation || "Build a circuit to see a step-by-step explanation of what it does."}
      </p>
    </div>
  );
}