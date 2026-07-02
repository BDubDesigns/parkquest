"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { stampPark, type StampState } from "@/app/parks/[slug]/actions";
import {
  ctaGhost,
  ctaPrimary,
  ctaSecondary,
  eyebrow,
  formInput,
  formLabel,
} from "@/components/ui/styles";
import ParkQuestStamp from "./ParkQuestStamp";

const initialState: StampState = { error: null, success: false };

const STAMP_PALETTE = [
  { value: "#064e3b", label: "Emerald green" },
  { value: "#d97706", label: "Amber gold" },
  { value: "#be185d", label: "Berry magenta" },
  { value: "#1d4ed8", label: "Lake blue" },
  { value: "#78350f", label: "Warm brown" },
];

function formatStampDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function makeSerialNumber(parkSlug: string): string {
  const code = parkSlug.replace(/-/g, "").toUpperCase().slice(0, 6);
  const suffix = String(parkSlug.length).padStart(3, "0");
  return `PQ-${code}-${suffix}`;
}

function StampIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M4 21h16v-2H4v2zm4-4h8c.55 0 1.05-.3 1.35-.78l2.65-4.42c.35-.58.1-1.3-.55-1.55l-1.45-.55V7c0-1.66-1.34-3-3-3H9C7.34 4 6 5.34 6 7v3.7l-1.45.55c-.65.25-.9.97-.55 1.55l2.65 4.42c.3.48.8.78 1.35.78z" />
    </svg>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className={`inline-flex min-h-11 items-center justify-center gap-2 ${ctaPrimary} disabled:opacity-50`}
    >
      <StampIcon className="size-5" />
      {pending ? "Stamping..." : "Stamp it!"}
    </button>
  );
}

interface Props {
  parkSlug: string;
  parkName: string;
  alreadyStamped?: boolean;
}

export default function StampForm({
  parkSlug,
  parkName,
  alreadyStamped,
}: Props) {
  const [expanded, setExpanded] = useState(false);
  const [stampColor, setStampColor] = useState(STAMP_PALETTE[0].value);
  const [rotation, setRotation] = useState(0);
  const [stampKey, setStampKey] = useState(0);
  const [stampDate] = useState(() => formatStampDate(new Date()));
  const stampAction = stampPark.bind(null, parkSlug);
  const [state, formAction] = useActionState(stampAction, initialState);

  const serialNumber = makeSerialNumber(parkSlug);

  function handleSubmit() {
    setStampKey((k) => k + 1);
  }

  return (
    <div>
      <button
        onClick={() => setExpanded(!expanded)}
        aria-expanded={expanded}
        className={`min-h-11 text-sm font-bold transition-colors ${
          expanded ? ctaGhost : alreadyStamped ? ctaSecondary : ctaPrimary
        }`}
      >
        {expanded
          ? "Cancel"
          : alreadyStamped
            ? "Stamp again!"
            : "Stamp this park!"}
      </button>

      {expanded && (
        <form
          action={formAction}
          onSubmit={handleSubmit}
          className="mt-4 space-y-4"
        >
          {state.error && (
            <p className="rounded-md bg-red-900/30 px-3 py-2 text-sm text-red-300">
              {state.error}
            </p>
          )}

          <div className="space-y-4">
            <div className="text-center">
              <span className={eyebrow}>Stamp Preview</span>
              <div className="mt-3 flex justify-center">
                <div key={stampKey} className="animate-stamp-land">
                  <ParkQuestStamp
                    topText="ParkQuest"
                    bottomText="Family Park Passport"
                    centerText={parkName}
                    date={stampDate}
                    serialNumber={serialNumber}
                    color={stampColor}
                    rotation={rotation}
                    size={240}
                  />
                </div>
              </div>
            </div>

            <fieldset>
              <legend className={formLabel}>Ink color</legend>
              <div className="mt-2 flex flex-wrap gap-3">
                {STAMP_PALETTE.map((color) => (
                  <button
                    key={color.value}
                    type="button"
                    onClick={() => setStampColor(color.value)}
                    aria-label={color.label}
                    aria-pressed={stampColor === color.value}
                    className={`size-11 rounded-full border-2 transition-transform focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300/70 ${
                      stampColor === color.value
                        ? "scale-110 border-white"
                        : "border-transparent hover:scale-105"
                    }`}
                    style={{ backgroundColor: color.value }}
                  />
                ))}
              </div>
            </fieldset>

            <fieldset>
              <legend className={formLabel}>Tilt</legend>
              <div className="mt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setRotation((r) => Math.max(-15, r - 5))}
                  disabled={rotation <= -15}
                  aria-label="Rotate stamp left 5 degrees"
                  className={`flex min-h-11 min-w-11 items-center justify-center rounded-full text-lg font-bold ${ctaGhost} disabled:opacity-40`}
                >
                  −
                </button>
                <output
                  className="min-w-[3ch] text-center text-sm font-semibold text-emerald-100"
                  aria-live="polite"
                >
                  {rotation}°
                </output>
                <button
                  type="button"
                  onClick={() => setRotation((r) => Math.min(15, r + 5))}
                  disabled={rotation >= 15}
                  aria-label="Rotate stamp right 5 degrees"
                  className={`flex min-h-11 min-w-11 items-center justify-center rounded-full text-lg font-bold ${ctaGhost} disabled:opacity-40`}
                >
                  +
                </button>
              </div>
            </fieldset>
          </div>

          <fieldset>
            <legend className={formLabel}>
              Did you feel safe for the entirety of your visit?
            </legend>
            <div className="mt-2 flex gap-6">
              <label className="flex min-h-11 items-center gap-2 text-sm text-stone-300/80">
                <input
                  type="radio"
                  name="feltSafe"
                  value="yes"
                  required
                  className="size-5 accent-amber-300"
                />
                Yes
              </label>
              <label className="flex min-h-11 items-center gap-2 text-sm text-stone-300/80">
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
            <span className={formLabel}>Rating (optional)</span>
            <select
              name="rating"
              defaultValue=""
              className={`min-h-11 w-full ${formInput} sm:w-48`}
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
            <span className={formLabel}>
              What do you want to remember about this visit? (optional)
            </span>
            <textarea
              name="memory"
              maxLength={1000}
              rows={3}
              className={formInput}
              placeholder="A favorite moment, who came along, what you saw..."
            />
            <span className="text-xs text-stone-400/70">
              Up to 1000 characters. Your memories are private to your family.
            </span>
          </label>

          <div className="flex gap-3">
            <SubmitButton />
            <button
              type="button"
              onClick={() => setExpanded(false)}
              className={`min-h-11 ${ctaGhost}`}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
