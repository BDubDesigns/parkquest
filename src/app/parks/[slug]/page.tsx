import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { getParkBySlug } from "@/lib/parks";
import AmenityBadge from "@/components/parks/AmenityBadge";
import StampSection from "@/components/parks/StampSection";

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
        className="text-sm text-slate-500 underline underline-offset-2 hover:text-slate-800"
      >
        &larr; Back to parks
      </Link>

      <article className="mt-6 rounded-lg border border-slate-200 bg-white px-6 py-6 shadow-sm">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          {park.name}
        </h1>
        <p className="mt-1 text-sm text-slate-500">{park.regionName}</p>

        {park.description && (
          <p className="mt-4 leading-relaxed text-slate-700">
            {park.description}
          </p>
        )}

        <p className="mt-4 text-xs text-slate-400">
          {park.latitude.toFixed(4)}, {park.longitude.toFixed(4)}
        </p>

        {park.amenities.length > 0 && (
          <section className="mt-6">
            <h2 className="mb-3 text-sm font-semibold text-slate-700">
              Amenities
            </h2>
            <div className="flex flex-wrap gap-1.5">
              {park.amenities.map((a) => (
                <AmenityBadge key={a.slug} name={a.name} />
              ))}
            </div>
          </section>
        )}

        {park.officialUrl && (
          <section className="mt-6">
            <h2 className="mb-1 text-sm font-semibold text-slate-700">
              Official park page
            </h2>
            <a
              href={park.officialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="break-all text-sm font-medium text-slate-700 underline underline-offset-2 hover:text-slate-900"
            >
              {park.officialUrl}
            </a>
          </section>
        )}

        {park.sourceUrl && (
          <section className="mt-6">
            <h2 className="mb-1 text-xs font-medium text-slate-500">
              Data source
            </h2>
            <a
              href={park.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="break-all text-xs text-slate-400 underline underline-offset-2 hover:text-slate-600"
            >
              {park.sourceUrl}
            </a>
          </section>
        )}
      </article>

      <StampSection parkSlug={slug} />
    </div>
  );
}
