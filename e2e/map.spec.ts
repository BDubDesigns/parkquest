import { test, expect, type Page } from "@playwright/test";

const emailA = `test-map-${Date.now()}-a@example.com`;
const emailB = `test-map-${Date.now()}-b@example.com`;
const password = "testpassword123";
const nameA = "Alice";
const nameB = "Bob";

async function signUp(page: Page, name: string, email: string) {
  await page.goto("/sign-up");
  await page.getByLabel("Name").fill(name);
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill(password);
  await page.getByRole("button", { name: "Sign up" }).click();
  await expect(page.getByRole("heading", { name: "Account" })).toBeVisible({
    timeout: 10_000,
  });
}

async function signIn(page: Page, email: string) {
  await page.context().clearCookies();
  await page.goto("/sign-in");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill(password);
  await page.getByRole("button", { name: "Sign in" }).click();
  await expect(page.getByRole("heading", { name: "Account" })).toBeVisible({
    timeout: 10_000,
  });
}

async function stampPark(page: Page, slug: string) {
  await page.goto(`/parks/${slug}`);
  await page.getByRole("button", { name: /Stamp (this park|again)!/ }).click();
  await page.getByRole("radio", { name: "Yes" }).check();
  await page
    .getByLabel(/What do you want to remember/)
    .fill("Map test memory for privacy check!");
  await page.getByRole("button", { name: "Stamp it!" }).click();
  await expect(
    page.getByText("Stamped! This park is in your family passport."),
  ).toBeVisible({ timeout: 10_000 });
  await page.waitForTimeout(300);
}

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

test.describe.serial("stamped map markers", () => {
  test("sign up first user", async ({ page }) => {
    await signUp(page, nameA, emailA);
  });

  test("after stamping, stamped marker is visually distinct and shows Stamped in popup", async ({
    page,
  }) => {
    await signIn(page, emailA);
    await stampPark(page, "whatcom-falls-park");

    await page.goto("/map");
    await expect(page.locator(".leaflet-container")).toBeVisible();

    const stamped = page.locator(
      "img.leaflet-marker-icon.leaflet-marker-stamped",
    );
    await expect(stamped).toBeVisible({ timeout: 10_000 });

    await stamped.click();
    await page.waitForTimeout(300);

    const popup = page.locator(".leaflet-popup-content");
    await expect(popup).toContainText("Stamped");
    await expect(popup).toContainText("Whatcom Falls Park");
    await expect(popup).not.toContainText("Map test memory for privacy check!");
  });

  test("unstamped parks show Not stamped yet in popup", async ({ page }) => {
    await signIn(page, emailA);

    await page.goto("/map");
    await expect(page.locator(".leaflet-container")).toBeVisible();

    const unstamped = page.locator(
      "img.leaflet-marker-icon:not(.leaflet-marker-stamped)",
    );
    await expect(unstamped.first()).toBeVisible({ timeout: 10_000 });
    await unstamped.first().click();
    await page.waitForTimeout(300);

    const popup = page.locator(".leaflet-popup-content");
    await expect(popup).toContainText("Not stamped yet");
  });

  test("second family does not see first family's stamped state", async ({
    page,
  }) => {
    await signUp(page, nameB, emailB);

    await page.goto("/map");
    await expect(page.locator(".leaflet-container")).toBeVisible();

    await expect(
      page.locator("img.leaflet-marker-icon.leaflet-marker-stamped"),
    ).toHaveCount(0);

    const markers = page.locator("img.leaflet-marker-icon");
    await markers.first().click();
    await page.waitForTimeout(300);

    const popup = page.locator(".leaflet-popup-content");
    await expect(popup).toBeVisible();
    await expect(popup).not.toContainText("Stamped");
  });
});
