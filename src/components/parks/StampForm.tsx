"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { stampPark, type StampState } from "@/app/parks/[slug]/actions";

const initialState: StampState = { error: null, success: false };

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="min-h-11 rounded-full bg-amber-300 px-6 py-2 text-sm font-bold text-emerald-950 transition-colors hover:bg-amber-200 disabled:opacity-50"
    >
      {pending ? "Saving..." : "Save Stamp"}
    </button>
  );
}

interface Props {
  parkSlug: string;
  alreadyStamped?: boolean;
}

export default function StampForm({ parkSlug, alreadyStamped }: Props) {
  const [expanded, setExpanded] = useState(false);
  const stampAction = stampPark.bind(null, parkSlug);
  const [state, formAction] = useActionState(stampAction, initialState);

  return (
    <div>
      <button
        onClick={() => setExpanded(!expanded)}
        aria-expanded={expanded}
        className={`min-h-11 rounded-full py-2 text-sm font-bold transition-colors ${
          expanded
            ? "border border-emerald-600/40 px-4 text-emerald-200/80 hover:bg-emerald-900/60"
            : alreadyStamped
              ? "border border-emerald-400/60 px-6 text-white hover:bg-emerald-900"
              : "bg-amber-300 px-6 text-emerald-950 hover:bg-amber-200"
        }`}
      >
        {expanded
          ? "Cancel"
          : alreadyStamped
            ? "Stamp again!"
            : "Stamp this park!"}
      </button>

      {expanded && (
        <form action={formAction} className="mt-4 space-y-4">
          {state.error && (
            <p className="rounded-md bg-red-900/30 px-3 py-2 text-sm text-red-300">
              {state.error}
            </p>
          )}

          <fieldset>
            <legend className="text-sm font-medium text-emerald-200">
              Did you feel safe for the entirety of your visit?
            </legend>
            <div className="mt-2 flex gap-6">
              <label className="flex min-h-11 items-center gap-2 text-sm text-emerald-100/80">
                <input
                  type="radio"
                  name="feltSafe"
                  value="yes"
                  required
                  className="size-5 accent-amber-300"
                />
                Yes
              </label>
              <label className="flex min-h-11 items-center gap-2 text-sm text-emerald-100/80">
                <input
                  type="radio"
                  name="feltSafe"
                  value="no"
                  required
                  className="size-5 accent-amber-300"
                />
                No
              </label>
            </div>
          </fieldset>

          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium text-emerald-200">
              Rating (optional)
            </span>
            <select
              name="rating"
              defaultValue=""
              className="min-h-11 w-full rounded-md border border-emerald-600/60 bg-emerald-900/40 px-3 py-2 text-sm text-white focus:border-emerald-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300/50 sm:w-48"
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
            <span className="font-medium text-emerald-200">
              What do you want to remember about this visit? (optional)
            </span>
            <textarea
              name="memory"
              maxLength={1000}
              rows={3}
              className="rounded-md border border-emerald-600/60 bg-emerald-900/40 px-3 py-2 text-sm text-white placeholder:text-emerald-300/50 focus:border-emerald-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300/50"
              placeholder="A favorite moment, who came along, what you saw..."
            />
            <span className="text-xs text-emerald-300/60">
              Up to 1000 characters. Your memories are private to your family.
            </span>
          </label>

          <div className="flex gap-3">
            <SubmitButton />
            <button
              type="button"
              onClick={() => setExpanded(false)}
              className="min-h-11 rounded-full border border-emerald-600/40 px-4 py-2 text-sm font-medium text-emerald-200/80 transition-colors hover:bg-emerald-900/60"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
