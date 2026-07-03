import { test, expect } from "@playwright/test";
import { signUp, signIn } from "./helpers/auth";

test("signed-out user sees only official park name", async ({ page }) => {
  await page.goto("/parks/elizabeth-park");
  await expect(
    page.getByRole("heading", { name: /Elizabeth Park/ }),
  ).toBeVisible();
  await expect(page.getByText("Add a family nickname")).not.toBeVisible();
});

test("signed-out parks list shows official names only", async ({ page }) => {
  await page.goto("/parks");
  await expect(
    page.getByRole("link", { name: "Elizabeth Park" }),
  ).toBeVisible();
});

test.describe.serial("park nicknames", () => {
  const emailA = `test-nick-${Date.now()}-a@example.com`;
  const emailB = `test-nick-${Date.now()}-b@example.com`;

  test("sign up first user", async ({ page }) => {
    await signUp(page, "Charlie", emailA);
  });

  test("family can add a nickname and it appears on passport", async ({
    page,
  }) => {
    await signIn(page, emailA);
    await page.goto("/parks/elizabeth-park");
    await page.getByRole("button", { name: "Add a family nickname" }).click();
    await page.getByLabel("Family nickname").fill("The Big Swing Park");
    await page.getByRole("button", { name: "Add nickname" }).click();
    await expect(page.getByText("The Big Swing Park")).toBeVisible();
    await expect(page.getByText("Official: Elizabeth Park")).toBeVisible();
    await page.goto("/passport");
    await expect(page.getByText("The Big Swing Park")).toBeVisible();
  });

  test("another family does not see the nickname", async ({ page }) => {
    await signUp(page, "Diana", emailB);
    await page.goto("/parks/elizabeth-park");
    await expect(page.getByText("The Big Swing Park")).not.toBeVisible();
    await expect(
      page.getByRole("heading", { name: /Elizabeth Park/ }),
    ).toBeVisible();
  });
});
