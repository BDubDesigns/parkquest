"use client";

import dynamic from "next/dynamic";
import type { ParkInfo } from "@/lib/parks";

const ParkMap = dynamic(() => import("@/components/map/ParkMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[calc(100dvh-13rem)] min-h-88 max-h-[600px] items-center justify-center rounded-lg bg-emerald-900/60 animate-pulse">
      <p className="text-emerald-200/70">Loading map...</p>
    </div>
  ),
});

interface Props {
  parks: ParkInfo[];
  stampedParkSlugs: string[] | null;
}

export default function MapWrapper({ parks, stampedParkSlugs }: Props) {
  return <ParkMap parks={parks} stampedParkSlugs={stampedParkSlugs} />;
}
