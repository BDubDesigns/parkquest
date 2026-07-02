import { test, expect, type Page } from "@playwright/test";

const emailOwner = `test-backfill-${Date.now()}-owner@example.com`;
const emailOtherFamily = `test-backfill-${Date.now()}-other@example.com`;
const password = "testpassword123";

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

test("signed-out user cannot see backfill option", async ({ page }) => {
  await page.goto("/parks/whatcom-falls-park");

  await expect(
    page.getByRole("button", { name: "Mark as previously visited" }),
  ).not.toBeVisible();
});

test.describe.serial("backfill flow", () => {
  test("sign up owner", async ({ page }) => {
    await signUp(page, "Charlie", emailOwner);
  });

  test("owner can mark a park as previously visited", async ({ page }) => {
    await signIn(page, emailOwner);

    await page.goto("/parks/whatcom-falls-park");

    await expect(
      page.getByText("You haven't stamped this park yet"),
    ).toBeVisible();

    await page
      .getByRole("button", { name: "Mark as previously visited" })
      .click();

    await page.getByLabel("Visit date (optional)").fill("2024-06-01");
    await page.getByLabel("Rating (optional)").selectOption("4");
    await page
      .getByLabel(/Private memory or note/)
      .fill("We came here a lot before ParkQuest!");

    await page
      .getByRole("button", { name: "Mark as previously visited" })
      .click();

    await expect(page.getByText("Previously visited")).toBeVisible({
      timeout: 10_000,
    });

    await expect(
      page.getByText("We came here a lot before ParkQuest!"),
    ).toBeVisible();
  });

  test("backfill option is not shown after visit exists", async ({ page }) => {
    await signIn(page, emailOwner);

    await page.goto("/parks/whatcom-falls-park");

    await expect(
      page.getByRole("button", { name: "Mark as previously visited" }),
    ).not.toBeVisible();
  });

  test("backfill appears as visited in passport", async ({ page }) => {
    await signIn(page, emailOwner);

    await page.goto("/passport");

    await expect(
      page.getByRole("link", { name: "Whatcom Falls Park" }),
    ).toBeVisible();

    await expect(page.getByText("1 / 46")).toBeVisible();
  });

  test("backfill does not show in recently stamped feed", async ({ page }) => {
    await signIn(page, emailOwner);

    await page.goto("/passport");

    await expect(
      page.getByRole("heading", { name: "Recently stamped" }),
    ).not.toBeVisible();
  });

  test("backfill does not award Adventure Points", async ({ page }) => {
    await signIn(page, emailOwner);

    await page.goto("/passport");

    const apNumber = page.locator("span.text-amber-300").first();
    await expect(apNumber).toHaveText("0");
  });

  test("live stamp still works on backfilled park", async ({ page }) => {
    await signIn(page, emailOwner);

    await page.goto("/parks/whatcom-falls-park");

    await expect(
      page.getByText("This park is in your family history."),
    ).toBeVisible();

    await page.getByRole("button", { name: "Stamp again!" }).click();
    await page.getByRole("radio", { name: "Yes" }).check();
    await page.getByRole("button", { name: "Stamp it!" }).click();

    await expect(
      page.getByText("Today's stamp is already in your passport."),
    ).toBeVisible({ timeout: 10_000 });

    await expect(page.getByText("Stamped 1 time")).toBeVisible();
  });
});

test.describe.serial("family isolation", () => {
  test("sign up other family", async ({ page }) => {
    await signUp(page, "Eve", emailOtherFamily);
  });

  test("other family does not see backfill of first family", async ({
    page,
  }) => {
    await signIn(page, emailOtherFamily);

    await page.goto("/parks/whatcom-falls-park");

    await expect(
      page.getByText("You haven't stamped this park yet"),
    ).toBeVisible();

    await expect(
      page.getByText("We came here a lot before ParkQuest!"),
    ).not.toBeVisible();
  });
});
