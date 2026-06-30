import SignInForm from "@/components/auth/SignInForm";
import Link from "next/link";

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-2xl px-4 py-8">
        <header className="mb-8">
          <nav className="flex gap-3 text-sm text-slate-500">
            <Link
              href="/"
              className="underline underline-offset-2 hover:text-slate-800"
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
