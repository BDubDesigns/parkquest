import { test, expect, type Page } from "@playwright/test";

const emailA = `test-${Date.now()}-a@example.com`;
const emailB = `test-${Date.now()}-b@example.com`;
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
  await page.goto("/sign-in");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill(password);
  await page.getByRole("button", { name: "Sign in" }).click();
  await expect(page.getByRole("heading", { name: "Account" })).toBeVisible({
    timeout: 10_000,
  });
}

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
  test("sign up first user", async ({ page }) => {
    await signUp(page, nameA, emailA);
  });

  test("stamp a park from the detail page", async ({ page }) => {
    await signIn(page, emailA);

    await page.goto("/parks/whatcom-falls-park");

    await expect(
      page.getByText("You haven't stamped this park yet"),
    ).toBeVisible();

    await page.getByRole("button", { name: "Stamp this park!" }).click();

    await page.getByRole("radio", { name: "Yes" }).check();
    await page
      .getByLabel(/What do you want to remember/)
      .fill("Lara loved the waterfall overlook!");

    await page.getByRole("button", { name: "Stamp it!" }).click();

    await expect(
      page.getByText("Stamped! This park is in your family passport."),
    ).toBeVisible({ timeout: 10_000 });

    await expect(page.getByText("Stamped 1 time")).toBeVisible();

    await expect(
      page.getByText("Lara loved the waterfall overlook!"),
    ).toBeVisible();
  });

  test("same-park same-day duplicate is rejected", async ({ page }) => {
    await signIn(page, emailA);

    await page.goto("/parks/whatcom-falls-park");

    await expect(
      page.getByText("Stamped! This park is in your family passport."),
    ).toBeVisible();

    await page.getByRole("button", { name: "Stamp again!" }).click();
    await page.getByRole("radio", { name: "Yes" }).check();
    await page.getByRole("button", { name: "Stamp it!" }).click();

    await expect(
      page.getByText(
        "You already stamped this park today. Come back another day for a fresh stamp.",
      ),
    ).toBeVisible({ timeout: 10_000 });
  });

  test("different park on same day is allowed", async ({ page }) => {
    await signIn(page, emailA);

    await page.goto("/parks/arroyo-park");

    await expect(
      page.getByText("You haven't stamped this park yet"),
    ).toBeVisible();

    await page.getByRole("button", { name: "Stamp this park!" }).click();
    await page.getByRole("radio", { name: "Yes" }).check();
    await page.getByRole("button", { name: "Stamp it!" }).click();

    await expect(
      page.getByText("Stamped! This park is in your family passport."),
    ).toBeVisible({ timeout: 10_000 });

    await expect(page.getByText("Stamped 1 time")).toBeVisible();
  });

  test("second family cannot see first family's stamps", async ({ page }) => {
    await signUp(page, nameB, emailB);

    await page.goto("/parks/whatcom-falls-park");

    await expect(
      page.getByText("You haven't stamped this park yet"),
    ).toBeVisible();

    await expect(
      page.getByText("Lara loved the waterfall overlook!"),
    ).not.toBeVisible();
  });

  test("stamp color can be changed", async ({ page }) => {
    await signIn(page, emailA);

    await page.goto("/parks/whatcom-falls-park");
    await page.getByRole("button", { name: "Stamp again!" }).click();

    const amberButton = page.getByRole("button", { name: "Amber gold" });
    await amberButton.click();
    await expect(amberButton).toHaveAttribute("aria-pressed", "true");
  });

  test("stamp rotation slider updates tilt value", async ({ page }) => {
    await signIn(page, emailA);

    await page.goto("/parks/whatcom-falls-park");
    await page.getByRole("button", { name: "Stamp again!" }).click();

    const slider = page.getByRole("slider", { name: "Stamp tilt" });
    await expect(slider).toBeVisible();
    await slider.fill("10");
    await expect(page.getByText("10°", { exact: true })).toBeVisible();
  });
});
