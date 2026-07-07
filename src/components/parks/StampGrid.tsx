"use client";

import { useEffect, useRef, useState } from "react";
import ParkQuestStamp from "./ParkQuestStamp";

const MIN_COLS = 2;
const MAX_COLS = 6;
const MIN_CELL_WIDTH = 96;
const GRID_ROWS = 2;

interface StampEntry {
  id: string;
  visitDate: string;
  formattedDate: string;
  stampColor?: string | null;
  stampRotation?: number | null;
}

interface Props {
  stamps: StampEntry[];
  parkName: string;
  serialNumber: string;
}

function colsForWidth(width: number): number {
  const raw = Math.floor(width / MIN_CELL_WIDTH);
  return Math.max(MIN_COLS, Math.min(MAX_COLS, raw));
}

export default function StampGrid({
  stamps,
  parkName,
  serialNumber,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [cols, setCols] = useState(MIN_COLS);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setCols(colsForWidth(entry.contentRect.width));
      }
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const capacity = cols * GRID_ROWS;
  const visibleStamps = stamps.slice(0, capacity);
  const emptySlots = Math.max(0, capacity - visibleStamps.length);

  return (
    <div ref={containerRef}>
      <div
        className="overflow-hidden rounded-xl border border-forest-ink/10"
        role="list"
        aria-label="Stamp collection"
      >
        <div
          className="grid"
          style={{
            gridTemplateColumns: `repeat(${cols}, 1fr)`,
          }}
        >
          {visibleStamps.map((v) => (
            <div
              key={v.id}
              role="listitem"
              className="flex flex-col items-center justify-end gap-2 border-r border-b border-forest-ink/10 p-3"
              style={{ minHeight: "112px" }}
            >
              <ParkQuestStamp
                topText="ParkQuest"
                bottomText="Family Park Passport"
                centerText={parkName}
                  date={v.formattedDate}
                  serialNumber={serialNumber}
                  color={v.stampColor ?? "#12372a"}
                  rotation={v.stampRotation ?? 0}
                  size={64}
                />
                <p className="text-xs text-graphite/50">
                  {v.formattedDate}
              </p>
            </div>
          ))}
          {Array.from({ length: emptySlots }).map((_, i) => (
            <div
              key={`empty-${i}`}
              aria-hidden="true"
              className="border-r border-b border-forest-ink/10 p-3"
              style={{ minHeight: "112px" }}
            />
          ))}
        </div>
      </div>

      {stamps.length > capacity && (
        <p className="mt-3 text-xs text-graphite/68">
          Showing the {capacity} most recent stamps.
        </p>
      )}
    </div>
  );
}
