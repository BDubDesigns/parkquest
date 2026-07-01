"use client";

import Link from "next/link";
import { useSession } from "@/lib/auth-client";
import { linkText, mutedText } from "@/components/ui/styles";

export default function UserMenu() {
  const { data: session, isPending } = useSession();

  if (isPending) {
    return (
      <span className={mutedText} aria-hidden="true">
        &middot;
      </span>
    );
  }

  if (!session) {
    return (
      <Link href="/sign-in" className={`text-sm ${linkText}`}>
        Sign in
      </Link>
    );
  }

  return (
    <>
      <span className="text-sm text-stone-300/80">{session.user.name}</span>
      <span aria-hidden="true" className={mutedText}>
        &middot;
      </span>
      <Link href="/passport" className={`text-sm ${linkText}`}>
        Passport
      </Link>
      <span aria-hidden="true" className={mutedText}>
        &middot;
      </span>
      <Link href="/account" className={`text-sm ${linkText}`}>
        Account
      </Link>
    </>
  );
}
