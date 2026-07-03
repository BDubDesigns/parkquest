import { test, expect } from "@playwright/test";

test.describe("public map page", () => {
  test("/map loads and shows Leaflet container", async ({ page }) => {
    await page.goto("/map");

    await expect(page.getByRole("heading", { name: "Map" })).toBeVisible();

    await expect(page.locator(".leaflet-container")).toBeVisible();
  });

  test("signed-out user sees no stamp status in popups", async ({ page }) => {
    await page.goto("/map");
    await expect(page.locator(".leaflet-container")).toBeVisible();

    const markers = page.locator("img.leaflet-marker-icon");
    await expect(markers.first()).toBeVisible({ timeout: 10_000 });
    await markers.first().click();
    await page.waitForTimeout(300);

    const popup = page.locator(".leaflet-popup-content");
    await expect(popup).toBeVisible();
    await expect(popup).toContainText(/amenity|amenities/);
    await expect(popup).not.toContainText("Stamped");
    await expect(popup).not.toContainText("Not stamped yet");
  });
});
