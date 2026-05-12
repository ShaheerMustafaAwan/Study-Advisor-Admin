import { test, expect } from "@playwright/test";
import { installAdminAuthenticatedMocks } from "./helpers/admin-backend-mock";
import { seedAdminSession } from "./helpers/admin-session";

test.describe("Manage counselors", () => {
  test("validates required fields and can add a counselor (API mocked)", async ({
    page,
  }) => {
    await installAdminAuthenticatedMocks(page);
    await seedAdminSession(page);
    await page.goto("/admin/manage-counselors");
    await expect(
      page.getByRole("heading", { name: "Manage Counselors" }),
    ).toBeVisible({ timeout: 30_000 });

    await page.getByRole("button", { name: "+ Add Counselor" }).click();
    await expect(page.getByRole("heading", { name: /Add New Counselor/i })).toBeVisible();

    const modal = page.locator("div.fixed.inset-0").filter({ hasText: "Add New Counselor" });

    await modal.getByPlaceholder("Full Name").fill("Pat Counselor");
    await modal.getByPlaceholder("Email").fill("pat.counselor@e2e.test");
    await modal.getByPlaceholder(/^Password$/).fill("secret12");
    await modal.getByRole("button", { name: /^Add Counselor$/ }).click();
    await expect(
      page.getByText("Name, email and at least one specialization are required"),
    ).toBeVisible();

    await modal.getByRole("checkbox", { name: /Computer Science/i }).check();
    await modal.getByRole("button", { name: /^Add Counselor$/ }).click();
    await expect(page.getByText("Counselor added successfully")).toBeVisible({
      timeout: 20_000,
    });
  });
});
