import type { Page } from "@playwright/test";

/** Unsigned JWT-shaped token so `hasAdminSession()` passes (admin role, future exp). */
export async function seedAdminSession(page: Page) {
  await page.addInitScript(() => {
    const b64url = (obj: { alg?: string; typ?: string; role?: string; exp?: number }) =>
      btoa(JSON.stringify(obj))
        .replace(/=+$/g, "")
        .replace(/\+/g, "-")
        .replace(/\//g, "_");
    const header = b64url({ alg: "none", typ: "JWT" });
    const payload = b64url({
      role: "admin",
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 365,
    });
    const token = `${header}.${payload}.e2e`;
    window.localStorage.setItem("study_advisor_admin_token", token);
    window.localStorage.setItem("admin_name", "E2E Admin");
  });
}
