import Link from "next/link";
import AmenityBadge from "./AmenityBadge";

interface ParkCardProps {
  name: string;
  slug: string;
  regionName: string;
  description: string | null;
  latitude: number;
  longitude: number;
  amenities: { name: string }[];
}

export default function ParkCard({
  name,
  slug,
  regionName,
  description,
  latitude,
  longitude,
  amenities,
}: ParkCardProps) {
  return (
    <Link
      href={`/parks/${slug}`}
      className="block rounded-2xl border border-emerald-700/70 bg-emerald-900/70 p-4 shadow-2xl shadow-emerald-950/40 transition-all hover:border-emerald-600/80 hover:shadow-xl hover:shadow-emerald-950/50 sm:p-6"
    >
      <h2 className="text-lg font-bold text-white">
        {name}
        <span className="ml-1.5 text-emerald-300">&rarr;</span>
      </h2>
      <p className="mt-0.5 text-sm text-emerald-200/70">{regionName}</p>
      {description && (
        <p className="mt-2 line-clamp-2 text-sm text-emerald-100/80">
          {description}
        </p>
      )}
      <p className="mt-2 text-xs text-emerald-300/60">
        {latitude.toFixed(4)}, {longitude.toFixed(4)}
      </p>
      {amenities.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {amenities.map((a) => (
            <AmenityBadge key={a.name} name={a.name} />
          ))}
        </div>
      )}
    </Link>
  );
}
