/**
 * E2E test — Critical user journey: "Task creation and filtering"
 *
 * Runs against the real frontend (http://localhost:5173)
 * and the real Django backend (http://localhost:8000).
 * No mocking — this is the confidence test before deploying.
 *
 * Journey:
 *   1. App loads and fetches initial data from the API
 *   2. User creates a new category "Projet Alpha"
 *   3. User creates a new task "Déployer la V1" assigned to "Projet Alpha"
 *   4. The task appears in the main list
 *   5. User filters by "Projet Alpha" → only that task is visible
 *   BONUS: User marks the task as done → line-through style is applied
 */

import { test, expect, request } from "@playwright/test";

const CATEGORY_NAME = "Projet Alpha";
const TASK_TITLE = "Déployer la V1";
const API = "http://localhost:8000/api";

// Clean up test data before and after to ensure a fresh state
async function cleanupTestData() {
  const ctx = await request.newContext();

  // Delete tasks matching our test title
  const tasksRes = await ctx.get(`${API}/tasks/`);
  const tasks = await tasksRes.json();
  for (const task of tasks) {
    if (task.title === TASK_TITLE) {
      await ctx.delete(`${API}/tasks/${task.id}/`);
    }
  }

  // Delete categories matching our test name
  const catsRes = await ctx.get(`${API}/categories/`);
  const cats = await catsRes.json();
  for (const cat of cats) {
    if (cat.name === CATEGORY_NAME) {
      await ctx.delete(`${API}/categories/${cat.id}/`);
    }
  }

  await ctx.dispose();
}

test.describe("Critical journey: task creation and filtering", () => {
  test.beforeEach(async ({ page }) => {
    // Ensure clean state before each test
    await cleanupTestData();

    // Wait for both API calls to complete before interacting
    const categoriesReady = page.waitForResponse(`${API}/categories/`);
    const tasksReady = page.waitForResponse(`${API}/tasks/`);

    await page.goto("/");

    await categoriesReady;
    await tasksReady;
  });

  test.afterEach(async () => {
    // Clean up test data after each test
    await cleanupTestData();
  });

  test("app loads and displays the main interface", async ({ page }) => {
    await expect(page.getByText("T.A.S.K Creator")).toBeVisible();
    await expect(page.getByText("Available Categories:")).toBeVisible();
  });

  test("creates a category, creates a task, filters, and marks as done", async ({
    page,
  }) => {
    // ── STEP 1: Create the category "Projet Alpha" ──────────────────────────

    const categoryCreated = page.waitForResponse(
      (res) =>
        res.url().includes("/api/categories/") &&
        res.request().method() === "POST"
    );

    // Open the "Add a category" form
    await page.getByRole("button", { name: "+ Add a category" }).click();

    // Fill in the category name
    await page.getByPlaceholder("Category Name").fill(CATEGORY_NAME);

    // Submit
    await page.getByRole("button", { name: "+ Add The New Category" }).click();

    // Assert the API returned 201 and grab the new category id
    const categoryResponse = await categoryCreated;
    expect(categoryResponse.status()).toBe(201);
    const categoryData = await categoryResponse.json();
    const categoryId = String(categoryData.id);

    // The new category pill should appear in the UI
    await expect(page.getByText(`#${CATEGORY_NAME}`).first()).toBeVisible();

    // ── STEP 2: Select "Projet Alpha" and create the task ───────────────────

    const taskCreated = page.waitForResponse(
      (res) =>
        res.url().includes("/api/tasks/") && res.request().method() === "POST"
    );

    // Open the category picker (the icon button next to the task input)
    const taskInput = page.getByPlaceholder("Write your new task here ...");
    await taskInput.locator("..").locator("..").getByRole("button").first().click();

    // Click SELECT on "Projet Alpha" in the submenu
    const categoryPill = page
      .locator("div.group")
      .filter({ hasText: CATEGORY_NAME })
      .first();
    await categoryPill
      .getByRole("button", { name: /SELECT/i })
      .click({ force: true });

    // Type the task title
    await taskInput.fill(TASK_TITLE);

    // Submit with the ↵ button
    await page.getByRole("button", { name: "↵" }).click();

    // Assert the API returned 201
    const taskResponse = await taskCreated;
    expect(taskResponse.status()).toBe(201);

    // ── STEP 3: Verify the task appears in the main list ────────────────────

    await expect(page.getByText(TASK_TITLE)).toBeVisible();

    // ── STEP 4: Filter by "Projet Alpha" ────────────────────────────────────

    // Select by value (the category id) — the label includes an emoji prefix
    // so matching by label is unreliable
    await page.getByRole("combobox").selectOption({ value: categoryId });

    // Our task must still be visible
    await expect(page.getByText(TASK_TITLE)).toBeVisible();

    // Only one checkbox should be visible (only our task)
    await expect(page.getByRole("checkbox")).toHaveCount(1);

    // ── BONUS: Mark the task as done ────────────────────────────────────────

    const taskToggled = page.waitForResponse(
      (res) =>
        /\/api\/tasks\/\d+\/$/.test(res.url()) &&
        res.request().method() === "PATCH"
    );

    await page.getByRole("checkbox").first().click();

    // Assert the API returned 200
    const toggleResponse = await taskToggled;
    expect(toggleResponse.status()).toBe(200);

    // The task text should now have the line-through style
    const taskText = page.getByText(TASK_TITLE);
    await expect(taskText).toHaveClass(/line-through/);
  });
});
