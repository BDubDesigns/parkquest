"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signUp } from "@/lib/auth-client";
import {
  ctaPrimary,
  formInput,
  formLabel,
  linkText,
  mutedText,
} from "@/components/ui/styles";

export default function SignUpForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await signUp.email({
      name,
      email,
      password,
    });

    if (result.error) {
      setError(result.error.message ?? "Sign up failed");
      setLoading(false);
      return;
    }

    router.push("/account");
  }

  return (
    <div className="mx-auto max-w-sm">
      <h1 className="text-2xl font-bold tracking-tight text-white">Sign up</h1>

      <p className={`mt-2 text-sm ${mutedText}`}>
        Create your Park Passport and start tracking the parks you visit
        together. Every adventure earns its own story.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
        {error && (
          <p className="rounded-md bg-red-900/30 px-3 py-2 text-sm text-red-300">
            {error}
          </p>
        )}

        <label className="flex flex-col gap-1 text-sm">
          <span className={formLabel}>Name</span>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={`min-h-11 text-base ${formInput}`}
          />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          <span className={formLabel}>Email</span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`min-h-11 text-base ${formInput}`}
          />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          <span className={formLabel}>Password</span>
          <input
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`min-h-11 text-base ${formInput}`}
          />
          <span className={`text-xs ${mutedText}`}>Minimum 8 characters</span>
        </label>

        <button
          type="submit"
          disabled={loading}
          className={`mt-2 min-h-11 ${ctaPrimary} disabled:opacity-50`}
        >
          {loading ? "Creating account..." : "Sign up"}
        </button>
      </form>

      <p className={`mt-4 text-center text-sm ${mutedText}`}>
        Already have an account?{" "}
        <Link href="/sign-in" className={linkText}>
          Sign in
        </Link>
      </p>
    </div>
  );
}
