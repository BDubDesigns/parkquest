import { test, expect } from "@playwright/test";
import { signIn, signUp } from "./helpers/auth";

const emailA = `test-${Date.now()}-a@example.com`;
const emailB = `test-${Date.now()}-b@example.com`;
const nameA = "Alice";
const nameB = "Bob";

test("signed-out /passport redirects to /sign-in", async ({ page }) => {
  await page.goto("/passport");

  await expect(page.getByRole("heading", { name: "Sign in" })).toBeVisible({
    timeout: 10_000,
  });
});

test.describe.serial("passport progress", () => {
  test("sign up first user", async ({ page }) => {
    await signUp(page, nameA, emailA);
  });

  test("no stamps shows 0 / 46", async ({ page }) => {
    await signIn(page, emailA);

    await page.goto("/passport");

    await expect(page.getByText(/0 \/ 46/)).toBeVisible({ timeout: 10_000 });

    await expect(page.getByText("Not yet visited (46)")).toBeVisible();
  });

  test("after stamping one park, shows 1 / 46", async ({ page }) => {
    await signIn(page, emailA);

    await page.goto("/parks/whatcom-falls-park");
    await page.getByRole("button", { name: "Stamp this park!" }).click();
    await page.getByRole("radio", { name: "Yes" }).check();
    await page
      .getByLabel(/What do you want to remember/)
      .fill("Beautiful waterfall!");
    await page.getByRole("button", { name: "Stamp it!" }).click();

    await expect(
      page.getByText("Today's stamp is already in your passport."),
    ).toBeVisible({ timeout: 10_000 });

    await page.goto("/passport");

    await expect(page.getByText(/1 \/ 46.*parks visited/)).toBeVisible({
      timeout: 10_000,
    });

    await expect(
      page.getByRole("link", { name: "Whatcom Falls Park" }).first(),
    ).toBeVisible();

    await expect(page.getByText("Visited parks (1)")).toBeVisible();
    await expect(
      page
        .locator("li")
        .filter({ hasText: "Whatcom Falls Park" })
        .filter({ hasText: "Stamped" }),
    ).toBeVisible();

    await expect(page.getByText("Not yet visited (45)")).toBeVisible();
  });

  test("same-day duplicate shows locked state and does not affect progress", async ({
    page,
  }) => {
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

    await page.goto("/passport");

    await expect(page.getByText(/1 \/ 46.*parks visited/)).toBeVisible({
      timeout: 10_000,
    });

    await expect(page.getByText("Visited parks (1)")).toBeVisible();
    await expect(
      page
        .locator("li")
        .filter({ hasText: "Whatcom Falls Park" })
        .filter({ hasText: "Stamped" }),
    ).toBeVisible();
  });

  test("second family sees 0 / 46", async ({ page }) => {
    await signUp(page, nameB, emailB);

    await page.goto("/passport");

    await expect(page.getByText(/0 \/ 46.*parks visited/)).toBeVisible({
      timeout: 10_000,
    });

    await expect(page.getByText("Not yet visited (46)")).toBeVisible();

    await expect(page.getByText("Beautiful waterfall!")).not.toBeVisible();
  });
});
