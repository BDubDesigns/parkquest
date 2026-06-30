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
      <div className="flex flex-col items-center gap-4 rounded-lg border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
        <h2 className="text-xl font-semibold text-slate-900">No parks found</h2>
        <p className="max-w-md text-slate-500">
          If you are running this locally, your database may not be seeded yet.
          Run the following commands and then reload this page:
        </p>
        <pre className="rounded bg-slate-100 px-4 py-3 text-left text-sm text-slate-700">
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
