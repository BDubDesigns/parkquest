"use client";

import { useRouter } from "next/navigation";
import { signOut } from "@/lib/auth-client";
import { linkText } from "@/components/ui/styles";

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
      className={`inline-flex min-h-11 items-center text-sm ${linkText}`}
    >
      Sign out
    </button>
  );
}
