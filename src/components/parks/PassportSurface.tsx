import React from "react";

export type PassportStampPlacement = "left" | "center" | "right";

export interface PassportSurfaceProps {
  /** Stamp imprint (or any content) rendered inside the target zone. */
  children?: React.ReactNode;
  /** Where the stamp target zone sits on the page. Defaults to "center". */
  placement?: PassportStampPlacement;
  /** Shows the dashed control-ring that marks where a stamp should land. Defaults to true. */
  showTarget?: boolean;
  /** Extra classes applied to the outer wrapper. */
  className?: string;
}

/**
 * PassportSurface
 * -----------------------------------------------------------------------
 * A clear family field-record surface for ParkQuest's stamping UI. Pass a
 * stamp component as `children`; it renders inside a positioned target zone.
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
      className={`relative flex w-full items-center justify-center overflow-hidden rounded-surface bg-forest-ink px-6 py-10 sm:px-10 sm:py-14 ${className}`}
    >
      <div className="relative w-full max-w-[380px]">
        <div
          aria-hidden="true"
          className="absolute inset-0 rounded-collectible bg-mist"
          style={{
            transform: "rotate(2.5deg) translate(6px, 5px)",
          }}
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 rounded-collectible bg-atlas-paper"
          style={{
            transform: "rotate(-1.5deg) translate(-4px, 5px)",
          }}
        />

        <div
          className="relative aspect-[5/7] w-full overflow-hidden rounded-collectible bg-white ring-1 ring-forest-ink/12"
          style={{
            transform: "rotate(-0.75deg)",
          }}
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-[14%] w-px bg-forest-ink/12"
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-3 rounded-surface border border-forest-ink/14 sm:inset-4"
          />

          <div className="pointer-events-none absolute left-[20%] right-[7%] top-[8%] border-b border-forest-ink/16 pb-3 text-center font-mono text-[0.55rem] font-semibold tracking-[0.12em] text-forest-ink/55 sm:text-[0.625rem]">
            PARKQUEST · FAMILY FIELD RECORD
          </div>

          {/* stamp target zone — children render here */}
          <div
            className={`absolute top-[46%] w-[46%] max-w-[220px] -translate-y-1/2 ${TARGET_POSITION[placement]}`}
          >
            <div className="relative aspect-square w-full">
              {showTarget && (
                <svg
                  aria-hidden="true"
                  viewBox="0 0 100 100"
                  className="absolute inset-0 h-full w-full opacity-55"
                >
                  <circle
                    cx={50}
                    cy={50}
                    r={42}
                    fill="none"
                    stroke="#b84b3c"
                    strokeWidth={1.4}
                    strokeDasharray="4 5"
                  />
                  <circle cx={50} cy={50} r={1.6} fill="#b84b3c" />
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
