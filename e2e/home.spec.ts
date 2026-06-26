import { test, expect } from "@playwright/test";

test("home page renders the tagline on a mobile viewport", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", {
      name: "Turn every park into an adventure.",
    }),
  ).toBeVisible();
});
