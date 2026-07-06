import type { ReactNode } from "react";

interface EmptyStateProps {
  title: string;
  description: ReactNode;
  action?: ReactNode;
  detail?: ReactNode;
}

export default function EmptyState({
  title,
  description,
  action,
  detail,
}: EmptyStateProps) {
  return (
    <section className="rounded-surface bg-white px-5 py-12 text-center ring-1 ring-forest-ink/12 sm:px-8 sm:py-16">
      <div className="mx-auto max-w-lg">
        <h2 className="text-xl font-bold tracking-[-0.015em] text-forest-ink">
          {title}
        </h2>
        <div className="mt-3 leading-7 text-graphite/75">{description}</div>
        {detail && <div className="mt-5">{detail}</div>}
        {action && <div className="mt-6">{action}</div>}
      </div>
    </section>
  );
}
