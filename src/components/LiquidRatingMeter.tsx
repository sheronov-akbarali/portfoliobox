export default function LiquidRatingMeter({
  score,
  size = "md",
}: {
  score: number;
  size?: "sm" | "md";
}) {
  const pct = Math.max(0, Math.min(100, (score / 5) * 100));
  const height = size === "sm" ? "h-2" : "h-3.5";
  const width = size === "sm" ? "w-16" : "w-full";

  return (
    <div
      className={`relative ${width} ${height} shrink-0 overflow-hidden rounded-full`}
      style={{
        background: "var(--glass-bg-strong)",
        border: "1px solid var(--glass-border)",
      }}
      role="img"
      aria-label={`${score.toFixed(1)} / 5`}
    >
      <div
        className="liquid-fill absolute inset-y-0 left-0 rounded-full"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
