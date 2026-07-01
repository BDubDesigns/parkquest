"use client";

import Link from "next/link";
import { useSession } from "@/lib/auth-client";

export default function UserMenu() {
  const { data: session, isPending } = useSession();

  if (isPending) {
    return (
      <span className="text-sm text-emerald-400/60" aria-hidden="true">
        &middot;
      </span>
    );
  }

  if (!session) {
    return (
      <Link
        href="/sign-in"
        className="text-sm text-emerald-200/70 underline decoration-emerald-500 underline-offset-4 hover:text-white"
      >
        Sign in
      </Link>
    );
  }

  return (
    <>
      <span className="text-sm text-emerald-200/80">{session.user.name}</span>
      <span aria-hidden="true" className="text-emerald-400/60">
        &middot;
      </span>
      <Link
        href="/passport"
        className="text-sm text-emerald-200/70 underline decoration-emerald-500 underline-offset-4 hover:text-white"
      >
        Passport
      </Link>
      <span aria-hidden="true" className="text-emerald-400/60">
        &middot;
      </span>
      <Link
        href="/account"
        className="text-sm text-emerald-200/70 underline decoration-emerald-500 underline-offset-4 hover:text-white"
      >
        Account
      </Link>
    </>
  );
}
