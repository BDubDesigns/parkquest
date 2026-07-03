import { test, expect } from "@playwright/test";
import { signIn, signUp } from "./helpers/auth";

const emailA = `test-xp-${Date.now()}-a@example.com`;
const emailB = `test-xp-${Date.now()}-b@example.com`;
const nameA = "Alice";
const nameB = "Bob";

test.describe.serial("adventure points", () => {
  test("sign up first user", async ({ page }) => {
    await signUp(page, nameA, emailA);
  });

  test("first stamp also completes daily challenges for 125 total", async ({
    page,
  }) => {
    await signIn(page, emailA);

    await page.goto("/parks/whatcom-falls-park");
    await page.getByRole("button", { name: "Stamp this park!" }).click();
    await page.getByRole("radio", { name: "Yes" }).check();
    await page
      .getByLabel(/What do you want to remember/)
      .fill("Lara loved the waterfall overlook!");
    await page.getByRole("button", { name: "Stamp it!" }).click();
    await expect(
      page.getByText("Today's stamp is already in your passport."),
    ).toBeVisible({ timeout: 10_000 });

    await page.goto("/passport");
    await expect(page.getByText("125 Adventure Points")).toBeVisible({
      timeout: 10_000,
    });
  });

  test("second park on same day adds base stamp points", async ({ page }) => {
    await signIn(page, emailA);

    await page.goto("/parks/arroyo-park");
    await page.getByRole("button", { name: "Stamp this park!" }).click();
    await page.getByRole("radio", { name: "Yes" }).check();
    await page.getByRole("button", { name: "Stamp it!" }).click();
    await expect(
      page.getByText("Today's stamp is already in your passport."),
    ).toBeVisible({ timeout: 10_000 });
    await page.waitForTimeout(500);

    await page.goto("/passport");
    await expect(page.getByText("175 Adventure Points")).toBeVisible({
      timeout: 10_000,
    });
  });

  test("third park on same day adds base stamp points (50)", async ({
    page,
  }) => {
    await signIn(page, emailA);

    await page.goto("/passport");
    await expect(page.getByText("175 Adventure Points")).toBeVisible({
      timeout: 10_000,
    });

    await page.goto("/parks/big-rock-garden");

    await expect(
      page.getByText("You haven't stamped this park yet"),
    ).toBeVisible();

    await page.getByRole("button", { name: "Stamp this park!" }).click();
    await page.getByRole("radio", { name: "Yes" }).check();
    await page.getByRole("button", { name: "Stamp it!" }).click();
    await expect(
      page.getByText("Today's stamp is already in your passport."),
    ).toBeVisible({ timeout: 10_000 });
    await page.waitForTimeout(500);

    await page.goto("/passport");
    await expect(page.getByText("225 Adventure Points")).toBeVisible({
      timeout: 10_000,
    });
  });

  test("fourth park on same day does not add base stamp points (0)", async ({
    page,
  }) => {
    await signIn(page, emailA);

    await page.goto("/passport");
    await expect(page.getByText("225 Adventure Points")).toBeVisible({
      timeout: 10_000,
    });

    await page.goto("/parks/birchwood-park");

    await expect(
      page.getByText("You haven't stamped this park yet"),
    ).toBeVisible();

    await page.getByRole("button", { name: "Stamp this park!" }).click();
    await page.getByRole("radio", { name: "Yes" }).check();
    await page.getByRole("button", { name: "Stamp it!" }).click();
    await expect(
      page.getByText("Today's stamp is already in your passport."),
    ).toBeVisible({ timeout: 10_000 });
    await page.waitForTimeout(500);

    await page.goto("/passport");
    await expect(page.getByText("225 Adventure Points")).toBeVisible({
      timeout: 10_000,
    });
  });

  test("second family sees 0 points", async ({ page }) => {
    await signUp(page, nameB, emailB);

    await page.goto("/passport");
    await expect(
      page.getByText("0 Adventure Points", { exact: true }),
    ).toBeVisible({
      timeout: 10_000,
    });
  });
});
