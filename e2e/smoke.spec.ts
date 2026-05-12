import { test, expect } from "@playwright/test";

test.describe("Public routing", () => {
  test("root redirects to admin login", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveURL(/\/login/);
    await expect(
      page.getByRole("heading", { name: /Admin Login/i }),
    ).toBeVisible();
  });
});
