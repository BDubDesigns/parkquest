export default function MapLoading() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-5xl px-4 py-8">
        <div className="h-8 w-16 animate-pulse rounded bg-slate-200" />
        <div className="mt-2 h-9 w-24 animate-pulse rounded bg-slate-200" />
        <div className="mt-6 h-[600px] animate-pulse rounded-lg bg-slate-200" />
      </div>
    </div>
  );
}
