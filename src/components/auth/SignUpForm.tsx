"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signUp } from "@/lib/auth-client";
import {
  actionPrimary,
  fieldInput,
  fieldLabel,
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
    <div className="mx-auto max-w-sm rounded-surface bg-white p-5 ring-1 ring-forest-ink/12 sm:p-7">
      <h1 className="text-2xl font-bold tracking-[-0.02em] text-forest-ink">
        Sign up
      </h1>

      <p className={`mt-2 text-sm leading-6 ${mutedText}`}>
        Create your Park Passport and start tracking the parks you visit
        together. Every adventure earns its own story.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
        {error && (
          <p
            role="alert"
            className="rounded-control bg-danger/8 px-3 py-2 text-sm font-medium text-danger"
          >
            {error}
          </p>
        )}

        <label className="flex flex-col gap-1 text-sm">
          <span className={fieldLabel}>Name</span>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={fieldInput}
          />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          <span className={fieldLabel}>Email</span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={fieldInput}
          />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          <span className={fieldLabel}>Password</span>
          <input
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={fieldInput}
          />
          <span className={`text-xs ${mutedText}`}>
            Minimum 8 characters
          </span>
        </label>

        <button
          type="submit"
          disabled={loading}
          className={`mt-2 w-full ${actionPrimary}`}
        >
          {loading ? "Creating account..." : "Sign up"}
        </button>
      </form>

      <p className={`mt-5 text-center text-sm ${mutedText}`}>
        Already have an account?{" "}
        <Link href="/sign-in" className={linkText}>
          Sign in
        </Link>
      </p>
    </div>
  );
}
