"use client";

import Link from "next/link";
import { useSession } from "@/lib/auth-client";

export default function UserMenu() {
  const { data: session, isPending } = useSession();

  if (isPending) {
    return (
      <span className="text-sm text-slate-400" aria-hidden="true">
        &middot;
      </span>
    );
  }

  if (!session) {
    return (
      <Link
        href="/sign-in"
        className="text-sm text-slate-500 underline underline-offset-2 hover:text-slate-800"
      >
        Sign in
      </Link>
    );
  }

  return (
    <>
      <span className="text-sm text-slate-500">{session.user.name}</span>
      <span aria-hidden="true">&middot;</span>
      <Link
        href="/passport"
        className="text-sm text-slate-500 underline underline-offset-2 hover:text-slate-800"
      >
        Passport
      </Link>
      <span aria-hidden="true">&middot;</span>
      <Link
        href="/account"
        className="text-sm text-slate-500 underline underline-offset-2 hover:text-slate-800"
      >
        Account
      </Link>
    </>
  );
}
