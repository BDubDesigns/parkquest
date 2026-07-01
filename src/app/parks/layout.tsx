import Link from "next/link";
import UserMenu from "@/components/auth/UserMenu";
import { linkText, pageContainer, pageShell } from "@/components/ui/styles";

export default function ParksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={pageShell}>
      <div className={pageContainer}>
        <header className="mb-6 md:mb-8">
          <nav className="hidden items-center gap-3 text-sm md:flex">
            <Link href="/" className={linkText}>
              Home
            </Link>
            <span aria-hidden="true" className="text-stone-500/60">
              &middot;
            </span>
            <Link href="/map" className={linkText}>
              Map
            </Link>
            <span aria-hidden="true" className="text-stone-500/60">
              &middot;
            </span>
            <UserMenu />
          </nav>
          <h1 className="text-3xl font-bold tracking-tight text-white md:mt-2">
            Parks
          </h1>
        </header>
        {children}
      </div>
    </div>
  );
}
