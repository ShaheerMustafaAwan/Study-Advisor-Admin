import { test, expect } from "@playwright/test";
import { installAdminAuthenticatedMocks } from "./helpers/admin-backend-mock";
import { seedAdminSession } from "./helpers/admin-session";

test.describe("Partner universities", () => {
  test("validates required fields and can add a university (API mocked)", async ({
    page,
  }) => {
    await installAdminAuthenticatedMocks(page);
    await seedAdminSession(page);
    await page.goto("/admin/partner-universities");
    await expect(
      page.getByRole("heading", { name: "Partnered Universities" }),
    ).toBeVisible({ timeout: 30_000 });

    await page.getByRole("button", { name: "+ Add University" }).click();
    const modal = page.locator("div.fixed.inset-0").filter({ hasText: "Add New University" });
    await expect(
      modal.getByRole("heading", { name: /Add New University/i }),
    ).toBeVisible();

    await modal.getByRole("button", { name: "Add University" }).click();
    await expect(
      page.getByText("University name and country are required"),
    ).toBeVisible();

    await modal.getByPlaceholder("Enter university name").fill("E2E University");
    await modal.getByPlaceholder("Enter country").fill("Canada");
    await modal.getByRole("button", { name: "Add University" }).click();
    await expect(page.getByText("University added successfully")).toBeVisible({
      timeout: 20_000,
    });
  });
});
