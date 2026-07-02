import { test, expect, type Page } from "@playwright/test";

const emailA = `test-nickname-${Date.now()}-a@example.com`;
const emailB = `test-nickname-${Date.now()}-b@example.com`;
const password = "testpassword123";
const nameA = "Charlie";
const nameB = "Diana";
const NICKNAME = "Duck Bridge Park";
const OFFICIAL = "Maritime Heritage Park";

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

async function signOut(page: Page) {
  await page.goto("/account");
  await page.getByRole("button", { name: "Sign out" }).click();
  await expect(page.getByRole("button", { name: "Sign in" })).toBeVisible({
    timeout: 10_000,
  });
}

test("signed-out user sees only official park name", async ({ page }) => {
  await page.goto("/parks/maritime-heritage-park");

  await expect(
    page.getByRole("heading", { name: OFFICIAL }),
  ).toBeVisible();

  await expect(
    page.getByText("Add a family nickname"),
  ).not.toBeVisible();
});

test.describe.serial("park nicknames", () => {
  test("sign up first user", async ({ page }) => {
    await signUp(page, nameA, emailA);
  });

  test("family can add a nickname", async ({ page }) => {
    await signIn(page, emailA);

    await page.goto("/parks/maritime-heritage-park");

    await page.getByRole("button", { name: "Add a family nickname" }).click();

    await page.getByPlaceholder("e.g. Duck Bridge Park").fill(NICKNAME);

    await page.getByRole("button", { name: "Add nickname" }).click();

    await expect(
      page.getByText(NICKNAME),
    ).toBeVisible({ timeout: 10_000 });

    await expect(
      page.getByText(`Official: ${OFFICIAL}`),
    ).toBeVisible();
  });

  test("nickname appears on passport page", async ({ page }) => {
    await signIn(page, emailA);

    await page.goto("/passport");

    await expect(
      page.getByRole("link", { name: NICKNAME }).first(),
    ).toBeVisible({ timeout: 10_000 });
  });

  test("another family does not see the nickname", async ({ page }) => {
    await signUp(page, nameB, emailB);

    await page.goto("/parks/maritime-heritage-park");

    await expect(
      page.getByRole("heading", { name: OFFICIAL }),
    ).toBeVisible();

    await expect(page.getByText(NICKNAME)).not.toBeVisible();
  });

  test("family can edit a nickname", async ({ page }) => {
    await signIn(page, emailA);

    await page.goto("/parks/maritime-heritage-park");

    await expect(page.getByText(NICKNAME)).toBeVisible();

    await page.getByRole("button", { name: "Edit nickname" }).click();

    await page.getByPlaceholder("e.g. Duck Bridge Park").fill("Edited Nickname");

    await page.getByRole("button", { name: "Save" }).click();

    await expect(
      page.getByText("Edited Nickname"),
    ).toBeVisible({ timeout: 10_000 });

    await expect(
      page.getByText(`Official: ${OFFICIAL}`),
    ).toBeVisible();
  });

  test("family can remove a nickname", async ({ page }) => {
    await signIn(page, emailA);

    await page.goto("/parks/maritime-heritage-park");

    await expect(page.getByText("Edited Nickname")).toBeVisible();

    await page.getByRole("button", { name: "Edit nickname" }).click();

    await page.getByRole("button", { name: "Remove nickname" }).click();

    await expect(
      page.getByRole("heading", { name: OFFICIAL }),
    ).toBeVisible({ timeout: 10_000 });

    await expect(page.getByText("Edited Nickname")).not.toBeVisible();
  });
});
