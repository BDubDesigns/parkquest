"use client";

import { useActionState } from "react";
import { reviewAmenitySuggestion, type ReviewSuggestionState } from "./actions";
import { actionGhost } from "@/components/ui/styles";

const initialState: ReviewSuggestionState = { error: null, success: false };

export default function ReviewButtons({
  suggestionId,
}: {
  suggestionId: string;
}) {
  const [approveState, approveAction, approving] = useActionState(
    reviewAmenitySuggestion.bind(null, "approve"),
    initialState,
  );
  const [rejectState, rejectAction, rejecting] = useActionState(
    reviewAmenitySuggestion.bind(null, "reject"),
    initialState,
  );
  const error = approveState.error ?? rejectState.error;
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
      <form action={approveAction}>
        <input type="hidden" name="suggestionId" value={suggestionId} />
        <button
          disabled={approving || rejecting}
          className="inline-flex min-h-11 items-center rounded-control bg-canopy px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-forest-ink disabled:cursor-not-allowed disabled:opacity-55 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-lake-blue"
        >
          Approve
        </button>
      </form>
      <form action={rejectAction}>
        <input type="hidden" name="suggestionId" value={suggestionId} />
        <button
          disabled={approving || rejecting}
          className={`${actionGhost} text-danger hover:bg-danger/8`}
        >
          Reject
        </button>
      </form>
      {error && (
        <p role="alert" className="text-sm font-medium text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
