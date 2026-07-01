import { test, expect, type Page } from "@playwright/test";

const emailA = `test-stickers-${Date.now()}-a@example.com`;
const emailB = `test-stickers-${Date.now()}-b@example.com`;
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
  await page.getByRole("button", { name: "Save Stamp" }).click();
  await expect(
    page.getByText("Stamped! This park is in your family passport."),
  ).toBeVisible({ timeout: 10_000 });
  await page.waitForTimeout(300);
}

test.describe.serial("sticker awards", () => {
  test("sign up first user", async ({ page }) => {
    await signUp(page, nameA, emailA);
  });

  test("first stamp earns First Stamp sticker", async ({ page }) => {
    await signIn(page, emailA);
    await stampPark(page, "whatcom-falls-park");

    await page.goto("/passport");
    await expect(page.getByText("First Stamp")).toBeVisible();
    await expect(page.getByText("Stamped your first park.")).toBeVisible();
    await expect(page.getByText("Five Parks")).not.toBeVisible();
    await expect(page.getByText("Return Explorer")).not.toBeVisible();
  });

  test("stamp second park — no Five Parks yet", async ({ page }) => {
    await signIn(page, emailA);
    await stampPark(page, "arroyo-park");
  });

  test("stamp third park", async ({ page }) => {
    await signIn(page, emailA);
    await stampPark(page, "big-rock-garden");
  });

  test("stamp fourth park", async ({ page }) => {
    await signIn(page, emailA);
    await stampPark(page, "birchwood-park");
  });

  test("stamp fifth park earns Five Parks sticker", async ({ page }) => {
    await signIn(page, emailA);
    await stampPark(page, "bloedel-donovan");

    await page.goto("/passport");
    await expect(page.getByText("Five Parks")).toBeVisible();
    await expect(page.getByText("Stamped 5 different parks.")).toBeVisible();
  });

  test("repeat stamp earns Return Explorer sticker", async ({ page }) => {
    await signIn(page, emailA);

    await page.goto("/parks/whatcom-falls-park");
    await page.getByRole("button", { name: /Stamp again!/ }).click();
    await page.getByRole("radio", { name: "Yes" }).check();
    await page.getByRole("button", { name: "Save Stamp" }).click();
    await expect(page.getByText("Stamped 2 times")).toBeVisible({
      timeout: 10_000,
    });
    await page.waitForTimeout(500);

    await page.goto("/passport");
    await expect(page.getByText("Return Explorer")).toBeVisible();
    await expect(
      page.getByText("Returned to a park you already stamped."),
    ).toBeVisible();
  });

  test("second family sees no stickers", async ({ page }) => {
    await signUp(page, nameB, emailB);

    await page.goto("/passport");
    await expect(page.getByText("First Stamp")).not.toBeVisible();
    await expect(page.getByText("Five Parks")).not.toBeVisible();
    await expect(page.getByText("Return Explorer")).not.toBeVisible();
  });
});
