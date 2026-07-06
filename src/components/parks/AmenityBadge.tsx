interface AmenityBadgeProps {
  name: string;
}

export default function AmenityBadge({ name }: AmenityBadgeProps) {
  return (
    <span className="inline-flex items-center rounded-full bg-mist px-2.5 py-1 text-xs font-semibold text-canopy ring-1 ring-canopy/16">
      {name}
    </span>
  );
}
