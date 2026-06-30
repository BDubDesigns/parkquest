"use client";

export default function ParksError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center gap-4 rounded-lg border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
      <h2 className="text-xl font-semibold text-slate-900">
        Something went wrong
      </h2>
      <p className="text-slate-500">Could not load parks. Please try again.</p>
      <button
        onClick={reset}
        className="rounded bg-slate-800 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-700"
      >
        Try again
      </button>
    </div>
  );
}
