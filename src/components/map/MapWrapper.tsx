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

export default function MapWrapper({ parks }: { parks: ParkInfo[] }) {
  return <ParkMap parks={parks} />;
}
