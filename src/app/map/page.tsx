import { getParks } from "@/lib/parks";
import MapWrapper from "@/components/map/MapWrapper";

export default async function MapPage() {
  const parks = await getParks();

  if (parks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-lg text-slate-500">
          No parks to show on the map yet.
        </p>
        <p className="mt-2 text-sm text-slate-400">
          Run seed to populate park data.
        </p>
      </div>
    );
  }

  return <MapWrapper parks={parks} />;
}
