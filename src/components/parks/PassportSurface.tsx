import React from "react";

export type PassportStampPlacement = "left" | "center" | "right";

export interface PassportSurfaceProps {
  /** Stamp imprint (or any content) rendered inside the target zone. */
  children?: React.ReactNode;
  /** Where the stamp target zone sits on the page. Defaults to "center". */
  placement?: PassportStampPlacement;
  /** Shows the dashed control-ring that marks where a stamp should land. Defaults to true. */
  showTarget?: boolean;
  /** Extra classes applied to the outer (emerald) wrapper — e.g. margin, rounding when nesting. */
  className?: string;
}

/**
 * PassportSurface
 * -----------------------------------------------------------------------
 * A stylized "passport page lying flat on a table" surface for ParkQuest's
 * stamping UI. Renders a warm cream page — with paper grain, a faint
 * topographic watermark, a spine/gutter edge, and an embossed frame — on a
 * dark emerald backdrop. Pass a stamp component as `children`; it renders
 * inside a positioned target zone.
 */
const TARGET_POSITION: Record<PassportStampPlacement, string> = {
  left: "left-[22%]",
  center: "left-1/2 -translate-x-1/2",
  right: "right-[8%]",
};

export default function PassportSurface({
  children,
  placement = "center",
  showTarget = true,
  className = "",
}: PassportSurfaceProps) {
  return (
    <div
      className={`relative flex w-full items-center justify-center bg-gradient-to-b from-emerald-950 via-emerald-900 to-[#08211a] px-6 py-10 sm:px-10 sm:py-14 ${className}`}
    >
      {/* ambient light pooling on the "table", purely decorative */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 45% at 50% 8%, rgba(255,255,255,0.06), transparent 70%)",
        }}
      />

      {/* shared box so the ghost pages behind can key off the main page's own height */}
      <div className="relative w-full max-w-[380px]">
        {/* two ghost pages peeking out, suggesting an open booklet */}
        <div
          aria-hidden="true"
          className="absolute inset-0 rounded-[1.5rem] bg-[#e6d8b6]"
          style={{
            transform: "rotate(3deg) translate(6px, 5px)",
            opacity: 0.55,
          }}
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 rounded-[1.5rem] bg-[#eee1c2]"
          style={{
            transform: "rotate(-2.2deg) translate(-4px, 6px)",
            opacity: 0.7,
          }}
        />

        {/* the page itself */}
        <div
          className="relative aspect-[5/7] w-full overflow-hidden rounded-[1.5rem]"
          style={{
            transform: "rotate(-1.1deg)",
            background:
              "linear-gradient(155deg, #f6ecd6 0%, #f1e4c4 42%, #ecdcb3 78%, #e6d3a4 100%)",
            boxShadow:
              "0 1px 0 rgba(255,255,255,0.6) inset, 0 -1px 2px rgba(120,96,52,0.25) inset, 0 0 0 1px rgba(176,141,87,0.35) inset, 0 18px 32px -12px rgba(0,0,0,0.55), 0 6px 10px -4px rgba(0,0,0,0.35)",
          }}
        >
          {/* paper fiber grain — CSS gradients only, no texture image */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-[0.35] mix-blend-multiply"
            style={{
              backgroundImage:
                "repeating-linear-gradient(0deg, rgba(120,96,52,0.05) 0px, transparent 1px, transparent 3px), repeating-linear-gradient(90deg, rgba(120,96,52,0.04) 0px, transparent 1px, transparent 3px)",
            }}
          />

          {/* faint topographic contour texture */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-10 -top-10 h-2/3 w-2/3 opacity-[0.12]"
            style={{
              backgroundImage:
                "repeating-radial-gradient(circle at 30% 30%, rgba(75,58,34,0.5) 0px, rgba(75,58,34,0.5) 1px, transparent 1px, transparent 14px)",
            }}
          />

          {/* spine / gutter shadow, reads as the book fold */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-0 w-[16%]"
            style={{
              background:
                "linear-gradient(90deg, rgba(90,68,36,0.28) 0%, rgba(90,68,36,0.12) 40%, transparent 100%)",
            }}
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-[16%] w-px bg-[rgba(90,68,36,0.25)]"
          />

          {/* embossed inner frame */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-3 rounded-2xl sm:inset-4"
            style={{
              boxShadow:
                "0 1px 0 rgba(255,255,255,0.5) inset, 0 -1px 1px rgba(120,96,52,0.3) inset",
              border: "1px solid rgba(176,141,87,0.4)",
            }}
          />

          {/* small mountain/pine emblem, stands in for a printed passport seal */}
          <svg
            aria-hidden="true"
            viewBox="0 0 120 60"
            className="pointer-events-none absolute left-1/2 top-[9%] w-[34%] -translate-x-1/2 opacity-[0.16] sm:top-[8%]"
            fill="none"
            stroke="#4b3a22"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M8 46 L34 14 L48 32 L60 18 L96 46 Z" />
            <path d="M20 46 L34 26 L44 38" />
            <circle cx="94" cy="14" r="7" />
          </svg>

          {/* printed header rule */}
          <div className="pointer-events-none absolute left-1/2 top-[19%] h-px w-[56%] -translate-x-1/2 bg-[rgba(90,68,36,0.25)] sm:top-[18%]" />

          {/* stamp target zone — children render here */}
          <div
            className={`absolute top-[46%] w-[46%] max-w-[220px] -translate-y-1/2 ${TARGET_POSITION[placement]}`}
          >
            <div className="relative aspect-square w-full">
              {showTarget && (
                <svg
                  aria-hidden="true"
                  viewBox="0 0 100 100"
                  className="absolute inset-0 h-full w-full opacity-40"
                >
                  <circle
                    cx={50}
                    cy={50}
                    r={42}
                    fill="none"
                    stroke="#9c4a3c"
                    strokeWidth={1.4}
                    strokeDasharray="4 5"
                  />
                  <circle cx={50} cy={50} r={1.6} fill="#9c4a3c" />
                </svg>
              )}
              <div className="relative flex h-full w-full items-center justify-center">
                {children}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
