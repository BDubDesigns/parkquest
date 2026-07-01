"use client";

export default function ParksError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center gap-4 rounded-2xl border border-emerald-700/70 bg-emerald-900/70 px-6 py-16 text-center shadow-2xl shadow-emerald-950/40">
      <h2 className="text-xl font-bold tracking-tight text-white">
        Something went wrong
      </h2>
      <p className="text-emerald-200/80">
        Could not load parks. Please try again.
      </p>
      <button
        onClick={reset}
        className="min-h-11 rounded-full bg-amber-300 px-6 py-2 text-sm font-bold text-emerald-950 transition-colors hover:bg-amber-200"
      >
        Try again
      </button>
    </div>
  );
}
