import Link from "next/link";
import { getCurrentAdminUserId } from "@/lib/admin";
import { linkText } from "@/components/ui/styles";

export default async function AdminNavLink() {
  const adminUserId = await getCurrentAdminUserId();
  if (!adminUserId) return null;

  return (
    <>
      <span aria-hidden="true" className="text-graphite/35">
        &middot;
      </span>
      <Link href="/admin" className={`text-sm ${linkText}`}>
        Admin
      </Link>
    </>
  );
}
