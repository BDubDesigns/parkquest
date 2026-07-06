"use client";

import { useRouter } from "next/navigation";
import { signOut } from "@/lib/auth-client";
import { linkTextDaylight } from "@/components/ui/styles";

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
      className={`inline-flex min-h-11 items-center text-sm ${linkTextDaylight}`}
    >
      Sign out
    </button>
  );
}
