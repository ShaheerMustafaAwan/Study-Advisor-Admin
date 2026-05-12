import { test, expect } from "@playwright/test";
import {
  mockAdminLoginNonAdminRole,
  mockAdminLoginSuccess,
} from "./helpers/admin-backend-mock";

test.describe("Admin login", () => {
  test("rejects non-admin API user with message", async ({ page }) => {
    await mockAdminLoginNonAdminRole(page);
    await page.goto("/login");
    await page.locator('input[type="email"]').fill("student@e2e.test");
    await page.locator('input[type="password"]').fill("password123");
    await page.getByRole("button", { name: /Sign In/i }).click();
    await expect(
      page.getByText(/Only admin accounts can sign in here/i),
    ).toBeVisible({ timeout: 15_000 });
  });

  test("successful admin login stores session and opens dashboard", async ({
    page,
  }) => {
    await mockAdminLoginSuccess(page);
    await page.goto("/login");
    await page.locator('input[type="email"]').fill("admin@e2e.test");
    await page.locator('input[type="password"]').fill("password123");
    await page.getByRole("button", { name: /Sign In/i }).click();
    await expect
      .poll(
        async () =>
          page.evaluate(() =>
            window.localStorage.getItem("study_advisor_admin_token"),
          ),
        { timeout: 15_000 },
      )
      .not.toBeNull();
    await expect(page).toHaveURL(/\/admin\/?$/, { timeout: 20_000 });
  });
});
