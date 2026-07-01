import Link from "next/link";
import UserMenu from "@/components/auth/UserMenu";

export default function ParksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-emerald-950">
      <div className="mx-auto max-w-2xl px-4 py-6 md:py-8">
        <header className="mb-6 md:mb-8">
          <nav className="hidden items-center gap-3 text-sm text-emerald-200/70 md:flex">
            <Link
              href="/"
              className="underline underline-offset-4 decoration-emerald-500 hover:text-white"
            >
              Home
            </Link>
            <span aria-hidden="true" className="text-emerald-500">
              &middot;
            </span>
            <Link
              href="/map"
              className="underline underline-offset-4 decoration-emerald-500 hover:text-white"
            >
              Map
            </Link>
            <span aria-hidden="true" className="text-emerald-500">
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
