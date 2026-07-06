import { test, expect } from "@playwright/test";
import { signUp, signIn } from "./helpers/auth";

const email = `test-auth-${Date.now()}@example.com`;

test("sign up creates an account and shows family group", async ({ page }) => {
  await signUp(page, "Alice", email);
  await expect(page.getByRole("heading", { name: "Account" })).toBeVisible();
});

test("sign in works with existing credentials", async ({ page }) => {
  await signIn(page, email);
  await expect(page.getByRole("heading", { name: "Account" })).toBeVisible();
});

test("public routes remain accessible without auth", async ({ page }) => {
  await page.goto("/parks");
  await expect(
    page.getByRole("heading", { name: "Find your next park" }),
  ).toBeVisible();
  await page.goto("/map");
  await expect(
    page.getByRole("heading", { name: "Explore the park map" }),
  ).toBeVisible();
});
