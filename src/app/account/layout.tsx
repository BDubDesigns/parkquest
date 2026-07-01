import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect("/sign-in");
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-2xl px-4 py-6 md:py-8">
        <header className="mb-8 hidden md:block">
          <nav className="flex gap-3 text-sm text-slate-500">
            <Link
              href="/"
              className="underline underline-offset-2 hover:text-slate-800"
            >
              Home
            </Link>
            <span aria-hidden="true">&middot;</span>
            <Link
              href="/parks"
              className="underline underline-offset-2 hover:text-slate-800"
            >
              Parks
            </Link>
          </nav>
        </header>
        {children}
      </div>
    </div>
  );
}
