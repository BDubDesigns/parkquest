"use client";

import Link from "next/link";
import { useSession } from "@/lib/auth-client";
import { linkTextDaylight, mutedTextDaylight } from "@/components/ui/styles";

export default function UserMenu() {
  const { data: session, isPending } = useSession();

  if (isPending) {
    return (
      <span className={mutedTextDaylight} aria-hidden="true">
        &middot;
      </span>
    );
  }

  if (!session) {
    return (
      <Link href="/sign-in" className={`text-sm ${linkTextDaylight}`}>
        Sign in
      </Link>
    );
  }

  return (
    <>
      <span className="text-sm font-medium text-graphite/75">
        {session.user.name}
      </span>
      <span aria-hidden="true" className={mutedTextDaylight}>
        &middot;
      </span>
      <Link href="/passport" className={`text-sm ${linkTextDaylight}`}>
        Passport
      </Link>
      <span aria-hidden="true" className={mutedTextDaylight}>
        &middot;
      </span>
      <Link href="/account" className={`text-sm ${linkTextDaylight}`}>
        Account
      </Link>
    </>
  );
}
