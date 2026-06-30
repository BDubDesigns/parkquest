interface AmenityBadgeProps {
  name: string;
}

export default function AmenityBadge({ name }: AmenityBadgeProps) {
  return (
    <span className="inline-flex items-center rounded-full border border-neutral-300 px-2.5 py-0.5 text-xs font-medium text-neutral-700">
      {name}
    </span>
  );
}
