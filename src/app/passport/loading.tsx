export default function PassportLoading() {
  return (
    <div className="min-h-screen bg-emerald-950">
      <div className="mx-auto max-w-2xl px-4 py-8">
        <div className="mb-8 flex gap-3">
          <div className="h-4 w-10 animate-pulse rounded bg-emerald-800" />
          <div className="h-4 w-10 animate-pulse rounded bg-emerald-800" />
          <div className="h-4 w-10 animate-pulse rounded bg-emerald-800" />
        </div>
        <div className="mb-5 h-8 w-64 animate-pulse rounded bg-emerald-800" />
        <div className="mb-2 h-6 w-full animate-pulse rounded bg-emerald-800" />
        <div className="mb-6 h-4 w-48 animate-pulse rounded bg-emerald-800" />
        <div className="mb-4 h-5 w-36 animate-pulse rounded bg-emerald-800" />
        <div className="space-y-2">
          <div className="h-4 w-full animate-pulse rounded bg-emerald-800" />
          <div className="h-4 w-3/4 animate-pulse rounded bg-emerald-800" />
          <div className="h-4 w-5/6 animate-pulse rounded bg-emerald-800" />
        </div>
      </div>
    </div>
  );
}
