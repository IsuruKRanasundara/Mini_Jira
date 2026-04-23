import * as React from "react";
import { cn } from "@/lib/utils";

export function DropdownMenu({ trigger, children }: { trigger: React.ReactNode; children: React.ReactNode }) {
  return (
    <details className="relative">
      <summary className="list-none cursor-pointer">{trigger}</summary>
      <div className="absolute right-0 z-20 mt-2 min-w-44 rounded-md border bg-card p-1 shadow-lg">{children}</div>
    </details>
  );
}

export function DropdownMenuItem({ className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className={cn("flex w-full items-center rounded-sm px-3 py-2 text-left text-sm hover:bg-muted", className)}
      {...props}
    />
  );
}
