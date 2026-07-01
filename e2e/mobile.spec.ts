import { test, expect } from "@playwright/test";

test.use({ viewport: { width: 390, height: 844 } });

test("mobile app shell reaches the primary public flows", async ({ page }) => {
  await page.goto("/");

  const nav = page.getByRole("navigation", { name: "Mobile navigation" });
  await expect(nav).toBeVisible();
  await expect(nav.getByRole("link", { name: "Home" })).toBeVisible();
  await expect(nav.getByRole("link", { name: "Parks" })).toBeVisible();
  await expect(nav.getByRole("link", { name: "Map" })).toBeVisible();
  await expect(nav.getByRole("link", { name: "Passport" })).toBeVisible();
  await expect(
    nav.getByRole("link", { name: /Account|Sign in/ }),
  ).toBeVisible();

  await nav.getByRole("link", { name: "Parks" }).click();
  await expect(page.getByRole("heading", { name: "Parks" })).toBeVisible();

  await page.getByRole("link", { name: "Whatcom Falls Park" }).click();
  await expect(
    page.getByRole("heading", { name: "Whatcom Falls Park" }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Sign in" }).first(),
  ).toBeVisible();

  await nav.getByRole("link", { name: "Map" }).click();
  await expect(page.getByRole("heading", { name: "Map" })).toBeVisible();
  await expect(page.locator(".leaflet-container")).toBeVisible();

  const hasHorizontalOverflow = await page.evaluate(
    () =>
      document.documentElement.scrollWidth >
      document.documentElement.clientWidth,
  );
  expect(hasHorizontalOverflow).toBe(false);
});

test("mobile Passport navigation preserves the signed-out redirect", async ({
  page,
}) => {
  await page.goto("/");

  const nav = page.getByRole("navigation", { name: "Mobile navigation" });
  await nav.getByRole("link", { name: "Passport" }).click();

  await expect(page).toHaveURL(/\/sign-in$/);
  await expect(page.getByRole("heading", { name: "Sign in" })).toBeVisible();
});

test("web app manifest exposes installable app metadata", async ({
  request,
}) => {
  const response = await request.get("/manifest.webmanifest");
  expect(response.ok()).toBe(true);

  const manifest = await response.json();
  expect(manifest).toMatchObject({
    name: "ParkQuest Family Park Passport",
    short_name: "ParkQuest",
    start_url: "/",
    display: "standalone",
  });
  expect(manifest.icons).toEqual(
    expect.arrayContaining([
      expect.objectContaining({ sizes: "192x192", type: "image/png" }),
      expect.objectContaining({ sizes: "512x512", type: "image/png" }),
      expect.objectContaining({ purpose: "maskable" }),
    ]),
  );
});
