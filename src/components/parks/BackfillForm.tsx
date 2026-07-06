"use client";

import { useActionState, useState } from "react";
import { backfillPark, type BackfillState } from "@/app/parks/[slug]/actions";
import {
  actionGhost,
  actionPrimary,
  dividerSubtle,
  fieldInput,
  fieldLabel,
  fieldSelect,
  mutedText,
} from "@/components/ui/styles";

const initialState: BackfillState = { error: null, success: false };

interface Props {
  parkSlug: string;
}

export default function BackfillForm({ parkSlug }: Props) {
  const [expanded, setExpanded] = useState(false);
  const backfillAction = backfillPark.bind(null, parkSlug);
  const [state, formAction] = useActionState(backfillAction, initialState);

  if (state.success) {
    return (
      <div className="mt-4 rounded-control bg-canopy/10 px-3 py-2 text-sm font-medium text-canopy">
        Park marked as previously visited.
      </div>
    );
  }

  return (
    <div className="mt-4">
      {state.error && (
        <p
          role="alert"
          className="mb-3 rounded-control bg-danger/8 px-3 py-2 text-sm font-medium text-danger"
        >
          {state.error}
        </p>
      )}

      {!expanded ? (
        <button onClick={() => setExpanded(true)} className={actionGhost}>
          Mark as previously visited
        </button>
      ) : (
        <form action={formAction} className="space-y-4">
          <p className={`text-sm leading-6 ${mutedText}`}>
            Record that your family visited this park before using ParkQuest.
            This will not award Adventure Points or complete quests.
          </p>

          <div className="space-y-3">
            <label className="flex flex-col gap-1 text-sm">
              <span className={fieldLabel}>Visit date (optional)</span>
              <input
                type="date"
                name="visitDate"
                className={`w-full ${fieldInput} sm:w-56`}
              />
              <span className={`text-xs ${mutedText}`}>
                If not provided, today&apos;s date will be used.
              </span>
            </label>

            <label className="flex flex-col gap-1 text-sm">
              <span className={fieldLabel}>Rating (optional)</span>
              <select
                name="rating"
                defaultValue=""
                className={`w-full ${fieldSelect} sm:w-48`}
              >
                <option value="">No rating</option>
                <option value="5">&#9733;&#9733;&#9733;&#9733;&#9733;</option>
                <option value="4">&#9733;&#9733;&#9733;&#9733;&#9734;</option>
                <option value="3">&#9733;&#9733;&#9733;&#9734;&#9734;</option>
                <option value="2">&#9733;&#9733;&#9734;&#9734;&#9734;</option>
                <option value="1">&#9733;&#9734;&#9734;&#9734;&#9734;</option>
              </select>
            </label>

            <label className="flex flex-col gap-1 text-sm">
              <span className={fieldLabel}>
                Private memory or note (optional)
              </span>
              <textarea
                name="memory"
                maxLength={1000}
                rows={3}
                className={fieldInput}
                placeholder="A favorite moment, who came along, what you saw..."
              />
              <span className={`text-xs ${mutedText}`}>
                Up to 1000 characters. Private to your family.
              </span>
            </label>
          </div>

          <hr className={dividerSubtle} />

          <div className="flex flex-wrap gap-3">
            <button type="submit" className={actionPrimary}>
              Mark as previously visited
            </button>
            <button
              type="button"
              onClick={() => setExpanded(false)}
              className={actionGhost}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
