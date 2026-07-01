import { test, expect } from "@playwright/test";

test("home page renders the ParkQuest navigation hub", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", { level: 1, name: "ParkQuest" }),
  ).toBeVisible();
  await expect(
    page.getByText("Turn every park into an adventure.").first(),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Explore Parks" }),
  ).toHaveAttribute("href", "/parks");
  await expect(page.getByRole("link", { name: "Open Map" })).toHaveAttribute(
    "href",
    "/map",
  );
  await expect(
    page.getByRole("link", { name: "View Family Passport" }),
  ).toHaveAttribute("href", "/passport");
});
