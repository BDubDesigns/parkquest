import { db } from "@/db";

export interface ParkInfo {
  id: string;
  name: string;
  slug: string;
  regionName: string;
  description: string | null;
  latitude: number;
  longitude: number;
  sourceUrl: string | null;
  officialUrl: string | null;
  amenities: { id: string; name: string; slug: string }[];
}

export async function getParks(): Promise<ParkInfo[]> {
  const rows = await db.query.parks.findMany({
    columns: {
      id: true,
      name: true,
      slug: true,
      description: true,
      latitude: true,
      longitude: true,
      sourceUrl: true,
      officialUrl: true,
    },
    with: {
      region: { columns: { name: true } },
      parkAmenities: {
        columns: {},
        where: (pa, { eq }) => eq(pa.verificationStatus, "verified"),
        with: {
          amenity: { columns: { id: true, name: true, slug: true } },
        },
      },
    },
    orderBy: (parks, { asc }) => [asc(parks.name)],
  });

  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    slug: row.slug,
    regionName: row.region.name,
    description: row.description,
    latitude: row.latitude,
    longitude: row.longitude,
    sourceUrl: row.sourceUrl,
    officialUrl: row.officialUrl,
    amenities: row.parkAmenities.map((pa) => pa.amenity),
  }));
}

export async function getParkIdBySlug(slug: string): Promise<string | null> {
  const row = await db.query.parks.findFirst({
    columns: { id: true },
    where: (parks, { and, eq }) =>
      and(eq(parks.slug, slug), eq(parks.isActive, true)),
  });

  return row?.id ?? null;
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
          amenity: { columns: { id: true, name: true, slug: true } },
        },
      },
    },
  });

  if (!row) return null;

  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    regionName: row.region.name,
    description: row.description,
    latitude: row.latitude,
    longitude: row.longitude,
    sourceUrl: row.sourceUrl,
    officialUrl: row.officialUrl,
    amenities: row.parkAmenities.map((pa) => pa.amenity),
  };
}

export async function getAmenityOptions(): Promise<
  { id: string; name: string }[]
> {
  return db.query.amenities.findMany({
    columns: { id: true, name: true },
    orderBy: (amenities, { asc }) => [asc(amenities.name)],
  });
}
