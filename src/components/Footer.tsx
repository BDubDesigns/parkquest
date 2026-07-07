import Link from "next/link";
import { getCurrentAdminUserId } from "@/lib/admin";

export default async function Footer() {
  const isAdmin = !!(await getCurrentAdminUserId());

  return (
    <footer className="mb-[calc(4rem+env(safe-area-inset-bottom))] border-t border-forest-ink/12 bg-white px-4 py-7 text-sm text-graphite/70 md:mb-0">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 sm:flex-row">
        <p>
          <span className="font-semibold text-forest-ink">ParkQuest</span>
          <span aria-hidden="true"> · </span>
          Turn every park into an adventure.
        </p>
        <div className="flex items-center gap-3">
          {isAdmin && (
            <Link
              href="/admin"
              className="inline-flex min-h-11 items-center font-medium text-forest-ink underline decoration-canopy/40 underline-offset-4 hover:text-canopy focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lake-blue"
            >
              Admin
            </Link>
          )}
          <Link
            href="/privacy"
            className="inline-flex min-h-11 items-center font-medium text-forest-ink underline decoration-canopy/40 underline-offset-4 hover:text-canopy focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lake-blue"
          >
            Privacy &amp; Beta
          </Link>
        </div>
      </div>
    </footer>
  );
}
