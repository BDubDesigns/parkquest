import { expect, type Page } from "@playwright/test";

export const e2ePassword = "testpassword123";

export async function signUp(page: Page, name: string, email: string) {
  await page.goto("/sign-up");
  await page.getByLabel("Name").fill(name);
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill(e2ePassword);
  await page.getByRole("button", { name: "Sign up" }).click();
  await page.waitForURL("**/account", { timeout: 45_000 });
  await expect(page.getByRole("heading", { name: "Account" })).toBeVisible({
    timeout: 10_000,
  });
}

export async function signIn(page: Page, email: string) {
  await page.goto("/sign-in");
  // If already authenticated, Better Auth redirects away from /sign-in
  // immediately. Short wait lets the redirect settle.
  try {
    await page.waitForURL("**/account", { timeout: 5_000 });
    return; // Already logged in
  } catch {
    // Still on /sign-in — proceed with form fill
  }

  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill(e2ePassword);
  await page.getByRole("button", { name: "Sign in" }).click();
  await page.waitForURL("**/account", { timeout: 45_000 });
  await expect(page.getByRole("heading", { name: "Account" })).toBeVisible({
    timeout: 10_000,
  });
}
