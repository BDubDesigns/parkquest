import Link from "next/link";
import UserMenu from "@/components/auth/UserMenu";
import SectionHeader from "@/components/ui/SectionHeader";
import {
  linkText,
  pageContainerWide,
  pageShell,
} from "@/components/ui/styles";

export default function MapLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={pageShell}>
      <div className={pageContainerWide}>
        <header className="mb-6 border-b border-forest-ink/12 pb-5 md:mb-8">
          <nav className="mb-5 hidden items-center gap-3 text-sm md:flex">
            <Link href="/" className={linkText}>
              Home
            </Link>
            <span aria-hidden="true" className="text-graphite/35">
              /
            </span>
            <Link href="/parks" className={linkText}>
              Parks
            </Link>
            <span aria-hidden="true" className="text-graphite/35">
              /
            </span>
            <UserMenu />
          </nav>
          <SectionHeader
            as="h1"
            title="Explore the park map"
            description="Choose a park by location and see which places are already part of your family passport."
          />
        </header>
        {children}
      </div>
    </div>
  );
}
