import { cn } from "@/lib/utils";

export function Alert({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("rounded-md border border-warning/30 bg-warning/10 p-4 text-sm text-foreground", className)}>{children}</div>;
}
