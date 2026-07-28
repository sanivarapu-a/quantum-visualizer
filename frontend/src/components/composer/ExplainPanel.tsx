import { BookOpen } from "lucide-react";

interface ExplainPanelProps {
  explanation: string;
}

export default function ExplainPanel({
  explanation,
}: ExplainPanelProps) {
  return (
    <div className="flex h-36 items-center justify-center">
      <div className="max-w-xl text-center text-gray-500 dark:text-zinc-400">
        <BookOpen className="mx-auto" size={24} />

        <p className="mt-2 text-sm">
          {explanation ||
            "Run your circuit to generate a step-by-step educational explanation."}
        </p>
      </div>
    </div>
  );
}