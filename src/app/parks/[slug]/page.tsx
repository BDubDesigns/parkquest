import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { and, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { amenitySuggestions } from "@/db/public";
import { getAmenityOptions, getParkBySlug, getParkIdBySlug } from "@/lib/parks";
import { getCurrentFamilyContext } from "@/lib/family";
import { getFamilyParkNickname } from "@/lib/park-nicknames";
import AmenityBadge from "@/components/parks/AmenityBadge";
import AmenitySuggestionForm from "@/components/parks/AmenitySuggestionForm";
import NicknameForm from "@/components/parks/NicknameForm";
import ParkDisplayName from "@/components/parks/ParkDisplayName";
import StampSection from "@/components/parks/StampSection";
import {
  linkMutedDaylight,
  linkPrimaryDaylight,
  linkTextDaylight,
  mutedTextDaylight,
  sectionTitle,
  surfacePrimary,
} from "@/components/ui/styles";

export const dynamic = "force-dynamic";

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

  const ctx = await getCurrentFamilyContext();
  let nickname: string | null = null;
  let userAmenitySuggestions: Array<{
    id: string;
    amenityName: string;
    suggestionType: "add" | "remove";
    status: "pending" | "approved" | "rejected";
    createdAt: string;
  }> = [];
  const amenityOptions = ctx ? await getAmenityOptions() : [];
  if (ctx) {
    const parkId = await getParkIdBySlug(slug);
    if (parkId) {
      nickname = await getFamilyParkNickname(ctx.familyGroupId, parkId);
      const suggestionRows = await db.query.amenitySuggestions.findMany({
        where: and(
          eq(amenitySuggestions.parkId, parkId),
          eq(amenitySuggestions.submittedByUserId, ctx.userId),
        ),
        with: { amenity: { columns: { name: true } } },
        orderBy: [desc(amenitySuggestions.createdAt)],
      });
      userAmenitySuggestions = suggestionRows.map((suggestion) => ({
        id: suggestion.id,
        amenityName: suggestion.amenity.name,
        suggestionType: suggestion.suggestionType,
        status: suggestion.status,
        createdAt: suggestion.createdAt.toISOString(),
      }));
    }
  }

  return (
    <div>
      <Link href="/parks" className={`text-sm ${linkTextDaylight}`}>
        &larr; Back to parks
      </Link>

      <article className={`mt-5 sm:mt-6 ${surfacePrimary}`}>
        <ParkDisplayName
          officialName={park.name}
          nickname={nickname}
          regionName={park.regionName}
          as="h1"
        />

        {park.description && (
          <p className="mt-4 max-w-[70ch] leading-7 text-graphite/78">
            {park.description}
          </p>
        )}

        <p className="mt-4 font-mono text-xs text-graphite/55">
          {park.latitude.toFixed(4)}, {park.longitude.toFixed(4)}
        </p>

        {park.amenities.length > 0 && (
          <section className="mt-6">
            <h2 className={`mb-3 ${sectionTitle}`}>Amenities</h2>
            <div className="flex flex-wrap gap-1.5">
              {park.amenities.map((a) => (
                <AmenityBadge key={a.slug} name={a.name} />
              ))}
            </div>
          </section>
        )}

        {park.officialUrl && (
          <section className="mt-6">
            <h2 className={`mb-1 ${sectionTitle}`}>Official park page</h2>
            <a
              href={park.officialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`break-all text-sm font-medium ${linkPrimaryDaylight}`}
            >
              {park.officialUrl}
            </a>
          </section>
        )}

        {park.sourceUrl && (
          <section className="mt-6">
            <h2 className={`mb-1 text-xs font-medium ${mutedTextDaylight}`}>
              Data source
            </h2>
            <a
              href={park.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`break-all text-xs ${linkMutedDaylight}`}
            >
              {park.sourceUrl}
            </a>
          </section>
        )}
      </article>

      {ctx && (
        <AmenitySuggestionForm
          parkSlug={slug}
          amenities={amenityOptions}
          verifiedAmenityIds={park.amenities.map((amenity) => amenity.id)}
          userSuggestions={userAmenitySuggestions}
        />
      )}

      {ctx && (
        <NicknameForm
          parkSlug={slug}
          parkName={park.name}
          currentNickname={nickname}
        />
      )}

      <StampSection parkSlug={slug} />
    </div>
  );
}
