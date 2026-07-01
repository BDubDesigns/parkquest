import SignInForm from "@/components/auth/SignInForm";
import Link from "next/link";
import { linkText, pageContainer, pageShell } from "@/components/ui/styles";

export default function SignInPage() {
  return (
    <div className={pageShell}>
      <div className={pageContainer}>
        <header className="mb-8 hidden md:block">
          <nav className="flex gap-3 text-sm">
            <Link href="/" className={linkText}>
              Home
            </Link>
          </nav>
        </header>
        <SignInForm />
      </div>
    </div>
  );
}
