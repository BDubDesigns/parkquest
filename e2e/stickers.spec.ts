import { test, expect } from "@playwright/test";
import { signUp, signIn } from "./helpers/auth";
import { stampPark } from "./helpers/stamp";

test.describe.serial("sticker awards", () => {
  const email = `test-sticker-${Date.now()}@example.com`;

  test("sign up", async ({ page }) => {
    await signUp(page, "Alice", email);
  });

  test("first stamp earns First Stamp sticker", async ({ page }) => {
    await signIn(page, email);
    await stampPark(page, "whatcom-falls-park");
    await page.goto("/passport");
    await expect(page.getByText("1 of 3 earned")).toBeVisible();
    await expect(page.getByText("First Stamp").first()).toBeVisible();
  });
});
