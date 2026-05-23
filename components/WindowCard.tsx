import type { ReactNode } from "react";

export function WindowCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="overflow-hidden rounded-md border border-gray-200 bg-white shadow-[6px_6px_0_0_rgba(229,231,235,0.9)]">
      <div className="flex items-center gap-1.5 border-b border-gray-200 bg-gray-50 px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-gray-200" />
        <span className="h-2.5 w-2.5 rounded-full bg-gray-200" />
        <span className="h-2.5 w-2.5 rounded-full bg-gray-200" />
        <span className="ml-3 font-mono text-xs text-gray-400">{title}</span>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}
