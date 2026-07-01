"use client";

import { useRouter } from "next/navigation";
import { signOut } from "@/lib/auth-client";

export default function SignOutButton() {
  const router = useRouter();

  return (
    <button
      onClick={() =>
        signOut({
          fetchOptions: {
            onSuccess: () => router.push("/"),
          },
        })
      }
      className="inline-flex min-h-11 items-center text-sm text-slate-500 underline underline-offset-2 hover:text-slate-800"
    >
      Sign out
    </button>
  );
}
