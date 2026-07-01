"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "@/lib/auth-client";

export default function SignInForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn.email({ email, password });

    if (result.error) {
      setError(result.error.message ?? "Sign in failed");
      setLoading(false);
      return;
    }

    router.push("/account");
  }

  return (
    <div className="mx-auto max-w-sm">
      <h1 className="text-2xl font-bold tracking-tight text-white">Sign in</h1>

      <p className="mt-2 text-sm text-emerald-200/80">
        Welcome back to your Park Passport.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
        {error && (
          <p className="rounded-md bg-red-900/30 px-3 py-2 text-sm text-red-300">
            {error}
          </p>
        )}

        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-emerald-200">Email</span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="min-h-11 rounded-md border border-emerald-600/60 bg-emerald-900/40 px-3 py-2 text-base text-white placeholder:text-emerald-300/50 focus:border-emerald-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300/50"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-emerald-200">Password</span>
          <input
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="min-h-11 rounded-md border border-emerald-600/60 bg-emerald-900/40 px-3 py-2 text-base text-white placeholder:text-emerald-300/50 focus:border-emerald-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300/50"
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          className="mt-2 min-h-11 rounded-full bg-amber-300 px-6 py-2 text-sm font-bold text-emerald-950 transition-colors hover:bg-amber-200 disabled:opacity-50"
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-emerald-200/70">
        Don&apos;t have an account?{" "}
        <Link
          href="/sign-up"
          className="text-emerald-200 underline decoration-emerald-500 underline-offset-4 hover:text-white"
        >
          Sign up
        </Link>
      </p>
    </div>
  );
}
