import SignInForm from "@/components/auth/SignInForm";
import Link from "next/link";

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-emerald-950">
      <div className="mx-auto max-w-2xl px-4 py-6 md:py-8">
        <header className="mb-8 hidden md:block">
          <nav className="flex gap-3 text-sm text-emerald-200/70">
            <Link
              href="/"
              className="underline underline-offset-4 decoration-emerald-500 hover:text-white"
            >
              Home
            </Link>
          </nav>
        </header>
        <SignInForm />
      </div>
    </div>
  );
}
