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
      className="inline-flex min-h-11 items-center text-sm text-emerald-200/70 underline decoration-emerald-500 underline-offset-4 hover:text-white"
    >
      Sign out
    </button>
  );
}
