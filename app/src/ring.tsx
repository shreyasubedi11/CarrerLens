export function ScoreRing({ score }: { score: number }) {
  const r = 40,
    c = 2 * Math.PI * r;
  return (
    <svg width="100" height="100" viewBox="0 0 100 100" className="-rotate-90">
      <circle
        cx="50"
        cy="50"
        r={r}
        fill="none"
        stroke="rgba(255,255,255,0.06)"
        strokeWidth="8"
      />
      <circle
        cx="50"
        cy="50"
        r={r}
        fill="none"
        stroke="url(#sg)"
        strokeWidth="8"
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={c - (score / 100) * c}
        className="transition-all duration-700"
      />
      <defs>
        <linearGradient id="sg" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#6366f1" />
          <stop offset="100%" stopColor="#34d399" />
        </linearGradient>
      </defs>
    </svg>
  );
}
