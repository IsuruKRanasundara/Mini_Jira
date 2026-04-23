"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export function Dialog({ open, onOpenChange, title, description, children, footer }: DialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" role="dialog" aria-modal="true">
      <div className="w-full max-w-lg rounded-xl border bg-card p-6 shadow-xl">
        <div className="mb-4 space-y-1">
          <h3 className="text-lg font-semibold">{title}</h3>
          {description ? <p className="text-sm text-muted-foreground">{description}</p> : null}
        </div>
        <div>{children}</div>
        <div className={cn("mt-6 flex justify-end gap-2")}>{footer}</div>
        <button
          className="absolute right-8 top-8 text-muted-foreground"
          onClick={() => onOpenChange(false)}
          aria-label="Close dialog"
          type="button"
        >
          x
        </button>
      </div>
    </div>
  );
}
