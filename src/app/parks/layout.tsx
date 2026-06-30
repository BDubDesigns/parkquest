import Link from "next/link";
import UserMenu from "@/components/auth/UserMenu";

export default function ParksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-2xl px-4 py-8">
        <header className="mb-8">
          <nav className="flex items-center gap-3 text-sm text-slate-500">
            <Link
              href="/"
              className="underline underline-offset-2 hover:text-slate-800"
            >
              Home
            </Link>
            <span aria-hidden="true">&middot;</span>
            <Link
              href="/map"
              className="underline underline-offset-2 hover:text-slate-800"
            >
              Map
            </Link>
            <span aria-hidden="true">&middot;</span>
            <UserMenu />
          </nav>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
            Parks
          </h1>
        </header>
        {children}
      </div>
    </div>
  );
}
