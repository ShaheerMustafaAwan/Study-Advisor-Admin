import { test, expect } from "@playwright/test";
import { installAdminAuthenticatedMocks } from "./helpers/admin-backend-mock";
import { seedAdminSession } from "./helpers/admin-session";

test.describe("Assign students", () => {
  test("page loads summary and assignment UI (API mocked)", async ({ page }) => {
    await installAdminAuthenticatedMocks(page);
    await seedAdminSession(page);
    await page.goto("/admin/assign-students");
    await expect(
      page.getByRole("heading", { name: "Assign Students" }),
    ).toBeVisible({ timeout: 30_000 });
    await expect(page.getByText(/Showing page 1 of/i)).toBeVisible({
      timeout: 20_000,
    });
  });
});
