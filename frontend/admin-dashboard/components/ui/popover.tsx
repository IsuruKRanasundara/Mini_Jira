"use client";

export function Popover({ trigger, content }: { trigger: React.ReactNode; content: React.ReactNode }) {
  return (
    <details className="relative inline-block">
      <summary className="list-none cursor-pointer">{trigger}</summary>
      <div className="absolute z-20 mt-2 w-64 rounded-md border bg-card p-3 shadow-lg">{content}</div>
    </details>
  );
}
