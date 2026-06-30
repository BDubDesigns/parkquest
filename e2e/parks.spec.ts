import { test, expect } from "@playwright/test";

test.describe("public park pages", () => {
  test("/parks lists seeded parks", async ({ page }) => {
    await page.goto("/parks");

    await expect(page.getByRole("heading", { name: "Parks" })).toBeVisible();

    await expect(
      page.getByRole("link", { name: "Whatcom Falls Park" }),
    ).toBeVisible();
  });

  test("/parks/[slug] shows park detail", async ({ page }) => {
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

    await expect(
      page.getByRole("heading", { name: "Official park page" }),
    ).toBeVisible();

    await expect(
      page.getByRole("heading", { name: "Data source" }),
    ).toBeVisible();
  });

  test("/parks/non-existent-slug shows not-found state", async ({ page }) => {
    await page.goto("/parks/non-existent-slug");

    await expect(
      page.getByRole("heading", { name: "Park not found" }),
    ).toBeVisible();

    await expect(
      page.getByText("The park you are looking for does not exist"),
    ).toBeVisible();

    await expect(
      page.getByRole("link", { name: "Back to parks" }),
    ).toBeVisible();
  });
});
