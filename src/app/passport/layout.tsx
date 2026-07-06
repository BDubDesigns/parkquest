import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  linkText,
  pageContainer,
  pageShell,
} from "@/components/ui/styles";

export default async function PassportLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect("/sign-in");
  }

  return (
    <div className={pageShell}>
      <div className={pageContainer}>
        <header className="mb-8 hidden border-b border-forest-ink/12 pb-5 md:block">
          <nav className="flex items-center gap-3 text-sm">
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
            <Link href="/map" className={linkText}>
              Map
            </Link>
          </nav>
        </header>
        {children}
      </div>
    </div>
  );
}
