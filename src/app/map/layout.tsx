import Link from "next/link";
import UserMenu from "@/components/auth/UserMenu";
import { linkText, pageContainerWide, pageShell } from "@/components/ui/styles";

export default function MapLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={pageShell}>
      <div className={pageContainerWide}>
        <header className="mb-4 md:mb-6">
          <nav className="hidden items-center gap-3 text-sm md:flex">
            <Link href="/" className={linkText}>
              Home
            </Link>
            <span aria-hidden="true" className="text-stone-500/60">
              &middot;
            </span>
            <Link href="/parks" className={linkText}>
              Parks
            </Link>
            <span aria-hidden="true" className="text-stone-500/60">
              &middot;
            </span>
            <UserMenu />
          </nav>
          <h1 className="text-2xl font-bold tracking-tight text-white md:mt-2 md:text-3xl">
            Map
          </h1>
        </header>
        {children}
      </div>
    </div>
  );
}
