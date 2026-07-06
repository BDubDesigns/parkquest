import { test, expect } from "@playwright/test";
import { signIn, signUp } from "./helpers/auth";
import { stampPark } from "./helpers/stamp";

const emailA = `test-${Date.now()}-a@example.com`;
const nameA = "Alice";

test("park detail shows sign-in prompt for signed-out user", async ({
  page,
}) => {
  await page.goto("/parks/whatcom-falls-park");

  await expect(
    page.getByRole("heading", { name: "Whatcom Falls Park" }),
  ).toBeVisible();

  await expect(page.getByText("Sign in to stamp this park")).toBeVisible();
});

test.describe.serial("stamp flow", () => {
  test("sign up", async ({ page }) => {
    await signUp(page, nameA, emailA);
  });

  test("stamp a park; verify in passport and AP", async ({ page }) => {
    await signIn(page, emailA);
    await stampPark(page, "whatcom-falls-park");
    await expect(page.getByText("Stamped 1 time")).toBeVisible();

    await page.goto("/passport");
    await expect(page.getByText(/1 \/ 46/)).toBeVisible({ timeout: 10_000 });
    // 50 base AP + 75 quest rewards = 125
    await expect(page.getByText(/125\s*Adventure Points/)).toBeVisible({
      timeout: 10_000,
    });
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
    await expect(
      page.getByRole("button", { name: "Stamp again!" }),
    ).not.toBeVisible();
  });

  test("different park on same day is allowed", async ({ page }) => {
    await signIn(page, emailA);
    await stampPark(page, "arroyo-park");
    await expect(page.getByText("Stamped 1 time")).toBeVisible();
  });

  test("fourth park on same day is saved but no base AP", async ({ page }) => {
    await signIn(page, emailA);

    // Third park of the day
    await stampPark(page, "big-rock-garden");

    // Verify AP is at 225 (125 + 50 + 50)
    await page.goto("/passport");
    await expect(page.getByText(/225\s*Adventure Points/)).toBeVisible({
      timeout: 10_000,
    });

    // Fourth park — should save but not add base AP
    await stampPark(page, "birchwood-park");
    await expect(page.getByText("Stamped 1 time")).toBeVisible();

    // AP should be unchanged
    await page.goto("/passport");
    await expect(page.getByText(/225\s*Adventure Points/)).toBeVisible({
      timeout: 10_000,
    });
  });
});
