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
        className="text-sm text-emerald-200/70 underline decoration-emerald-500 underline-offset-4 hover:text-white"
      >
        &larr; Back to parks
      </Link>

      <article className="mt-5 rounded-2xl border border-emerald-700/70 bg-emerald-900/70 p-4 shadow-2xl shadow-emerald-950/40 sm:mt-6 sm:p-6">
        <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
          {park.name}
        </h1>
        <p className="mt-1 text-sm text-emerald-200/70">{park.regionName}</p>

        {park.description && (
          <p className="mt-4 leading-relaxed text-emerald-100/80">
            {park.description}
          </p>
        )}

        <p className="mt-4 text-xs text-emerald-300/60">
          {park.latitude.toFixed(4)}, {park.longitude.toFixed(4)}
        </p>

        {park.amenities.length > 0 && (
          <section className="mt-6">
            <h2 className="mb-3 text-sm font-semibold text-emerald-200">
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
            <h2 className="mb-1 text-sm font-semibold text-emerald-200">
              Official park page
            </h2>
            <a
              href={park.officialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="break-all text-sm font-medium text-emerald-200 underline decoration-emerald-500 underline-offset-2 hover:text-white"
            >
              {park.officialUrl}
            </a>
          </section>
        )}

        {park.sourceUrl && (
          <section className="mt-6">
            <h2 className="mb-1 text-xs font-medium text-emerald-200/70">
              Data source
            </h2>
            <a
              href={park.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="break-all text-xs text-emerald-400/60 underline underline-offset-2 hover:text-emerald-200"
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
