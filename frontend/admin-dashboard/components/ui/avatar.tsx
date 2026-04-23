export function Avatar({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-primary/20 text-xs font-bold text-primary">
      {initials}
    </div>
  );
}
