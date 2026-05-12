import { test, expect } from "@playwright/test";
import { installAdminAuthenticatedMocks } from "./helpers/admin-backend-mock";
import { seedAdminSession } from "./helpers/admin-session";

test.describe("General settings", () => {
  test("save shows success toast (local form)", async ({ page }) => {
    await installAdminAuthenticatedMocks(page);
    await seedAdminSession(page);
    await page.goto("/admin/general-settings");
    await expect(
      page.getByRole("heading", { name: "General Settings" }),
    ).toBeVisible({ timeout: 30_000 });

    await page.locator('input[name="platformName"]').fill("Study Advisor E2E");
    await page.getByRole("button", { name: /Save Changes/i }).click();
    await expect(page.getByText("Settings saved successfully!")).toBeVisible({
      timeout: 10_000,
    });
  });
});
