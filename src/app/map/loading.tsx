export default function MapLoading() {
  return (
    <div className="min-h-screen bg-emerald-950">
      <div className="mx-auto max-w-5xl px-4 py-8">
        <div className="h-8 w-16 animate-pulse rounded bg-emerald-800" />
        <div className="mt-2 h-9 w-24 animate-pulse rounded bg-emerald-800" />
        <div className="mt-6 h-[600px] animate-pulse rounded-2xl bg-emerald-900/60" />
      </div>
    </div>
  );
}
