"use client";

import {
  actionPrimary,
  mutedTextDaylight,
  surfacePrimary,
} from "@/components/ui/styles";

export default function ParksError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div
      className={`flex flex-col items-center gap-4 px-6 py-16 text-center ${surfacePrimary}`}
    >
      <h2 className="text-xl font-bold tracking-tight text-forest-ink">
        Something went wrong
      </h2>
      <p className={mutedTextDaylight}>
        Could not load parks. Please try again.
      </p>
      <button onClick={reset} className={actionPrimary}>
        Try again
      </button>
    </div>
  );
}
