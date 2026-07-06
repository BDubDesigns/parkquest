"use client";

import { useActionState, useMemo, useState } from "react";
import {
  ctaGhost,
  ctaPrimary,
  formInput,
  formLabel,
  mutedText,
} from "@/components/ui/styles";
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

type SuggestionType = "add" | "remove";

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
  const [isExpanded, setIsExpanded] = useState(false);
  const [suggestionType, setSuggestionType] = useState<SuggestionType>("add");

  const verifiedAmenityIdSet = useMemo(
    () => new Set(verifiedAmenityIds),
    [verifiedAmenityIds],
  );
  const missingAmenities = amenities.filter(
    (amenity) => !verifiedAmenityIdSet.has(amenity.id),
  );
  const listedAmenities = amenities.filter((amenity) =>
    verifiedAmenityIdSet.has(amenity.id),
  );
  const selectableAmenities =
    suggestionType === "add" ? missingAmenities : listedAmenities;

  function expandFor(type: SuggestionType) {
    setSuggestionType(type);
    setIsExpanded(true);
  }

  return (
    <section className="mt-4 rounded-2xl border border-emerald-800/70 bg-emerald-900/35 px-4 py-3 shadow-lg shadow-emerald-950/20 sm:px-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-sm font-semibold text-emerald-100">
            See an amenity that needs updating?
          </h2>
          <p className={`mt-1 text-xs ${mutedText}`}>
            Send a quick correction for admin review.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className={`${ctaGhost} px-3 py-1.5 text-xs`}
            aria-expanded={isExpanded}
            aria-controls="amenity-correction-panel"
            onClick={() => expandFor("add")}
          >
            Add missing amenity
          </button>
          <button
            type="button"
            className={`${ctaGhost} px-3 py-1.5 text-xs`}
            aria-expanded={isExpanded}
            aria-controls="amenity-correction-panel"
            onClick={() => expandFor("remove")}
          >
            Report incorrect amenity
          </button>
        </div>
      </div>

      {isExpanded && (
        <div
          id="amenity-correction-panel"
          className="mt-3 rounded-xl border border-emerald-700/50 bg-emerald-950/25 p-3"
        >
          <form
            action={action}
            className="grid gap-3 sm:grid-cols-[12rem_1fr_auto]"
          >
            <div className="grid gap-1.5">
              <label className={formLabel} htmlFor="suggestionType">
                Correction
              </label>
              <select
                id="suggestionType"
                name="suggestionType"
                className={formInput}
                value={suggestionType}
                onChange={(event) =>
                  setSuggestionType(event.target.value as SuggestionType)
                }
                required
              >
                <option value="add">Add amenity</option>
                <option value="remove">Remove amenity</option>
              </select>
            </div>
            <div className="grid gap-1.5">
              <label className={formLabel} htmlFor="amenityId">
                Amenity
              </label>
              <select
                id="amenityId"
                name="amenityId"
                className={formInput}
                required
                disabled={selectableAmenities.length === 0}
              >
                {selectableAmenities.length > 0 ? (
                  selectableAmenities.map((amenity) => (
                    <option key={amenity.id} value={amenity.id}>
                      {amenity.name}
                    </option>
                  ))
                ) : (
                  <option value="">
                    {suggestionType === "add"
                      ? "All amenities are listed"
                      : "No amenities are listed yet"}
                  </option>
                )}
              </select>
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                className={`min-h-10 w-full ${ctaPrimary} px-5 sm:w-auto`}
                disabled={pending || selectableAmenities.length === 0}
              >
                {pending ? "Sending..." : "Submit"}
              </button>
            </div>
          </form>
          <p className={`mt-2 text-xs ${mutedText}`}>
            Suggestions only create a pending review and never change listed
            amenities immediately.
          </p>
          {state.error && (
            <p className="mt-2 text-sm text-red-300">{state.error}</p>
          )}
          {state.success && (
            <p className="mt-2 text-sm text-emerald-200">
              Thanks — your correction is pending admin review.
            </p>
          )}
        </div>
      )}
    </section>
  );
}
