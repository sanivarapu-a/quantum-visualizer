"use client";

import { Copy } from "lucide-react";

interface CodePanelProps {
  qasmCode: string;
  qiskitCode: string;
}

function CodeBlock({
  title,
  code,
  onCopy,
}: {
  title: string;
  code: string;
  onCopy: () => void;
}) {
  return (
    <div className="flex min-w-0 flex-1 flex-col rounded-lg border border-white/10 bg-white/[0.02]">
      <div className="flex items-center justify-between border-b border-white/10 px-3 py-2">
        <span className="font-mono text-[11px] font-medium uppercase tracking-wider text-gray-500">
          {title}
        </span>
        <button
          type="button"
          onClick={onCopy}
          title={`Copy ${title} code`}
          className="rounded p-1 text-gray-500 transition-colors hover:text-cyan-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
        >
          <Copy className="h-3.5 w-3.5" aria-hidden="true" />
        </button>
      </div>
      <pre className="flex-1 overflow-auto p-3 font-mono text-xs leading-relaxed text-gray-300">
        <code>{code || "// Nothing to show yet — build a circuit first."}</code>
      </pre>
    </div>
  );
}

export default function CodePanel({ qasmCode, qiskitCode }: CodePanelProps) {
  function handleCopy(label: string, code: string) {
    console.log("onCopy (stub)", { label, code });
  }

  return (
    <div className="flex h-full gap-3 overflow-hidden px-6 pb-6">
      <CodeBlock title="OpenQASM" code={qasmCode} onCopy={() => handleCopy("qasm", qasmCode)} />
      <CodeBlock title="Qiskit" code={qiskitCode} onCopy={() => handleCopy("qiskit", qiskitCode)} />
    </div>
  );
}