import SignUpForm from "@/components/auth/SignUpForm";
import Link from "next/link";
import {
  linkTextDaylight,
  pageContainerDaylight,
  pageShellDaylight,
} from "@/components/ui/styles";

export default function SignUpPage() {
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
        <SignUpForm />
      </div>
    </div>
  );
}
