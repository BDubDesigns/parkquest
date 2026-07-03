import { test, expect, type Page } from "@playwright/test";
import { signIn, signUp } from "./helpers/auth";
import {
  getFamilyGroupId,
  setBoardToYesterday,
  setManualRefreshToYesterday,
} from "./helpers/quest-board-db";

const emailA = `test-qb-${Date.now()}-a@example.com`;
const emailB = `test-qb-${Date.now()}-b@example.com`;
const emailC = `test-qb-${Date.now()}-c@example.com`;
const nameA = "Alice";
const nameB = "Bob";
const nameC = "Charlie";

function getQuestBoardSection(page: Page) {
  return page
    .getByRole("heading", { name: "Quest Board" })
    .locator("xpath=ancestor::section");
}

async function stampPark(page: Page, slug: string) {
  await page.goto(`/parks/${slug}`);
  await page.getByRole("button", { name: /Stamp (this park|again)!/ }).click();
  await page.getByRole("radio", { name: "Yes" }).check();
  await page.getByRole("button", { name: "Stamp it!" }).click();
  await expect(
    page.getByText("Today's stamp is already in your passport."),
  ).toBeVisible({ timeout: 10_000 });
  await page.waitForTimeout(300);
}

test.describe.serial("quest board lifecycle", () => {
  test("sign up family A", async ({ page }) => {
    await signUp(page, nameA, emailA);
  });

  test("initial board shows 4 quests on first passport visit", async ({
    page,
  }) => {
    await signIn(page, emailA);
    await page.goto("/passport");

    const section = getQuestBoardSection(page);
    await expect(section).toBeVisible({ timeout: 10_000 });

    const items = section.locator("li");
    await expect(items).toHaveCount(4);

    await expect(section.getByText("Park Passport Stamp")).toBeVisible();
    await expect(section.getByText("Park Scout")).toBeVisible();
    await expect(section.getByText("Tiny Mountaineer")).toBeVisible();
    await expect(section.getByText("Playground Mission")).toBeVisible();
  });

  test("all quests initially incomplete, refresh button visible", async ({
    page,
  }) => {
    await signIn(page, emailA);
    await page.goto("/passport");

    const section = getQuestBoardSection(page);
    const incompleteIcons = section.locator('span:text-is("○")');
    await expect(incompleteIcons).toHaveCount(4);

    await expect(
      page.getByRole("button", { name: "Refresh Quest Board" }),
    ).toBeVisible();
  });

  test("stamp Whatcom Falls completes all 4 quests", async ({ page }) => {
    await signIn(page, emailA);
    await stampPark(page, "whatcom-falls-park");

    await page.goto("/passport");

    const section = getQuestBoardSection(page);
    const completedChecks = section.locator('span:text-is("✓")');
    await expect(completedChecks).toHaveCount(4);
  });

  test("completed quests remain visible after page reload", async ({
    page,
  }) => {
    await signIn(page, emailA);

    await page.goto("/passport");

    const section = getQuestBoardSection(page);
    await expect(section).toBeVisible({ timeout: 10_000 });
    await expect(section.locator("li")).toHaveCount(4);

    const completedChecks = section.locator('span:text-is("✓")');
    await expect(completedChecks).toHaveCount(4);

    await expect(page.getByText("125 Adventure Points")).toBeVisible();
  });

  test("refresh with all completed replaces board, no warning", async ({
    page,
  }) => {
    await signIn(page, emailA);
    await page.goto("/passport");

    await page.getByRole("button", { name: "Refresh Quest Board" }).click();

    await expect(page.getByText("Refreshed today")).toBeVisible({
      timeout: 10_000,
    });

    const section = getQuestBoardSection(page);
    await expect(section.locator("li")).toHaveCount(4);

    // All quests should be incomplete on the new board
    const incompleteIcons = section.locator('span:text-is("○")');
    await expect(incompleteIcons).toHaveCount(4);
  });

  test("server hides refresh button after same-day refresh", async ({
    page,
  }) => {
    await signIn(page, emailA);
    await page.goto("/passport");

    // After refresh, the button should not be visible — server-enforced
    await expect(page.getByText("Refreshed today")).toBeVisible({
      timeout: 10_000,
    });
    await expect(
      page.getByRole("button", { name: "Refresh Quest Board" }),
    ).not.toBeVisible();
  });

  test("stamp before visiting /passport completes challenges retroactively", async ({
    page,
  }) => {
    const emailD = `test-qb-retro-${Date.now()}-d@example.com`;
    await signUp(page, "Diana", emailD);

    await stampPark(page, "whatcom-falls-park");

    await page.goto("/passport");

    const section = getQuestBoardSection(page);
    await expect(section.locator("li")).toHaveCount(4);

    await expect(section.getByText("Park Passport Stamp")).toBeVisible();
    await expect(section.getByText("Park Scout")).toBeVisible();
    await expect(section.getByText("Tiny Mountaineer")).toBeVisible();
    await expect(section.getByText("Playground Mission")).toBeVisible();

    await expect(page.getByText("125 Adventure Points")).toBeVisible();
  });
});

test.describe.serial("family isolation for quest boards", () => {
  test("sign up family B", async ({ page }) => {
    await signUp(page, nameB, emailB);
  });

  test("family B sees their own quest board, separate from family A", async ({
    page,
  }) => {
    await signIn(page, emailB);
    await page.goto("/passport");

    const section = getQuestBoardSection(page);
    await expect(section).toBeVisible({ timeout: 10_000 });
    await expect(section.locator("li")).toHaveCount(4);

    // Family B should see incomplete quests (not Family A's completed state)
    const incompleteIcons = section.locator('span:text-is("○")');
    await expect(incompleteIcons).toHaveCount(4);

    // Family B does not have Family A's refresh state
    await expect(page.getByText("Refreshed today")).not.toBeVisible();
  });

  test("family B refresh does not affect family A", async ({ page }) => {
    await signIn(page, emailB);
    await page.goto("/passport");

    // Family B has incomplete quests, so refresh shows warning
    await page.getByRole("button", { name: "Refresh Quest Board" }).click();

    // Confirm the refresh
    await page
      .getByRole("button", { name: "Replace unfinished quests" })
      .click();

    await expect(page.getByText("Refreshed today")).toBeVisible({
      timeout: 10_000,
    });
  });

  test("family A board still shows refreshed state (family B refresh isolated)", async ({
    page,
  }) => {
    await signIn(page, emailA);
    await page.goto("/passport");

    await expect(page.getByText("Refreshed today")).toBeVisible({
      timeout: 10_000,
    });

    const section = getQuestBoardSection(page);
    await expect(section.locator("li")).toHaveCount(4);
  });
});

test.describe.serial("incomplete quest warning before refresh", () => {
  test("sign up family C", async ({ page }) => {
    await signUp(page, nameC, emailC);
  });

  test("warning appears when refreshing with incomplete quests", async ({
    page,
  }) => {
    await signIn(page, emailC);
    await page.goto("/passport");

    await page.getByRole("button", { name: "Refresh Quest Board" }).click();

    // Warning dialog should appear
    await expect(
      page.getByText(
        "Refreshing your Quest Board will replace unfinished quests.",
      ),
    ).toBeVisible({ timeout: 10_000 });

    // Cancel should close the dialog
    await page.getByRole("button", { name: "Cancel" }).click();

    await expect(
      page.getByText(
        "Refreshing your Quest Board will replace unfinished quests.",
      ),
    ).not.toBeVisible({ timeout: 5_000 });

    // Button should still be visible — not refreshed
    await expect(
      page.getByRole("button", { name: "Refresh Quest Board" }),
    ).toBeVisible();
  });

  test("confirm refresh with incomplete quests replaces the board", async ({
    page,
  }) => {
    await signIn(page, emailC);
    await page.goto("/passport");

    await page.getByRole("button", { name: "Refresh Quest Board" }).click();

    // Click "Replace unfinished quests"
    await page
      .getByRole("button", { name: "Replace unfinished quests" })
      .click();

    // Board should be refreshed
    await expect(page.getByText("Refreshed today")).toBeVisible({
      timeout: 10_000,
    });

    const section = getQuestBoardSection(page);
    await expect(section.locator("li")).toHaveCount(4);
    const incompleteIcons = section.locator('span:text-is("○")');
    await expect(incompleteIcons).toHaveCount(4);
  });
});

test.describe.serial("date-boundary: prior-day board", () => {
  const emailD = `test-qb-dob-${Date.now()}-d@example.com`;

  test("sign up family D", async ({ page }) => {
    await signUp(page, "Diana", emailD);
  });

  test("set board dates to yesterday, verify persistence across app-day boundary", async ({
    page,
  }) => {
    await signIn(page, emailD);
    // First passport visit creates the initial board
    await page.goto("/passport");
    const section = getQuestBoardSection(page);
    await expect(section).toBeVisible({ timeout: 10_000 });
    await expect(section.locator("li")).toHaveCount(4);

    const familyGroupId = await getFamilyGroupId(emailD);
    await setBoardToYesterday(familyGroupId);

    await page.goto("/passport");

    // Board should still show 4 quests (incomplete) — no midnight replacement
    await expect(section).toBeVisible({ timeout: 10_000 });
    await expect(section.locator("li")).toHaveCount(4);

    const incompleteIcons = section.locator('span:text-is("○")');
    await expect(incompleteIcons).toHaveCount(4);
  });

  test("live stamp today completes quests on the prior-day board", async ({
    page,
  }) => {
    await signIn(page, emailD);
    await stampPark(page, "whatcom-falls-park");

    await page.goto("/passport");

    // All 4 quests should now be completed on the board from yesterday
    const section = getQuestBoardSection(page);
    const completedChecks = section.locator('span:text-is("✓")');
    await expect(completedChecks).toHaveCount(4);

    // AP should include quest rewards (10 + 25 + 20 + 20 = 75)
    // plus first-stamp base (50) = 125
    await expect(page.getByText("125 Adventure Points")).toBeVisible();
  });
});

test.describe.serial("date-boundary: next-day refresh", () => {
  const emailE = `test-qb-dob-${Date.now()}-e@example.com`;

  test("sign up family E", async ({ page }) => {
    await signUp(page, "Elena", emailE);
  });

  test("refresh creates board with manualRefreshDate = today", async ({
    page,
  }) => {
    await signIn(page, emailE);
    // First passport visit creates the initial board
    await page.goto("/passport");
    const section = getQuestBoardSection(page);
    await expect(section).toBeVisible({ timeout: 10_000 });
    await expect(section.locator("li")).toHaveCount(4);

    // Incomplete quests -> warning dialog
    await page.getByRole("button", { name: "Refresh Quest Board" }).click();
    await page
      .getByRole("button", { name: "Replace unfinished quests" })
      .click();

    await expect(page.getByText("Refreshed today")).toBeVisible({
      timeout: 10_000,
    });
  });

  test("set manualRefreshDate to yesterday, refresh button visible", async ({
    page,
  }) => {
    await signIn(page, emailE);
    const familyGroupId = await getFamilyGroupId(emailE);
    await setManualRefreshToYesterday(familyGroupId);

    await page.goto("/passport");

    // Refresh button should be visible since board was refreshed yesterday, not today
    await expect(
      page.getByRole("button", { name: "Refresh Quest Board" }),
    ).toBeVisible({ timeout: 10_000 });
    await expect(page.getByText("Refreshed today")).not.toBeVisible();
  });

  test("can refresh again on the new day", async ({ page }) => {
    await signIn(page, emailE);
    await page.goto("/passport");

    // Refresh should work — this is a "new day" relative to last refresh
    await page.getByRole("button", { name: "Refresh Quest Board" }).click();
    await page
      .getByRole("button", { name: "Replace unfinished quests" })
      .click();

    await expect(page.getByText("Refreshed today")).toBeVisible({
      timeout: 10_000,
    });
  });
});
