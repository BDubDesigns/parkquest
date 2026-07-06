import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  linkTextDaylight,
  pageContainerDaylight,
  pageShellDaylight,
} from "@/components/ui/styles";

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
    <div className={pageShellDaylight}>
      <div className={pageContainerDaylight}>
        <header className="mb-8 hidden border-b border-forest-ink/12 pb-5 md:block">
          <nav className="flex gap-3 text-sm">
            <Link href="/" className={linkTextDaylight}>
              Home
            </Link>
            <span aria-hidden="true" className="text-graphite/35">
              /
            </span>
            <Link href="/parks" className={linkTextDaylight}>
              Parks
            </Link>
          </nav>
        </header>
        {children}
      </div>
    </div>
  );
}
