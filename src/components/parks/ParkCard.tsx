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
      className="block rounded-lg border border-neutral-200 p-4 transition-colors hover:border-neutral-400"
    >
      <h2 className="text-lg font-semibold text-neutral-900">{name}</h2>
      <p className="mt-0.5 text-sm text-neutral-500">{regionName}</p>
      {description && (
        <p className="mt-2 line-clamp-2 text-sm text-neutral-600">
          {description}
        </p>
      )}
      <p className="mt-1 text-xs text-neutral-400">
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
