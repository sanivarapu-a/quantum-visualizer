"use client";

import { CircleDot } from "lucide-react";

interface BlochSpherePanelProps {
  qubitCount: number;
}

export default function BlochSpherePanel({ qubitCount }: BlochSpherePanelProps) {
  return (
    <div className="flex h-full flex-wrap content-start gap-3 overflow-y-auto px-6 pb-6">
      {Array.from({ length: qubitCount }, (_, index) => (
        <div
          key={index}
          className="flex h-28 w-28 shrink-0 flex-col items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/[0.02]"
        >
          <CircleDot className="h-6 w-6 text-gray-600" aria-hidden="true" />
          <span className="font-mono text-xs text-gray-500">q{index}</span>
        </div>
      ))}
    </div>
  );
}