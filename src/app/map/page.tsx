import { eq } from "drizzle-orm";
import { db } from "@/db";
import { visits } from "@/db/private";
import { parks } from "@/db/public";
import { getParks } from "@/lib/parks";
import { getCurrentFamilyContext } from "@/lib/family";
import MapWrapper from "@/components/map/MapWrapper";

export default async function MapPage() {
  const parkList = await getParks();

  if (parkList.length === 0) {
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

  const ctx = await getCurrentFamilyContext();
  let stampedParkSlugs: string[] | null = null;

  if (ctx) {
    const rows = await db
      .select({ slug: parks.slug })
      .from(visits)
      .innerJoin(parks, eq(visits.parkId, parks.id))
      .where(eq(visits.familyGroupId, ctx.familyGroupId))
      .groupBy(parks.slug);
    stampedParkSlugs = rows.map((r) => r.slug);
  }

  return <MapWrapper parks={parkList} stampedParkSlugs={stampedParkSlugs} />;
}
