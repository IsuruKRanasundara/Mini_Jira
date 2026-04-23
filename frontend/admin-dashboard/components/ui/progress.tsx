export function Progress({ value }: { value: number }) {
  return (
    <div className="h-2 w-full rounded-full bg-muted">
      <div className="h-2 rounded-full bg-primary" style={{ width: `${Math.min(Math.max(value, 0), 100)}%` }} />
    </div>
  );
}
