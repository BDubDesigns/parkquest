import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { getParkBySlug, getParkIdBySlug } from "@/lib/parks";
import { getCurrentFamilyContext } from "@/lib/family";
import { getFamilyParkNickname } from "@/lib/park-nicknames";
import AmenityBadge from "@/components/parks/AmenityBadge";
import NicknameForm from "@/components/parks/NicknameForm";
import ParkDisplayName from "@/components/parks/ParkDisplayName";
import StampSection from "@/components/parks/StampSection";
import {
  card,
  eyebrow,
  linkMuted,
  linkPrimary,
  linkText,
  mutedText,
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
  if (ctx) {
    const parkId = await getParkIdBySlug(slug);
    if (parkId) {
      nickname = await getFamilyParkNickname(ctx.familyGroupId, parkId);
    }
  }

  return (
    <div>
      <Link href="/parks" className={`text-sm ${linkText}`}>
        &larr; Back to parks
      </Link>

      <article className={`mt-5 sm:mt-6 ${card}`}>
        <ParkDisplayName
          officialName={park.name}
          nickname={nickname}
          regionName={park.regionName}
          as="h1"
        />

        {park.description && (
          <p className="mt-4 leading-relaxed text-stone-300/80">
            {park.description}
          </p>
        )}

        <p className="mt-4 text-xs text-stone-500/60">
          {park.latitude.toFixed(4)}, {park.longitude.toFixed(4)}
        </p>

        {park.amenities.length > 0 && (
          <section className="mt-6">
            <h2 className={`mb-3 ${eyebrow}`}>Amenities</h2>
            <div className="flex flex-wrap gap-1.5">
              {park.amenities.map((a) => (
                <AmenityBadge key={a.slug} name={a.name} />
              ))}
            </div>
          </section>
        )}

        {park.officialUrl && (
          <section className="mt-6">
            <h2 className={`mb-1 ${eyebrow}`}>Official park page</h2>
            <a
              href={park.officialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`break-all text-sm font-medium ${linkPrimary}`}
            >
              {park.officialUrl}
            </a>
          </section>
        )}

        {park.sourceUrl && (
          <section className="mt-6">
            <h2 className={`mb-1 text-xs font-medium ${mutedText}`}>
              Data source
            </h2>
            <a
              href={park.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`break-all text-xs ${linkMuted}`}
            >
              {park.sourceUrl}
            </a>
          </section>
        )}
      </article>

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
