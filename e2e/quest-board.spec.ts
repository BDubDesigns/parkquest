import { test, expect, type Page } from "@playwright/test";
import { signIn, signUp } from "./helpers/auth";
import { stampPark } from "./helpers/stamp";

const emailA = `test-qb-${Date.now()}-a@example.com`;
const emailB = `test-qb-${Date.now()}-b@example.com`;

function getQuestBoardSection(page: Page) {
  return page
    .getByRole("heading", { name: "Quest Board" })
    .locator("xpath=ancestor::section");
}

test.describe.serial("quest board lifecycle", () => {
  test("sign up", async ({ page }) => {
    await signUp(page, "Alice", emailA);
  });

  test("Quest Board shows 4 quests on first passport visit", async ({
    page,
  }) => {
    await signIn(page, emailA);
    await page.goto("/passport");

    const section = getQuestBoardSection(page);
    await expect(section).toBeVisible({ timeout: 10_000 });

    const items = section.locator("li");
    await expect(items).toHaveCount(4);
  });

  test("stamp Whatcom Falls completes all 4 quests", async ({ page }) => {
    await signIn(page, emailA);
    await stampPark(page, "whatcom-falls-park");

    await page.goto("/passport");

    const section = getQuestBoardSection(page);
    const completedChecks = section.locator('svg[aria-label="Completed"]');
    await expect(completedChecks).toHaveCount(4);
  });

  test("refresh warning appears with incomplete quests; confirm replaces board", async ({
    page,
  }) => {
    await signUp(page, "Bob", emailB);

    await page.goto("/passport");

    const section = getQuestBoardSection(page);
    await expect(section).toBeVisible({ timeout: 10_000 });
    await expect(section.locator("li")).toHaveCount(4);

    // Incomplete quests — refresh should show a warning
    await page.getByRole("button", { name: "Refresh Quest Board" }).click();

    await expect(
      page.getByText(
        "Refreshing your Quest Board will replace unfinished quests.",
      ),
    ).toBeVisible({ timeout: 10_000 });

    // Confirm the refresh
    await page
      .getByRole("button", { name: "Replace unfinished quests" })
      .click();

    await expect(page.getByText("Refreshed today")).toBeVisible({
      timeout: 10_000,
    });

    const newSection = getQuestBoardSection(page);
    await expect(newSection.locator("li")).toHaveCount(4);
  });

  test("refreshed-today state hides the Refresh button", async ({ page }) => {
    await signIn(page, emailB);
    await page.goto("/passport");

    await expect(page.getByText("Refreshed today")).toBeVisible({
      timeout: 10_000,
    });

    await expect(
      page.getByRole("button", { name: "Refresh Quest Board" }),
    ).not.toBeVisible();
  });
});
