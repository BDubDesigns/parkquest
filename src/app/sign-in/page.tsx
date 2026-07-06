import SignInForm from "@/components/auth/SignInForm";
import Link from "next/link";
import {
  linkTextDaylight,
  pageContainerDaylight,
  pageShellDaylight,
} from "@/components/ui/styles";

export default function SignInPage() {
  return (
    <div className={pageShellDaylight}>
      <div className={pageContainerDaylight}>
        <header className="mb-8 hidden border-b border-forest-ink/12 pb-5 md:block">
          <nav className="flex gap-3 text-sm">
            <Link href="/" className={linkTextDaylight}>
              Home
            </Link>
          </nav>
        </header>
        <SignInForm />
      </div>
    </div>
  );
}
