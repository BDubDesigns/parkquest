import { eq } from "drizzle-orm";
import { db } from "@/db";
import { visits } from "@/db/private";
import { parks } from "@/db/public";
import { getParks } from "@/lib/parks";
import { getCurrentFamilyContext } from "@/lib/family";
import { getFamilyParkNicknames } from "@/lib/park-nicknames";
import MapWrapper from "@/components/map/MapWrapper";
import EmptyState from "@/components/ui/EmptyState";

export const dynamic = "force-dynamic";

export default async function MapPage() {
  const parkList = await getParks();

  if (parkList.length === 0) {
    return (
      <EmptyState
        title="No parks to show yet"
        description={<p>Run the seed to populate park data.</p>}
      />
    );
  }

  const ctx = await getCurrentFamilyContext();
  let stampedParkSlugs: string[] | null = null;
  const parkNicknames: Record<string, string | null> = {};

  if (ctx) {
    const parkRows = await db.query.parks.findMany({
      columns: { id: true, slug: true },
      where: eq(parks.isActive, true),
    });
    const parkIds = parkRows.map((p) => p.id);
    const nicknames = await getFamilyParkNicknames(ctx.familyGroupId, parkIds);

    for (const p of parkRows) {
      if (nicknames[p.id]) {
        parkNicknames[p.slug] = nicknames[p.id];
      }
    }

    const rows = await db
      .select({ slug: parks.slug })
      .from(visits)
      .innerJoin(parks, eq(visits.parkId, parks.id))
      .where(eq(visits.familyGroupId, ctx.familyGroupId))
      .groupBy(parks.slug);
    stampedParkSlugs = rows.map((r) => r.slug);
  }

  return (
    <MapWrapper
      parks={parkList}
      stampedParkSlugs={stampedParkSlugs}
      parkNicknames={parkNicknames}
    />
  );
}
