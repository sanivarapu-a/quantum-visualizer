"use client";

import { Copy, Download } from "lucide-react";
import { toast } from "sonner";
import { downloadFile } from "../../lib/downloadFile";

interface CodePanelProps {
  qasmCode: string;
  qiskitCode: string;
  onGenerateQASM: () => Promise<void>;
  isGeneratingQASM: boolean;
}

interface CodeBlockProps {
  title: string;
  code: string;
  filename: string;
  mimeType: string;
}

function CodeBlock({ title, code, filename, mimeType }: CodeBlockProps) {
  async function handleCopy() {
    if (!code) {
      toast.error(`No ${title} code to copy yet.`);
      return;
    }
    try {
      await navigator.clipboard.writeText(code);
      toast.success(`${title} copied to clipboard.`);
    } catch {
      toast.error(`Couldn't copy ${title}. Your browser may be blocking clipboard access.`);
    }
  }

  function handleDownload() {
    if (!code) {
      toast.error(`No ${title} code to download yet.`);
      return;
    }
    downloadFile(filename, code, mimeType);
    toast.success(`${title} downloaded.`);
  }

  return (
    <div className="min-w-0 flex-1 overflow-hidden rounded-md border border-gray-200 dark:border-zinc-700">
      <div className="flex items-center justify-between border-b border-gray-200 px-3 py-2 dark:border-zinc-700">
        <span className="text-xs font-semibold">{title}</span>
        <div className="flex items-center gap-1">
          <button
            onClick={handleDownload}
            aria-label={`Download ${title}`}
            className="rounded p-1 text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-zinc-400 dark:hover:bg-zinc-800"
          >
            <Download size={14} />
          </button>
          <button
            onClick={handleCopy}
            aria-label={`Copy ${title}`}
            className="rounded p-1 text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-zinc-400 dark:hover:bg-zinc-800"
          >
            <Copy size={14} />
          </button>
        </div>
      </div>

      <pre className="h-24 overflow-auto bg-gray-50 p-3 text-xs text-gray-600 dark:bg-zinc-950 dark:text-zinc-300">
        <code>{code || `// ${title} will appear here after running the circuit.`}</code>
      </pre>
    </div>
  );
}

export default function CodePanel({
  qasmCode,
  qiskitCode,
  onGenerateQASM,
  isGeneratingQASM,
}: CodePanelProps) {
  async function handleGenerateQASM() {
    try {
      await onGenerateQASM();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to generate QASM code.");
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-end">
        <button
          onClick={handleGenerateQASM}
          disabled={isGeneratingQASM}
          className="rounded-md bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          {isGeneratingQASM ? "Generating…" : "Generate QASM code"}
        </button>
      </div>

      <div className="flex gap-3">
        <CodeBlock title="OpenQASM" code={qasmCode} filename="circuit.qasm" mimeType="text/plain" />
        <CodeBlock title="Qiskit" code={qiskitCode} filename="circuit.py" mimeType="text/x-python" />
      </div>
    </div>
  );
}