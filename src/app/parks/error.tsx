"use client";

export default function ParksError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center gap-4 py-16 text-center">
      <h2 className="text-xl font-semibold text-neutral-900">
        Something went wrong
      </h2>
      <p className="text-neutral-500">
        Could not load parks. Please try again.
      </p>
      <button
        onClick={reset}
        className="rounded bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-neutral-700"
      >
        Try again
      </button>
    </div>
  );
}
