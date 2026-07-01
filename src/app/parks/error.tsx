"use client";

import { card, ctaPrimary, mutedText } from "@/components/ui/styles";

export default function ParksError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div
      className={`flex flex-col items-center gap-4 px-6 py-16 text-center ${card}`}
    >
      <h2 className="text-xl font-bold tracking-tight text-white">
        Something went wrong
      </h2>
      <p className={mutedText}>Could not load parks. Please try again.</p>
      <button onClick={reset} className={`min-h-11 ${ctaPrimary}`}>
        Try again
      </button>
    </div>
  );
}
