"use client";

import { useActionState, useRef, useState } from "react";
import { stampPark, type StampState } from "@/app/parks/[slug]/actions";
import {
  actionGhost,
  actionPrimary,
  actionSecondary,
  dividerSubtleDaylight,
  fieldInput,
  fieldLabel,
  fieldSelect,
} from "@/components/ui/styles";
import ParkQuestStamp from "./ParkQuestStamp";
import PassportSurface from "./PassportSurface";

const initialState: StampState = { error: null, info: null, success: false };

const STAMP_PALETTE = [
  { value: "#12372a", label: "Forest ink" },
  { value: "#b84b3c", label: "Stamp red" },
  { value: "#2e7191", label: "Lake blue" },
  { value: "#1f5a42", label: "Canopy green" },
  { value: "#1e2924", label: "Graphite" },
];

type StampPhase =
  | "idle"
  | "stamper-active"
  | "stamper-dragging"
  | "stamper-pressed"
  | "imprint-revealed"
  | "form-submitting";

const STAMP_THRESHOLD = 80;
const MAX_DRAG_Y = 150;

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
  const formRef = useRef<HTMLFormElement>(null);
  const startYRef = useRef(0);
  const reducedMotionRef = useRef(
    typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );

  const [expanded, setExpanded] = useState(false);
  const [stampColor, setStampColor] = useState(STAMP_PALETTE[0].value);
  const [rotation, setRotation] = useState(0);
  const [placement] = useState<"left" | "center" | "right">("center");
  const [dragY, setDragY] = useState(0);
  const [phase, setPhase] = useState<StampPhase>("idle");
  const [showImprint, setShowImprint] = useState(false);
  const [stampDate] = useState(() => formatStampDate(new Date()));
  const stampAction = stampPark.bind(null, parkSlug);
  const [state, formAction] = useActionState(stampAction, initialState);

  const serialNumber = makeSerialNumber(parkSlug);

  if (state.error && phase === "form-submitting") {
    setPhase("idle");
    setDragY(0);
    setShowImprint(false);
  }

  const isStamping =
    phase !== "idle" &&
    phase !== "stamper-active" &&
    phase !== "stamper-dragging";

  function completeStamp() {
    if (isStamping) return;
    if (!formRef.current?.reportValidity()) return;

    setPhase("stamper-pressed");
    const reducedMotion = reducedMotionRef.current;

    window.setTimeout(
      () => {
        setShowImprint(true);
        setPhase("imprint-revealed");

        window.setTimeout(
          () => {
            setPhase("form-submitting");
            formRef.current?.requestSubmit();
          },
          reducedMotion ? 50 : 450,
        );
      },
      reducedMotion ? 0 : 160,
    );
  }

  function handlePointerDown(e: React.PointerEvent<HTMLDivElement>) {
    if (isStamping) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    startYRef.current = e.clientY;
    setPhase("stamper-active");
  }

  function handlePointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (phase !== "stamper-active" && phase !== "stamper-dragging") return;
    const dy = Math.max(0, Math.min(MAX_DRAG_Y, e.clientY - startYRef.current));
    setDragY(dy);
    if (dy > 4) setPhase("stamper-dragging");
  }

  function handlePointerUp(e: React.PointerEvent<HTMLDivElement>) {
    e.currentTarget.releasePointerCapture(e.pointerId);
    if (phase === "stamper-dragging" && dragY > STAMP_THRESHOLD) {
      completeStamp();
    } else {
      setPhase("idle");
      setDragY(0);
    }
  }

  function handleCancel() {
    setExpanded(false);
    setPhase("idle");
    setDragY(0);
    setShowImprint(false);
  }
  const stamperTranslateY = Math.max(-72, dragY * 0.7 - 72);

  return (
    <div>
      <button
        onClick={() => setExpanded(!expanded)}
        aria-expanded={expanded}
        className={`text-sm font-bold transition-colors ${
          expanded
            ? actionGhost
            : alreadyStamped
              ? actionSecondary
              : actionPrimary
        }`}
      >
        {expanded
          ? "Cancel"
          : alreadyStamped
            ? "Stamp again!"
            : "Stamp this park!"}
      </button>

      {expanded && (
        <form ref={formRef} action={formAction} className="mt-4 space-y-5">
          {state.error && (
            <p
              role="alert"
              className="rounded-control bg-danger/8 px-3 py-2 text-sm font-medium text-danger"
            >
              {state.error}
            </p>
          )}
          {state.info && (
            <p className="rounded-control bg-trail-gold/18 px-3 py-2 text-sm font-medium text-forest-ink">
              {state.info}
            </p>
          )}

          {/* Step 1: Safety question (required before stamping) */}
          <fieldset>
            <legend className={fieldLabel}>
              Did you feel safe for the entirety of your visit?
            </legend>
            <div className="mt-2 flex gap-6">
              <label className="flex min-h-11 items-center gap-2 text-sm text-graphite/80">
                <input
                  type="radio"
                  name="feltSafe"
                  value="yes"
                  required
                  className="size-5 accent-canopy"
                />
                Yes
              </label>
              <label className="flex min-h-11 items-center gap-2 text-sm text-graphite/80">
                <input
                  type="radio"
                  name="feltSafe"
                  value="no"
                  required
                  className="size-5 accent-canopy"
                />
                No
              </label>
            </div>
          </fieldset>

          {/* Step 2: Passport stamp stage */}
          <section aria-label="Stamp your passport">
            <div className="relative">
              <PassportSurface
                placement={placement}
                showTarget={!showImprint && phase !== "form-submitting"}
              >
                {showImprint && (
                  <div
                    className="animate-imprint-reveal"
                    style={
                      {
                        "--rotation": `${rotation}deg`,
                      } as React.CSSProperties
                    }
                  >
                    <ParkQuestStamp
                      topText="ParkQuest"
                      bottomText="Family Park Passport"
                      centerText={parkName}
                      date={stampDate}
                      serialNumber={serialNumber}
                      color={stampColor}
                      rotation={rotation}
                      size={160}
                    />
                  </div>
                )}
              </PassportSurface>

              {/* Impact ring (thud overlay) */}
              {phase === "stamper-pressed" && (
                <div
                  className="stamp-impact-ring pointer-events-none absolute inset-0 rounded-surface"
                  aria-hidden="true"
                />
              )}

              {/* Physical stamper */}
              {!isStamping && !showImprint && (
                <div
                  className="stamper absolute left-1/2 z-10"
                  data-phase={phase}
                  role="button"
                  tabIndex={0}
                  aria-label="Rubber stamper — drag down to stamp your passport"
                  style={{
                    top: "46%",
                    transform: `translate(-50%, -100%) translateY(${stamperTranslateY}px) rotate(${rotation}deg)`,
                    transition:
                      phase === "stamper-dragging"
                        ? "filter 120ms ease-out"
                        : "transform 200ms ease-out, filter 150ms ease-out",
                  }}
                  onPointerDown={handlePointerDown}
                  onPointerMove={handlePointerMove}
                  onPointerUp={handlePointerUp}
                  onPointerCancel={handlePointerUp}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      completeStamp();
                    }
                  }}
                >
                  <div className="stamper-handle" />
                  <div className="stamper-neck" />
                  <div className="stamper-base">
                    <div
                      className="stamper-ink-ring"
                      style={{ borderColor: stampColor }}
                    />
                  </div>
                </div>
              )}
            </div>

            <p className="mt-2 text-center text-xs text-graphite/65">
              {phase === "stamper-dragging"
                ? "Keep pulling down..."
                : phase === "stamper-active"
                  ? "Now drag down to stamp!"
                  : "Drag the stamper down or use the button below"}
            </p>
          </section>

          {/* Step 3: Stamp controls (color, tilt) */}
          <div className="space-y-4">
            <fieldset>
              <legend className={fieldLabel}>Ink color</legend>
              <div className="mt-2 flex flex-wrap gap-3">
                {STAMP_PALETTE.map((color) => (
                  <button
                    key={color.value}
                    type="button"
                    onClick={() => setStampColor(color.value)}
                    aria-label={color.label}
                    aria-pressed={stampColor === color.value}
                    className={`size-11 rounded-full border-2 transition-transform focus:outline-none focus-visible:ring-3 focus-visible:ring-lake-blue focus-visible:ring-offset-2 focus-visible:ring-offset-white ${
                      stampColor === color.value
                        ? "scale-110 border-forest-ink"
                        : "border-transparent hover:scale-105"
                    }`}
                    style={{ backgroundColor: color.value }}
                  />
                ))}
              </div>
            </fieldset>

            <fieldset>
              <legend className={fieldLabel}>Tilt your stamp</legend>
              <div className="mt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setRotation((r) => Math.max(-15, r - 1))}
                  disabled={rotation <= -15}
                  aria-label="Rotate stamp left 1 degree"
                  className={`flex min-h-11 min-w-11 items-center justify-center rounded-full text-lg font-bold ${actionGhost} disabled:opacity-40`}
                >
                  −
                </button>
                <input
                  type="range"
                  min="-15"
                  max="15"
                  step="1"
                  value={rotation}
                  onChange={(e) => setRotation(Number(e.target.value))}
                  aria-label="Stamp tilt"
                  className="stamp-slider h-2 flex-1"
                />
                <button
                  type="button"
                  onClick={() => setRotation((r) => Math.min(15, r + 1))}
                  disabled={rotation >= 15}
                  aria-label="Rotate stamp right 1 degree"
                  className={`flex min-h-11 min-w-11 items-center justify-center rounded-full text-lg font-bold ${actionGhost} disabled:opacity-40`}
                >
                  +
                </button>
                <output
                  className="min-w-[3.5ch] text-center text-sm font-semibold text-forest-ink"
                  aria-live="polite"
                >
                  {rotation}°
                </output>
              </div>
            </fieldset>
          </div>

          {/* Step 4: Optional rating and memory */}
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
              What do you want to remember about this visit? (optional)
            </span>
            <textarea
              name="memory"
              maxLength={1000}
              rows={3}
              className={fieldInput}
              placeholder="A favorite moment, who came along, what you saw..."
            />
            <span className="text-xs text-graphite/65">
              Up to 1000 characters. Your memories are private to your family.
            </span>
          </label>

          {/* Step 5: Stamp action */}
          <hr className={dividerSubtleDaylight} />
          <div className="space-y-3">
            <p className={fieldLabel}>Ready to stamp?</p>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={completeStamp}
                disabled={isStamping || state.success}
                className={`inline-flex items-center gap-2 ${actionPrimary}`}
              >
                <StampIcon className="size-5" />
                {state.success
                  ? "Stamped!"
                  : phase === "form-submitting"
                    ? "Saving..."
                    : isStamping
                      ? "Stamping..."
                      : "Stamp it!"}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className={actionGhost}
              >
                Cancel
              </button>
            </div>
          </div>

          {/* Live region for screen readers */}
          <div aria-live="polite" className="sr-only">
            {phase === "stamper-pressed" && "Stamp pressed."}
            {phase === "imprint-revealed" &&
              "Passport stamped. Saving your visit."}
            {phase === "form-submitting" && "Saving your visit."}
          </div>
        </form>
      )}
    </div>
  );
}
