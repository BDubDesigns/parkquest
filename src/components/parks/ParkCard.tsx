import Link from "next/link";
import { mutedText } from "@/components/ui/styles";
import AmenityBadge from "./AmenityBadge";

interface ParkCardProps {
  name: string;
  slug: string;
  regionName: string;
  description: string | null;
  latitude: number;
  longitude: number;
  amenities: { name: string }[];
  nickname?: string | null;
}

export default function ParkCard({
  name,
  slug,
  regionName,
  description,
  latitude,
  longitude,
  amenities,
  nickname,
}: ParkCardProps) {
  return (
    <Link
      href={`/parks/${slug}`}
      className="group block py-5 transition-colors hover:bg-white/70 focus-visible:rounded-control focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-lake-blue sm:px-3 sm:py-6"
    >
      <div className="flex items-start justify-between gap-5">
        <div className="min-w-0">
          <h2 className="text-lg font-bold tracking-[-0.01em] text-forest-ink sm:text-xl">
            {nickname ?? name}
          </h2>
          {nickname && (
            <p className={`mt-0.5 text-xs ${mutedText}`}>
              Official: {name}
            </p>
          )}
          <p className={`mt-1 text-sm ${mutedText}`}>{regionName}</p>
          {description && (
            <p className="mt-2 max-w-[65ch] line-clamp-2 text-sm leading-6 text-graphite/76">
              {description}
            </p>
          )}
          <p className="mt-2 font-mono text-xs text-graphite/55">
            {latitude.toFixed(4)}, {longitude.toFixed(4)}
          </p>
          {amenities.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {amenities.map((a) => (
                <AmenityBadge key={a.name} name={a.name} />
              ))}
            </div>
          )}
        </div>
        <span
          aria-hidden="true"
          className="mt-1 shrink-0 text-2xl text-stamp-red transition-transform duration-150 ease-out group-hover:translate-x-1"
        >
          &rarr;
        </span>
      </div>
    </Link>
  );
}
