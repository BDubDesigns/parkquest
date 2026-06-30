import { db } from "@/db";

export interface ParkInfo {
  name: string;
  slug: string;
  regionName: string;
  description: string | null;
  latitude: number;
  longitude: number;
  sourceUrl: string | null;
  amenities: { name: string; slug: string }[];
}

export async function getParks(): Promise<ParkInfo[]> {
  const rows = await db.query.parks.findMany({
    with: {
      region: { columns: { name: true } },
      parkAmenities: {
        columns: {},
        where: (pa, { eq }) => eq(pa.verificationStatus, "verified"),
        with: {
          amenity: { columns: { name: true, slug: true } },
        },
      },
    },
    orderBy: (parks, { asc }) => [asc(parks.name)],
  });

  return rows.map((row) => ({
    name: row.name,
    slug: row.slug,
    regionName: row.region.name,
    description: row.description,
    latitude: row.latitude,
    longitude: row.longitude,
    sourceUrl: row.sourceUrl,
    amenities: row.parkAmenities.map((pa) => pa.amenity),
  }));
}

export async function getParkBySlug(slug: string): Promise<ParkInfo | null> {
  const row = await db.query.parks.findFirst({
    where: (parks, { eq }) => eq(parks.slug, slug),
    with: {
      region: { columns: { name: true } },
      parkAmenities: {
        columns: {},
        where: (pa, { eq }) => eq(pa.verificationStatus, "verified"),
        with: {
          amenity: { columns: { name: true, slug: true } },
        },
      },
    },
  });

  if (!row) return null;

  return {
    name: row.name,
    slug: row.slug,
    regionName: row.region.name,
    description: row.description,
    latitude: row.latitude,
    longitude: row.longitude,
    sourceUrl: row.sourceUrl,
    amenities: row.parkAmenities.map((pa) => pa.amenity),
  };
}
