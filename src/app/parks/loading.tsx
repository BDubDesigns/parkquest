export default function ParksLoading() {
  return (
    <div className="grid gap-4">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="animate-pulse rounded-lg border border-slate-200 bg-white px-5 py-4 shadow-sm"
        >
          <div className="mb-2 h-5 w-48 rounded bg-slate-200" />
          <div className="mb-1 h-4 w-32 rounded bg-slate-100" />
          <div className="mb-1 h-4 w-full rounded bg-slate-100" />
          <div className="h-4 w-3/4 rounded bg-slate-100" />
        </div>
      ))}
    </div>
  );
}
