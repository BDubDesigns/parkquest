import SignUpForm from "@/components/auth/SignUpForm";
import Link from "next/link";
import {
  linkText,
  pageContainer,
  pageShell,
} from "@/components/ui/styles";

export default function SignUpPage() {
  return (
    <div className={pageShell}>
      <div className={pageContainer}>
        <header className="mb-8 hidden border-b border-forest-ink/12 pb-5 md:block">
          <nav className="flex gap-3 text-sm">
            <Link href="/" className={linkText}>
              Home
            </Link>
          </nav>
        </header>
        <SignUpForm />
      </div>
    </div>
  );
}
