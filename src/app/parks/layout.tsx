import Link from "next/link";
import UserMenu from "@/components/auth/UserMenu";
import AdminNavLink from "@/components/auth/AdminNavLink";
import SectionHeader from "@/components/ui/SectionHeader";
import {
  linkText,
  pageContainer,
  pageShell,
} from "@/components/ui/styles";

export default function ParksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={pageShell}>
      <div className={pageContainer}>
        <header className="mb-8 border-b border-forest-ink/12 pb-6 md:mb-10">
          <nav className="mb-5 hidden items-center gap-3 text-sm md:flex">
            <Link href="/" className={linkText}>
              Home
            </Link>
            <span aria-hidden="true" className="text-graphite/35">
              /
            </span>
            <Link href="/map" className={linkText}>
              Map
            </Link>
            <span aria-hidden="true" className="text-graphite/35">
              /
            </span>
            <UserMenu />
            <AdminNavLink />
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
