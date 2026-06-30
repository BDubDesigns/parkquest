import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { getParkBySlug } from "@/lib/parks";
import AmenityBadge from "@/components/parks/AmenityBadge";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const park = await getParkBySlug(slug);

  if (!park) return { title: "Park Not Found - Park Quest" };

  return {
    title: `${park.name} - Park Quest`,
  };
}

export default async function ParkDetailPage({ params }: Props) {
  const { slug } = await params;
  const park = await getParkBySlug(slug);

  if (!park) notFound();

  return (
    <div>
      <Link
        href="/parks"
        className="text-sm text-neutral-500 underline underline-offset-2 hover:text-neutral-800"
      >
        &larr; Back to parks
      </Link>

      <article className="mt-6">
        <h1 className="text-3xl font-bold tracking-tight text-neutral-900">
          {park.name}
        </h1>
        <p className="mt-1 text-sm text-neutral-500">{park.regionName}</p>

        {park.description && (
          <p className="mt-4 text-neutral-700">{park.description}</p>
        )}

        <p className="mt-4 text-xs text-neutral-400">
          {park.latitude.toFixed(4)}, {park.longitude.toFixed(4)}
        </p>

        {park.amenities.length > 0 && (
          <section className="mt-6">
            <h2 className="mb-2 text-sm font-semibold text-neutral-700">
              Amenities
            </h2>
            <div className="flex flex-wrap gap-1.5">
              {park.amenities.map((a) => (
                <AmenityBadge key={a.slug} name={a.name} />
              ))}
            </div>
          </section>
        )}

        {park.sourceUrl && (
          <section className="mt-6">
            <h2 className="mb-1 text-sm font-semibold text-neutral-700">
              Source
            </h2>
            <a
              href={park.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-neutral-600 underline underline-offset-2 hover:text-neutral-900"
            >
              {park.sourceUrl}
            </a>
          </section>
        )}
      </article>
    </div>
  );
}
