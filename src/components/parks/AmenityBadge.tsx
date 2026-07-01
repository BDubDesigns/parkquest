interface AmenityBadgeProps {
  name: string;
}

export default function AmenityBadge({ name }: AmenityBadgeProps) {
  return (
    <span className="inline-flex items-center rounded-full border border-emerald-600/70 bg-emerald-900/60 px-2.5 py-0.5 text-xs font-medium text-emerald-200">
      {name}
    </span>
  );
}
