import Link from "next/link";
import UserMenu from "@/components/auth/UserMenu";
import SectionHeader from "@/components/ui/SectionHeader";
import {
  linkTextDaylight,
  pageContainerDaylight,
  pageShellDaylight,
} from "@/components/ui/styles";

export default function ParksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={pageShellDaylight}>
      <div className={pageContainerDaylight}>
        <header className="mb-8 border-b border-forest-ink/12 pb-6 md:mb-10">
          <nav className="mb-5 hidden items-center gap-3 text-sm md:flex">
            <Link href="/" className={linkTextDaylight}>
              Home
            </Link>
            <span aria-hidden="true" className="text-graphite/35">
              /
            </span>
            <Link href="/map" className={linkTextDaylight}>
              Map
            </Link>
            <span aria-hidden="true" className="text-graphite/35">
              /
            </span>
            <UserMenu />
          </nav>
          <SectionHeader
            as="h1"
            title="Find your next park"
            description="Browse public park information and verified amenities across Bellingham."
          />
        </header>
        {children}
      </div>
    </div>
  );
}
