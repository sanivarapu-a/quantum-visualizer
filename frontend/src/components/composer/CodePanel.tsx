import { Copy } from "lucide-react";

interface CodePanelProps {
  qasmCode: string;
  qiskitCode: string;
}

interface CodeBlockProps {
  title: string;
  code: string;
}

function CodeBlock({
  title,
  code,
}: CodeBlockProps) {
  function handleCopy() {
    // TODO: implement clipboard copying.
    console.log("onCopy", title, code);
  }

  return (
    <div className="min-w-0 flex-1 overflow-hidden rounded-md border border-gray-200 dark:border-zinc-700">
      <div className="flex items-center justify-between border-b border-gray-200 px-3 py-2 dark:border-zinc-700">
        <span className="text-xs font-semibold">
          {title}
        </span>

        <button
          onClick={handleCopy}
          aria-label={`Copy ${title}`}
          className="rounded p-1 text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-zinc-400 dark:hover:bg-zinc-800"
        >
          <Copy size={14} />
        </button>
      </div>

      <pre className="h-24 overflow-auto bg-gray-50 p-3 text-xs text-gray-600 dark:bg-zinc-950 dark:text-zinc-300">
        <code>
          {code ||
            `// ${title} will appear here after running the circuit.`}
        </code>
      </pre>
    </div>
  );
}

export default function CodePanel({
  qasmCode,
  qiskitCode,
}: CodePanelProps) {
  return (
    <div className="flex gap-3">
      <CodeBlock
        title="OpenQASM"
        code={qasmCode}
      />

      <CodeBlock
        title="Qiskit"
        code={qiskitCode}
      />
    </div>
  );
}