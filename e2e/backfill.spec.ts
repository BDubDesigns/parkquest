import { test, expect } from "@playwright/test";
import { signUp, signIn } from "./helpers/auth";

test.describe.serial("backfill flow", () => {
  const emailOwner = `test-backfill-${Date.now()}-owner@example.com`;

  test("sign up owner", async ({ page }) => {
    await signUp(page, "Charlie", emailOwner);
  });

  test("owner can mark a park as previously visited", async ({ page }) => {
    await signIn(page, emailOwner);
    await page.goto("/parks/elizabeth-park");
    await page
      .getByRole("button", { name: "Mark as previously visited" })
      .click();
    await page.getByLabel("Visit date").fill("2024-06-01");
    await page.getByLabel("Rating").selectOption("4");
    await page
      .getByRole("button", { name: "Mark as previously visited" })
      .click();
    await expect(page.getByText("Previously visited")).toBeVisible({
      timeout: 10_000,
    });
  });

  test("backfill does not show in Recently stamped feed", async ({ page }) => {
    await signIn(page, emailOwner);
    await page.goto("/passport");
    await expect(page.getByText("Recently stamped")).not.toBeVisible();
  });
});
