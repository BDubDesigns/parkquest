import { expect, type Page } from "@playwright/test";

export async function stampPark(page: Page, slug: string) {
  await page.goto(`/parks/${slug}`);
  await page.getByRole("button", { name: /Stamp (this park|again)!/ }).click();
  await page.getByRole("radio", { name: "Yes" }).check();
  await page.getByRole("button", { name: "Stamp it!" }).click();
  await expect(
    page.getByText("Today's stamp is already in your passport."),
  ).toBeVisible({ timeout: 10_000 });
  await page.waitForTimeout(300);
}
