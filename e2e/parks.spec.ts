import { test, expect } from "@playwright/test";

test.describe("public park pages", () => {
  test("/parks lists seeded parks", async ({ page }) => {
    await page.goto("/parks");

    await expect(
      page.getByRole("heading", { name: "Find your next park" }),
    ).toBeVisible();

    await expect(
      page.getByRole("link", { name: "Whatcom Falls Park" }),
    ).toBeVisible();
  });

  test("/parks/[slug] shows park detail with amenities", async ({ page }) => {
    await page.goto("/parks/whatcom-falls-park");

    await expect(
      page.getByRole("heading", { name: "Whatcom Falls Park" }),
    ).toBeVisible();

    await expect(page.getByText("Trail", { exact: true })).toBeVisible();
    await expect(page.getByText("Playground", { exact: true })).toBeVisible();
    await expect(page.getByText("Picnic Table", { exact: true })).toBeVisible();

    await expect(page.getByText(/48\.\d{4}/)).toBeVisible();

    await expect(
      page.getByRole("link", { name: /whatcom-falls-park$/ }),
    ).toBeVisible();
  });
});
