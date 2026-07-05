"use client";

import { useActionState } from "react";
import { ctaPrimary, mutedText } from "@/components/ui/styles";
import {
  submitAmenitySuggestion,
  type AmenitySuggestionState,
} from "@/app/parks/[slug]/actions";

interface AmenityOption {
  id: string;
  name: string;
}

interface Props {
  parkSlug: string;
  amenities: AmenityOption[];
  verifiedAmenityIds: string[];
}

const initialState: AmenitySuggestionState = { error: null, success: false };

export default function AmenitySuggestionForm({
  parkSlug,
  amenities,
  verifiedAmenityIds,
}: Props) {
  const [state, action, pending] = useActionState(
    submitAmenitySuggestion.bind(null, parkSlug),
    initialState,
  );

  return (
    <section className="mt-4 rounded-2xl border border-emerald-900/50 bg-emerald-950/20 p-5">
      <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-200">
        Suggest an amenity correction
      </h2>
      <p className={`mt-2 text-sm ${mutedText}`}>
        Suggestions are reviewed by an admin before public amenities change.
      </p>
      <form
        action={action}
        className="mt-4 grid gap-3 sm:grid-cols-[auto_1fr_auto]"
      >
        <label className="sr-only" htmlFor="suggestionType">
          Correction type
        </label>
        <select
          id="suggestionType"
          name="suggestionType"
          className="rounded-full border border-emerald-900/60 bg-stone-950 px-4 py-2 text-sm text-stone-100"
          required
        >
          <option value="add">Add amenity</option>
          <option value="remove">Remove amenity</option>
        </select>
        <label className="sr-only" htmlFor="amenityId">
          Amenity
        </label>
        <select
          id="amenityId"
          name="amenityId"
          className="rounded-full border border-emerald-900/60 bg-stone-950 px-4 py-2 text-sm text-stone-100"
          required
        >
          {amenities.map((amenity) => (
            <option key={amenity.id} value={amenity.id}>
              {amenity.name}
              {verifiedAmenityIds.includes(amenity.id)
                ? " (currently listed)"
                : ""}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className={`min-h-11 ${ctaPrimary}`}
          disabled={pending}
        >
          {pending ? "Sending..." : "Submit"}
        </button>
      </form>
      {state.error && (
        <p className="mt-3 text-sm text-red-300">{state.error}</p>
      )}
      {state.success && (
        <p className="mt-3 text-sm text-emerald-200">
          Thanks — your correction is pending admin review.
        </p>
      )}
    </section>
  );
}
