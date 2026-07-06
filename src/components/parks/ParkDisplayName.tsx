import { mutedText } from "@/components/ui/styles";

interface Props {
  officialName: string;
  nickname: string | null;
  regionName?: string;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  className?: string;
}

export default function ParkDisplayName({
  officialName,
  nickname,
  regionName,
  as: Tag = "p",
  className = "",
}: Props) {
  const primary = nickname ?? officialName;

  return (
    <div className={className}>
      <Tag className="text-2xl font-bold tracking-[-0.02em] text-balance text-forest-ink sm:text-3xl">
        {primary}
      </Tag>
      {nickname ? (
        <p className={`mt-1 text-sm ${mutedText}`}>
          Official: {officialName}
        </p>
      ) : null}
      {regionName ? (
        <p className={`mt-1 text-sm ${mutedText}`}>{regionName}</p>
      ) : null}
    </div>
  );
}
