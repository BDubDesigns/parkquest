import type { Metadata } from "next";
import { getParks } from "@/lib/parks";
import { getCurrentFamilyContext } from "@/lib/family";
import { getFamilyParkNicknames } from "@/lib/park-nicknames";
import ParkCard from "@/components/parks/ParkCard";
import EmptyState from "@/components/ui/EmptyState";
import { mutedText } from "@/components/ui/styles";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Parks - Park Quest",
};

export default async function ParksPage() {
  const parks = await getParks();

  if (parks.length === 0) {
    return (
      <EmptyState
        title="No parks found"
        description={
          <p>
            If you are running this locally, your database may not be seeded
            yet. Run the following commands and then reload this page:
          </p>
        }
        detail={
          <pre className="overflow-x-auto rounded-control bg-forest-ink px-4 py-3 text-left text-sm text-white">
            <code>{`npm run db:migrate\nnpm run db:seed`}</code>
          </pre>
        }
      />
    );
  }

  const ctx = await getCurrentFamilyContext();
  let nicknames: Record<string, string | null> = {};
  if (ctx) {
    nicknames = await getFamilyParkNicknames(
      ctx.familyGroupId,
      parks.map((p) => p.id),
    );
  }

  return (
    <>
      <div className="mb-5 flex items-center justify-between gap-4 border-b border-forest-ink/12 pb-4">
        <p className={`text-sm ${mutedText}`}>
          {parks.length} parks in {parks[0].regionName}
        </p>
      </div>
      <div className="divide-y divide-forest-ink/12 border-b border-forest-ink/12">
        {parks.map((park) => (
          <ParkCard
            key={park.slug}
            name={park.name}
            slug={park.slug}
            regionName={park.regionName}
            description={park.description}
            latitude={park.latitude}
            longitude={park.longitude}
            amenities={park.amenities}
            nickname={nicknames[park.id] ?? null}
          />
        ))}
      </div>
    </>
  );
}
