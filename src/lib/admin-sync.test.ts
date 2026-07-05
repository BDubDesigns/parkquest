import { describe, expect, it } from "vitest";
import { parseAdminEmails, summarizeAdminSync } from "./admin-sync";

describe("admin sync helpers", () => {
  it("requires PARKQUEST_ADMIN_EMAILS to contain at least one email", () => {
    expect(parseAdminEmails(undefined)).toEqual({
      emails: [],
      error: "PARKQUEST_ADMIN_EMAILS must contain at least one email address.",
    });
    expect(parseAdminEmails(" ,  ")).toEqual({
      emails: [],
      error: "PARKQUEST_ADMIN_EMAILS must contain at least one email address.",
    });
  });

  it("parses comma-separated admin emails with trimming, lowercasing, and de-duping", () => {
    expect(
      parseAdminEmails(
        " Brandon@QCFailed.com, admin@example.com,brandON@qcfailed.com ",
      ),
    ).toEqual({
      emails: ["brandon@qcfailed.com", "admin@example.com"],
      error: null,
    });
  });

  it("summarizes promoted, already-admin, and missing configured emails", () => {
    expect(
      summarizeAdminSync(
        ["brandon@qcfailed.com", "admin@example.com", "missing@example.com"],
        [
          { email: "Brandon@QCFailed.com", isAdmin: false },
          { email: "admin@example.com", isAdmin: true },
        ],
      ),
    ).toEqual({
      promoted: ["brandon@qcfailed.com"],
      alreadyAdmin: ["admin@example.com"],
      notFound: ["missing@example.com"],
    });
  });
});
