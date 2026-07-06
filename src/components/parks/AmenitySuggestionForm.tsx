"use client";

import { useActionState, useMemo, useState } from "react";
import {
  actionGhost,
  actionPrimary,
  fieldLabel,
  fieldSelect,
  mutedTextDaylight,
} from "@/components/ui/styles";
import StatusBadge from "@/components/ui/StatusBadge";
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
  userSuggestions: Array<{
    id: string;
    amenityName: string;
    suggestionType: SuggestionType;
    status: "pending" | "approved" | "rejected";
    createdAt: string;
  }>;
}

type SuggestionType = "add" | "remove";

const initialState: AmenitySuggestionState = { error: null, success: false };

export default function AmenitySuggestionForm({
  parkSlug,
  amenities,
  verifiedAmenityIds,
  userSuggestions,
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
    <section className="mt-4 rounded-surface bg-mist/65 px-4 py-4 ring-1 ring-forest-ink/10 sm:px-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-sm font-semibold text-forest-ink">
            See an amenity that needs updating?
          </h2>
          <p className={`mt-1 text-xs ${mutedTextDaylight}`}>
            Send a quick correction for admin review.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className={`${actionGhost} px-3 py-1.5 text-xs`}
            aria-expanded={isExpanded}
            aria-controls="amenity-correction-panel"
            onClick={() => expandFor("add")}
          >
            Add missing amenity
          </button>
          <button
            type="button"
            className={`${actionGhost} px-3 py-1.5 text-xs`}
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
          className="mt-4 border-t border-forest-ink/12 pt-4"
        >
          <form
            action={action}
            className="grid gap-3 sm:grid-cols-[12rem_1fr_auto]"
          >
            <div className="grid gap-1.5">
              <label className={fieldLabel} htmlFor="suggestionType">
                Correction
              </label>
              <select
                id="suggestionType"
                name="suggestionType"
                className={fieldSelect}
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
              <label className={fieldLabel} htmlFor="amenityId">
                Amenity
              </label>
              <select
                id="amenityId"
                name="amenityId"
                className={fieldSelect}
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
                className={`w-full ${actionPrimary} sm:w-auto`}
                disabled={pending || selectableAmenities.length === 0}
              >
                {pending ? "Sending..." : "Submit"}
              </button>
            </div>
          </form>
          <p className={`mt-3 text-xs leading-5 ${mutedTextDaylight}`}>
            Suggestions only create a pending review and never change listed
            amenities immediately.
          </p>
          {state.error && (
            <p role="alert" className="mt-2 text-sm font-medium text-danger">
              {state.error}
            </p>
          )}
          {state.success && (
            <p className="mt-2 text-sm font-medium text-canopy">
              Thanks — your correction is pending admin review.
            </p>
          )}
          {userSuggestions.length > 0 && (
            <div className="mt-4 border-t border-forest-ink/12 pt-3">
              <h3 className="text-sm font-semibold text-forest-ink">
                Your suggestions for this park
              </h3>
              <ul className="mt-2 grid gap-2">
                {userSuggestions.map((suggestion) => (
                  <li
                    key={suggestion.id}
                    className="flex flex-wrap items-center justify-between gap-2 text-sm"
                  >
                    <span className="text-graphite/80">
                      {suggestion.suggestionType === "add" ? "Add" : "Remove"}{" "}
                      {suggestion.amenityName}
                    </span>
                    <span className="flex flex-wrap items-center gap-2 text-xs">
                      <StatusBadge
                        tone={
                          suggestion.status === "approved"
                            ? "success"
                            : suggestion.status === "pending"
                              ? "reward"
                              : "muted"
                        }
                      >
                        <span className="capitalize">{suggestion.status}</span>
                      </StatusBadge>
                      <time
                        className={mutedTextDaylight}
                        dateTime={suggestion.createdAt}
                      >
                        {new Intl.DateTimeFormat("en-US", {
                          dateStyle: "medium",
                          timeZone: "UTC",
                        }).format(new Date(suggestion.createdAt))}
                      </time>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
