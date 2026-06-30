interface AmenityBadgeProps {
  name: string;
}

export default function AmenityBadge({ name }: AmenityBadgeProps) {
  return (
    <span className="inline-flex items-center rounded-full border border-green-200 bg-green-50 px-2.5 py-0.5 text-xs font-medium text-green-700">
      {name}
    </span>
  );
}
