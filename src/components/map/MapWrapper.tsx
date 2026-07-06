"use client";

import dynamic from "next/dynamic";
import type { ParkInfo } from "@/lib/parks";

const ParkMap = dynamic(() => import("@/components/map/ParkMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[calc(100dvh-13rem)] min-h-88 max-h-[600px] animate-pulse items-center justify-center rounded-surface bg-forest-ink/10">
      <p className="font-medium text-graphite/68">Loading map…</p>
    </div>
  ),
});

interface Props {
  parks: ParkInfo[];
  stampedParkSlugs: string[] | null;
  parkNicknames: Record<string, string | null>;
}

export default function MapWrapper({
  parks,
  stampedParkSlugs,
  parkNicknames,
}: Props) {
  return (
    <ParkMap
      parks={parks}
      stampedParkSlugs={stampedParkSlugs}
      parkNicknames={parkNicknames}
    />
  );
}
