import { test, expect } from "@playwright/test";

const email = `test-${Date.now()}@example.com`;
const password = "testpassword123";
const name = "Test User";

test.describe.serial("auth flow", () => {
  test("sign up creates an account and shows family group", async ({
    page,
  }) => {
    await page.goto("/sign-up");

    await expect(page.getByRole("heading", { name: "Sign up" })).toBeVisible();

    await page.getByLabel("Name").fill(name);
    await page.getByLabel("Email").fill(email);
    await page.getByLabel("Password").fill(password);

    await page.getByRole("button", { name: "Sign up" }).click();

    await expect(page.getByRole("heading", { name: "Account" })).toBeVisible({
      timeout: 10_000,
    });

    await expect(page.getByText(email)).toBeVisible();
    await expect(page.getByText(name, { exact: true })).toBeVisible();
    await expect(page.getByText(`${name}'s Family`)).toBeVisible();
    await expect(page.getByText("owner")).toBeVisible();
  });

  test("sign in works with existing credentials", async ({ page }) => {
    await page.goto("/sign-in");

    await expect(page.getByRole("heading", { name: "Sign in" })).toBeVisible();

    await page.getByLabel("Email").fill(email);
    await page.getByLabel("Password").fill(password);

    await page.getByRole("button", { name: "Sign in" }).click();

    await expect(page.getByRole("heading", { name: "Account" })).toBeVisible({
      timeout: 10_000,
    });
  });

  test("protected /account redirects to /sign-in when signed out", async ({
    context,
  }) => {
    const page = await context.newPage();
    await page.goto("/account");

    await expect(page.getByRole("heading", { name: "Sign in" })).toBeVisible({
      timeout: 10_000,
    });
  });

  test("public routes remain accessible without auth", async ({ context }) => {
    const page = await context.newPage();

    await page.goto("/parks");
    await expect(page.getByRole("heading", { name: "Parks" })).toBeVisible();

    await page.goto("/map");
    await expect(page.getByRole("heading", { name: "Map" })).toBeVisible();

    await page.goto("/parks/whatcom-falls-park");
    await expect(
      page.getByRole("heading", { name: "Whatcom Falls Park" }),
    ).toBeVisible();
  });
});
