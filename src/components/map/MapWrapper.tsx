"use client";

import dynamic from "next/dynamic";
import type { ParkInfo } from "@/lib/parks";

const ParkMap = dynamic(() => import("@/components/map/ParkMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[600px] items-center justify-center rounded-lg bg-slate-200 animate-pulse">
      <p className="text-slate-500">Loading map...</p>
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
