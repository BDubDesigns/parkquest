import type { Metadata } from "next";
import { getParks } from "@/lib/parks";
import ParkCard from "@/components/parks/ParkCard";
import { card, mutedText } from "@/components/ui/styles";

export const metadata: Metadata = {
  title: "Parks - Park Quest",
};

export default async function ParksPage() {
  const parks = await getParks();

  if (parks.length === 0) {
    return (
      <div
        className={`flex flex-col items-center gap-4 px-6 py-16 text-center ${card}`}
      >
        <h2 className="text-xl font-semibold text-white">No parks found</h2>
        <p className={`max-w-md ${mutedText}`}>
          If you are running this locally, your database may not be seeded yet.
          Run the following commands and then reload this page:
        </p>
        <pre className="rounded-2xl bg-emerald-900/60 px-4 py-3 text-left text-sm text-emerald-200 ring-1 ring-emerald-800">
          <code>{`npm run db:migrate\nnpm run db:seed`}</code>
        </pre>
      </div>
    );
  }

  return (
    <>
      <div className="mb-6">
        <p className="text-stone-300/80">
          Browse public park information and verified amenities.
        </p>
        <p className={`mt-1 text-sm ${mutedText}`}>
          {parks.length} parks in {parks[0].regionName}
        </p>
      </div>
      <div className="grid gap-4">
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
          />
        ))}
      </div>
    </>
  );
}
