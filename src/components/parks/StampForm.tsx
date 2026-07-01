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
      className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
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
        className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
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
            <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
              {state.error}
            </p>
          )}

          <fieldset>
            <legend className="text-sm font-medium text-slate-700">
              Did you feel safe for the entirety of your visit?
            </legend>
            <div className="mt-2 flex gap-6">
              <label className="flex items-center gap-1.5 text-sm text-slate-600">
                <input
                  type="radio"
                  name="feltSafe"
                  value="yes"
                  required
                  className="accent-slate-700"
                />
                Yes
              </label>
              <label className="flex items-center gap-1.5 text-sm text-slate-600">
                <input
                  type="radio"
                  name="feltSafe"
                  value="no"
                  required
                  className="accent-slate-700"
                />
                No
              </label>
            </div>
          </fieldset>

          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium text-slate-700">
              Rating (optional)
            </span>
            <select
              name="rating"
              defaultValue=""
              className="w-48 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-slate-500 focus:outline-none"
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
            <span className="font-medium text-slate-700">
              What do you want to remember about this visit? (optional)
            </span>
            <textarea
              name="memory"
              maxLength={1000}
              rows={3}
              className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-500 focus:outline-none"
              placeholder="A favorite moment, who came along, what you saw..."
            />
            <span className="text-xs text-slate-400">
              Up to 1000 characters. Your memories are private to your family.
            </span>
          </label>

          <div className="flex gap-3">
            <SubmitButton />
            <button
              type="button"
              onClick={() => setExpanded(false)}
              className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
