import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { linkText, pageContainer, pageShell } from "@/components/ui/styles";

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
    <div className={pageShell}>
      <div className={pageContainer}>
        <header className="mb-8 hidden md:block">
          <nav className="flex gap-3 text-sm">
            <Link href="/" className={linkText}>
              Home
            </Link>
            <span aria-hidden="true" className="text-stone-500/60">
              &middot;
            </span>
            <Link href="/parks" className={linkText}>
              Parks
            </Link>
          </nav>
        </header>
        {children}
      </div>
    </div>
  );
}
