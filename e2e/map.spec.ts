import { test, expect } from "@playwright/test";

test.describe("public map page", () => {
  test("/map loads and shows Leaflet container", async ({ page }) => {
    await page.goto("/map");

    await expect(page.getByRole("heading", { name: "Map" })).toBeVisible();

    await expect(page.locator(".leaflet-container")).toBeVisible();
  });
});
