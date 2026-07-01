import { test, expect, type Page } from "@playwright/test";

const emailA = `test-challenges-${Date.now()}-a@example.com`;
const emailB = `test-challenges-${Date.now()}-b@example.com`;
const password = "testpassword123";
const nameA = "Alice";
const nameB = "Bob";

function getChallengeSection(page: Page) {
  return page.getByText("Today's Passport Challenges").locator("..");
}

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
  await page.getByRole("button", { name: "Save Stamp" }).click();
  await expect(
    page.getByText("Stamped! This park is in your family passport."),
  ).toBeVisible({ timeout: 10_000 });
  await page.waitForTimeout(300);
}

test.describe.serial("passport challenges", () => {
  test("sign up first user", async ({ page }) => {
    await signUp(page, nameA, emailA);
  });

  test("shows 4 challenges assigned before any stamp", async ({ page }) => {
    await signIn(page, emailA);

    await page.goto("/passport");

    await expect(page.getByText("Today's Passport Challenges")).toBeVisible({
      timeout: 10_000,
    });

    const section = getChallengeSection(page);
    const items = section.locator("li");
    await expect(items).toHaveCount(4);

    await expect(section.getByText("Park Passport Stamp")).toBeVisible();
    await expect(section.getByText("Park Scout")).toBeVisible();
    await expect(section.getByText("Tiny Mountaineer")).toBeVisible();
    await expect(section.getByText("Playground Mission")).toBeVisible();

    await expect(
      page.getByText("0 Adventure Points", { exact: true }),
    ).toBeVisible();
  });

  test("stamp Whatcom Falls completes all 4 challenges", async ({ page }) => {
    await signIn(page, emailA);
    await stampPark(page, "whatcom-falls-park");

    await page.goto("/passport");

    const section = getChallengeSection(page);
    await expect(section.locator("li")).toHaveCount(4);

    await expect(section.getByText("Park Passport Stamp")).toBeVisible();
    await expect(section.getByText("Park Scout")).toBeVisible();
    await expect(section.getByText("Tiny Mountaineer")).toBeVisible();
    await expect(section.getByText("Playground Mission")).toBeVisible();

    const xpAmounts = section.getByText(/Adventure Points/);
    await expect(xpAmounts.first()).toBeVisible();

    await expect(page.getByText("125 Adventure Points")).toBeVisible();
  });

  test("second family sees their own challenges", async ({ page }) => {
    await signUp(page, nameB, emailB);

    await page.goto("/passport");

    await expect(page.getByText("Today's Passport Challenges")).toBeVisible({
      timeout: 10_000,
    });

    const section = getChallengeSection(page);
    await expect(section.locator("li")).toHaveCount(4);
    await expect(section.getByText("Park Passport Stamp")).toBeVisible();

    await expect(
      page.getByText("0 Adventure Points", { exact: true }),
    ).toBeVisible();
  });
});
