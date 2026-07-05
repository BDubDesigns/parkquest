"use client";

import { useActionState } from "react";
import { reviewAmenitySuggestion, type ReviewSuggestionState } from "./actions";

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
          className="rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-emerald-950"
        >
          Approve
        </button>
      </form>
      <form action={rejectAction}>
        <input type="hidden" name="suggestionId" value={suggestionId} />
        <button
          disabled={approving || rejecting}
          className="rounded-full border border-red-400/60 px-4 py-2 text-sm font-semibold text-red-200"
        >
          Reject
        </button>
      </form>
      {error && <p className="text-sm text-red-300">{error}</p>}
    </div>
  );
}
