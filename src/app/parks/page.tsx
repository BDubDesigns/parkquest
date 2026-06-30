import type { Metadata } from "next";
import { getParks } from "@/lib/parks";
import ParkCard from "@/components/parks/ParkCard";

export const metadata: Metadata = {
  title: "Parks - Park Quest",
};

export default async function ParksPage() {
  const parks = await getParks();

  if (parks.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 py-16 text-center">
        <h2 className="text-xl font-semibold text-neutral-900">
          No parks found
        </h2>
        <p className="max-w-md text-neutral-500">
          If you are running this locally, your database may not be seeded yet.
          Run the following commands and then reload this page:
        </p>
        <pre className="rounded bg-neutral-100 px-4 py-3 text-left text-sm text-neutral-700">
          <code>{`npm run db:migrate\nnpm run db:seed`}</code>
        </pre>
      </div>
    );
  }

  return (
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
  );
}
