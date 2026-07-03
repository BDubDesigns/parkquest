import { test, expect, type Page } from "@playwright/test";
import { signIn, signUp } from "./helpers/auth";

const emailA = `test-stickers-${Date.now()}-a@example.com`;
const emailB = `test-stickers-${Date.now()}-b@example.com`;
const nameA = "Alice";
const nameB = "Bob";

async function stampPark(page: Page, slug: string) {
  await page.goto(`/parks/${slug}`);
  await page.getByRole("button", { name: /Stamp (this park|again)!/ }).click();
  await page.getByRole("radio", { name: "Yes" }).check();
  await page.getByRole("button", { name: "Stamp it!" }).click();
  await expect(
    page.getByText("Today's stamp is already in your passport."),
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
    await expect(page.getByText("Stickers (1 / 3)")).toBeVisible();
    await expect(page.getByText("Earned", { exact: true })).toBeVisible();
    await expect(
      page.getByText("Still to earn", { exact: true }),
    ).toBeVisible();

    const earned = page.getByText("Earned", { exact: true }).locator("..");
    await expect(earned.getByText("First Stamp")).toBeVisible();
    await expect(earned.getByText("Stamped your first park.")).toBeVisible();

    const toEarn = page.getByText("Still to earn").locator("..");
    await expect(toEarn.getByText("Five Parks")).toBeVisible();
    await expect(toEarn.getByText("Return Explorer")).toBeVisible();
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
    await expect(page.getByText("Stickers (2 / 3)")).toBeVisible();
    await expect(page.getByText("Stamped 5 different parks.")).toBeVisible();
  });

  test("same-park same-day shows locked state", async ({ page }) => {
    await signIn(page, emailA);

    await page.goto("/parks/whatcom-falls-park");
    await expect(
      page.getByText("Today's stamp is already in your passport."),
    ).toBeVisible();

    await expect(
      page.getByText("Come back tomorrow for a fresh stamp."),
    ).toBeVisible();
  });

  test("second family sees all stickers as unearned", async ({ page }) => {
    await signUp(page, nameB, emailB);

    await page.goto("/passport");
    await expect(page.getByText("Stickers (0 / 3)")).toBeVisible();
    await expect(page.getByText("Earned", { exact: true })).not.toBeVisible();
    await expect(
      page.getByText("Still to earn", { exact: true }),
    ).toBeVisible();

    const toEarn = page
      .getByText("Still to earn", { exact: true })
      .locator("..");
    await expect(toEarn.getByText("First Stamp")).toBeVisible();
    await expect(toEarn.getByText("Five Parks")).toBeVisible();
    await expect(toEarn.getByText("Return Explorer")).toBeVisible();
  });

  test("same-park same-day on first family shows 2/3 stickers", async ({
    page,
  }) => {
    await signIn(page, emailA);

    await page.goto("/passport");
    await expect(page.getByText("Stickers (2 / 3)")).toBeVisible();
  });
});
