import type { ReactNode } from "react";

interface SectionHeaderProps {
  title: string;
  description?: string;
  action?: ReactNode;
  journal?: boolean;
  as?: "h1" | "h2";
}

export default function SectionHeader({
  title,
  description,
  action,
  journal = false,
  as: Heading = "h2",
}: SectionHeaderProps) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div className="min-w-0">
        <Heading
          className={`${journal ? "font-display font-semibold tracking-[-0.02em]" : "font-bold tracking-[-0.02em]"} text-2xl text-balance text-forest-ink sm:text-3xl`}
        >
          {title}
        </Heading>
        {description && (
          <p className="mt-2 max-w-[68ch] leading-7 text-pretty text-graphite/75">
            {description}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
