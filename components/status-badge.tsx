type StatusBadgeProps = {
  status: string;
  className?: string;
};

const labels: Record<string, string> = {
  passed: "PASSED",
  failed: "FAILED",
  absent: "ABSENT",
};

export function StatusBadge({ status, className = "" }: StatusBadgeProps) {
  const isPassed = status === "passed";
  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-md border px-2 py-1 font-mono text-[9px] uppercase tracking-[0.16em] ${
        isPassed
          ? "border-accent/30 bg-accent/10 text-accent"
          : "border-line bg-tile text-muted"
      } ${className}`}
    >
      {labels[status] ?? status.toUpperCase()}
    </span>
  );
}
