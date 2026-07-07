"use client";

import { useState } from "react";
import { actionPrimary, actionSecondary } from "@/components/ui/styles";
import { runMigrations } from "./actions";

export function RunMigrationsButton({
  pendingCount,
}: {
  pendingCount: number;
}) {
  const [confirming, setConfirming] = useState(false);
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  async function handleRun() {
    setRunning(true);
    setResult(null);
    try {
      const res = await runMigrations();
      setResult(res.message);
      if (res.success) {
        setConfirming(false);
      }
    } catch {
      setResult("An unexpected error occurred.");
    } finally {
      setRunning(false);
    }
  }

  if (pendingCount === 0 && !result) {
    return null;
  }

  if (confirming) {
    return (
      <div className="mt-3 space-y-3">
        <p className="text-sm font-medium text-forest-ink">
          Run {pendingCount} migration{pendingCount !== 1 ? "s" : ""}? This may
          briefly lock tables.
        </p>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleRun}
            disabled={running}
            className={actionPrimary}
          >
            {running ? "Running..." : "Apply migrations"}
          </button>
          <button
            onClick={() => setConfirming(false)}
            disabled={running}
            className={actionSecondary}
          >
            Cancel
          </button>
        </div>
        {result && (
          <p className="rounded-control bg-canopy/10 px-3 py-2 text-sm font-medium text-canopy">
            {result}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="mt-3 space-y-3">
      <button onClick={() => setConfirming(true)} className={actionSecondary}>
        Run {pendingCount} migration{pendingCount !== 1 ? "s" : ""}
      </button>
      {result && (
        <p className="rounded-control bg-danger/8 px-3 py-2 text-sm font-medium text-danger">
          {result}
        </p>
      )}
    </div>
  );
}
