import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-forest-ink/12 bg-white px-4 py-7 text-sm text-graphite/70">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 sm:flex-row">
        <p>
          <span className="font-semibold text-forest-ink">ParkQuest</span>
          <span aria-hidden="true"> · </span>
          Turn every park into an adventure.
        </p>
        <Link
          href="/privacy"
          className="inline-flex min-h-11 items-center font-medium text-forest-ink underline decoration-canopy/40 underline-offset-4 hover:text-canopy focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lake-blue"
        >
          Privacy &amp; Beta
        </Link>
      </div>
    </footer>
  );
}
