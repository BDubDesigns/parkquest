"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "@/lib/auth-client";

const primaryItems = [
  { href: "/", label: "Home", icon: "home" },
  { href: "/parks", label: "Parks", icon: "parks" },
  { href: "/map", label: "Map", icon: "map" },
  { href: "/passport", label: "Passport", icon: "passport" },
] as const;

function NavIcon({ name }: { name: string }) {
  if (name === "home") {
    return (
      <path d="M3 10.5 12 3l9 7.5V21a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1V10.5Z" />
    );
  }

  if (name === "parks") {
    return (
      <>
        <path d="m12 2-5 7h3l-4 6h4v7h4v-7h4l-4-6h3l-5-7Z" />
        <path d="M4 22h16" />
      </>
    );
  }

  if (name === "map") {
    return (
      <>
        <path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3V6Z" />
        <path d="M9 3v15M15 6v15" />
      </>
    );
  }

  if (name === "passport") {
    return (
      <>
        <rect x="5" y="3" width="14" height="18" rx="2" />
        <path d="M9 7h6M9 11h6M9 15h4" />
      </>
    );
  }

  return (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 22a8 8 0 0 1 16 0" />
    </>
  );
}

export default function MobileNav() {
  const pathname = usePathname();
  const { data: session, isPending } = useSession();
  const accountItem = session
    ? { href: "/account", label: "Account", icon: "account" }
    : {
        href: "/sign-in",
        label: isPending ? "Account" : "Sign in",
        icon: "account",
      };
  const items = [...primaryItems, accountItem];

  return (
    <nav
      aria-label="Mobile navigation"
      className="fixed inset-x-0 bottom-0 z-[1000] border-t border-slate-200 bg-white/95 pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_16px_rgba(15,23,42,0.08)] backdrop-blur md:hidden"
    >
      <ul className="mx-auto grid max-w-lg grid-cols-5">
        {items.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={`flex min-h-16 flex-col items-center justify-center gap-1 px-1 text-[0.6875rem] font-medium transition-colors ${
                  isActive
                    ? "text-emerald-800"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  className="size-5 fill-none stroke-current stroke-2 [stroke-linecap:round] [stroke-linejoin:round]"
                >
                  <NavIcon name={item.icon} />
                </svg>
                <span>{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
