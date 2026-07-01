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
      <h1 className="text-2xl font-bold tracking-tight text-slate-900">
        Sign in
      </h1>

      <p className="mt-2 text-sm text-slate-500">
        Welcome back to your Park Passport.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
        {error && (
          <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        )}

        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-slate-700">Email</span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="min-h-11 rounded-md border border-slate-300 bg-white px-3 py-2 text-base text-slate-900 placeholder:text-slate-400 focus:border-slate-500 focus:outline-none"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-slate-700">Password</span>
          <input
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="min-h-11 rounded-md border border-slate-300 bg-white px-3 py-2 text-base text-slate-900 placeholder:text-slate-400 focus:border-slate-500 focus:outline-none"
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          className="mt-2 min-h-11 rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-slate-500">
        Don&apos;t have an account?{" "}
        <Link
          href="/sign-up"
          className="underline underline-offset-2 hover:text-slate-800"
        >
          Sign up
        </Link>
      </p>
    </div>
  );
}
