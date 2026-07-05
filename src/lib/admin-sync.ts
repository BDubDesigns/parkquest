export interface ParsedAdminEmails {
  emails: string[];
  error: string | null;
}

export interface ExistingAdminUser {
  email: string;
  isAdmin: boolean;
}

export interface AdminSyncSummary {
  promoted: string[];
  alreadyAdmin: string[];
  notFound: string[];
}

export function parseAdminEmails(raw: string | undefined): ParsedAdminEmails {
  if (!raw || raw.trim() === "") {
    return {
      emails: [],
      error: "PARKQUEST_ADMIN_EMAILS must contain at least one email address.",
    };
  }

  const emails = Array.from(
    new Set(
      raw
        .split(",")
        .map((email) => email.trim().toLowerCase())
        .filter(Boolean),
    ),
  );

  if (emails.length === 0) {
    return {
      emails,
      error: "PARKQUEST_ADMIN_EMAILS must contain at least one email address.",
    };
  }

  return { emails, error: null };
}

export function summarizeAdminSync(
  configuredEmails: string[],
  existingUsers: ExistingAdminUser[],
): AdminSyncSummary {
  const existingByEmail = new Map(
    existingUsers.map((user) => [user.email.trim().toLowerCase(), user]),
  );

  const promoted: string[] = [];
  const alreadyAdmin: string[] = [];
  const notFound: string[] = [];

  for (const email of configuredEmails) {
    const user = existingByEmail.get(email);
    if (!user) {
      notFound.push(email);
    } else if (user.isAdmin) {
      alreadyAdmin.push(email);
    } else {
      promoted.push(email);
    }
  }

  return { promoted, alreadyAdmin, notFound };
}
