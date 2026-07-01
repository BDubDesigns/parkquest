export default function ParksLoading() {
  return (
    <div className="grid gap-4">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="animate-pulse rounded-2xl border border-emerald-700/70 bg-emerald-900/70 px-5 py-4 shadow-2xl shadow-emerald-950/40"
        >
          <div className="mb-2 h-5 w-48 rounded bg-emerald-800" />
          <div className="mb-1 h-4 w-32 rounded bg-emerald-800/60" />
          <div className="mb-1 h-4 w-full rounded bg-emerald-800/60" />
          <div className="h-4 w-3/4 rounded bg-emerald-800/60" />
        </div>
      ))}
    </div>
  );
}
