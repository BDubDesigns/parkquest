import { expect, test } from "@playwright/test";

test("homepage exposes the primary family park actions on mobile", async ({
  page,
}) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "Every park can become part of your family story.",
    }),
  ).toBeVisible();
  await expect(page.getByRole("link", { name: "Explore Parks" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Open Map" })).toBeVisible();
  await expect(
    page.getByRole("link", { name: "View Family Passport" }),
  ).toBeVisible();
});
