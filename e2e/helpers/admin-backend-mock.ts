import { Buffer } from "node:buffer";
import type { Page, Route } from "@playwright/test";

function buildUnsignedAdminJwt(): string {
  const enc = (o: object) => Buffer.from(JSON.stringify(o)).toString("base64url");
  return `${enc({ alg: "none", typ: "JWT" })}.${enc({
    role: "admin",
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30,
  })}.e2e`;
}

const corsHeaders: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

function isBackendApi(url: URL): boolean {
  const port = url.port || (url.protocol === "https:" ? "443" : "80");
  return (
    (url.hostname === "localhost" || url.hostname === "127.0.0.1") &&
    port === "4000"
  );
}

async function fulfillJson(route: Route, body: unknown, status = 200) {
  await route.fulfill({
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

let counselorSeq = 1;
let universitySeq = 1;
const counselors: Array<{
  id: number;
  name: string;
  email: string;
  phone: string;
  capacity: number;
  skills: string[];
  joined: string;
  isActive: boolean;
  assignedStudents: number;
}> = [];

const universities: Array<{
  id: number;
  name: string;
  country: string;
  city: string | null;
  world_ranking: number | null;
  website: string | null;
  description: string | null;
  min_gpa: number | null;
  min_ielts: number | null;
  tuition_fee_usd: number | null;
  application_fee_usd: number | null;
  program_name: string | null;
  program_level: string | null;
  fields_offered: string[];
  is_partnered: boolean;
  partnered_at: string | null;
  partnership_notes: string | null;
  created_at: string;
  updated_at: string | null;
}> = [];

export function resetAdminMockData() {
  counselorSeq = 1;
  universitySeq = 1;
  counselors.length = 0;
  universities.length = 0;
}

const dashboardSummary = {
  students: { total: 12, assigned: 8, unassigned: 4 },
  counselors: { total: 3 },
  universities: { total: 24, partnered: 6 },
  documents: { total: 40 },
  sop: { total: 5 },
  applications: { total: 8 },
  connections: { pendingRequests: 1 },
};

export async function mockAdminLoginSuccess(page: Page) {
  await page.route(/auth\/login/i, async (route) => {
    const url = new URL(route.request().url());
    if (!isBackendApi(url) || !/\/api\/auth\/login\/?$/i.test(url.pathname)) {
      await route.continue();
      return;
    }
    const method = route.request().method();
    if (method === "OPTIONS") {
      await route.fulfill({ status: 204, headers: corsHeaders });
      return;
    }
    if (method !== "POST") {
      await route.continue();
      return;
    }
    await fulfillJson(route, {
      status: "success",
      message: "ok",
      token: buildUnsignedAdminJwt(),
      user: {
        id: 1,
        fullName: "E2E Admin",
        email: "admin@e2e.test",
        role: "admin",
      },
    });
  });
}

/** Login API returns a non-admin user → portal shows role error. */
export async function mockAdminLoginNonAdminRole(page: Page) {
  await page.route(/auth\/login/i, async (route) => {
    const url = new URL(route.request().url());
    if (!isBackendApi(url) || !/\/api\/auth\/login\/?$/i.test(url.pathname)) {
      await route.continue();
      return;
    }
    const method = route.request().method();
    if (method === "OPTIONS") {
      await route.fulfill({ status: 204, headers: corsHeaders });
      return;
    }
    if (method !== "POST") {
      await route.continue();
      return;
    }
    await fulfillJson(route, {
      status: "success",
      message: "ok",
      token: "e2e-student-token",
      user: {
        id: 2,
        fullName: "Student User",
        email: "student@e2e.test",
        role: "student",
      },
    });
  });
}

export async function installAdminAuthenticatedMocks(page: Page) {
  resetAdminMockData();

  await page.route("**/api/**", async (route) => {
    const url = new URL(route.request().url());
    if (!isBackendApi(url)) {
      await route.continue();
      return;
    }

    const method = route.request().method();
    if (method === "OPTIONS") {
      await route.fulfill({ status: 204, headers: corsHeaders });
      return;
    }

    const path = url.pathname.replace(/\/$/, "") || url.pathname;

    if (path.endsWith("/admin/dashboard/summary") && method === "GET") {
      await fulfillJson(route, dashboardSummary);
      return;
    }
    if (path.endsWith("/admin/dashboard/monthly-trends") && method === "GET") {
      await fulfillJson(route, { trends: [] });
      return;
    }
    if (path.endsWith("/admin/dashboard/recent-activity") && method === "GET") {
      await fulfillJson(route, { activities: [] });
      return;
    }

    if (path.endsWith("/admin/counselors") && method === "GET") {
      await fulfillJson(route, { counselors });
      return;
    }

    if (path.endsWith("/admin/counselors") && method === "POST") {
      const body = route.request().postDataJSON() as {
        fullName: string;
        email: string;
        password?: string;
        phone?: string;
        capacity?: number;
        skills?: string[];
        isActive?: boolean;
      };
      const row = {
        id: counselorSeq++,
        name: body.fullName,
        email: body.email,
        phone: body.phone || "",
        capacity: body.capacity ?? 20,
        skills: body.skills || [],
        joined: new Date().toISOString(),
        isActive: body.isActive !== false,
        assignedStudents: 0,
      };
      counselors.push(row);
      await fulfillJson(route, { counselor: row });
      return;
    }

    if (path.match(/\/admin\/counselors\/\d+$/) && method === "PUT") {
      await fulfillJson(route, { counselor: counselors[0] || {} });
      return;
    }

    if (path.match(/\/admin\/counselors\/\d+$/) && method === "DELETE") {
      await fulfillJson(route, { status: "ok", message: "disabled" });
      return;
    }

    if (path.endsWith("/admin/students") && method === "GET") {
      await fulfillJson(route, {
        students: [],
        summary: { total: 0, assigned: 0, unassigned: 0 },
        pagination: {
          page: 1,
          limit: 20,
          total: 0,
          totalPages: 1,
        },
      });
      return;
    }

    if (path.match(/\/admin\/students\/\d+\/details$/) && method === "GET") {
      await fulfillJson(route, {
        student: {
          id: 1,
          name: "Test",
          email: "t@test.com",
          role: "student",
          createdAt: new Date().toISOString(),
          profile: {
            phoneNumber: null,
            nationality: null,
            desiredProgram: null,
            preferredCountry: null,
            preferredIntake: null,
            currentEducationLevel: null,
            institutionName: null,
            fieldOfStudy: null,
            cgpa: null,
            ieltsScore: null,
            updatedAt: null,
          },
          assignedCounselor: null,
          documents: [],
          latestSop: null,
        },
      });
      return;
    }

    if (path.endsWith("/admin/assignments") && method === "POST") {
      await fulfillJson(route, { assignment: { id: 1 } });
      return;
    }
    if (path.match(/\/admin\/assignments\/\d+$/) && method === "PUT") {
      await fulfillJson(route, { assignment: { id: 1 } });
      return;
    }
    if (path.match(/\/admin\/assignments\/\d+$/) && method === "DELETE") {
      await fulfillJson(route, { status: "ok", message: "ok" });
      return;
    }

    if (path.endsWith("/admin/universities") && method === "GET") {
      await fulfillJson(route, { universities });
      return;
    }

    if (path.endsWith("/admin/universities") && method === "POST") {
      const body = route.request().postDataJSON() as Record<string, unknown>;
      const row = {
        id: universitySeq++,
        name: String(body.name || ""),
        country: String(body.country || ""),
        city: (body.city as string) || null,
        world_ranking: (body.ranking as number) ?? null,
        website: (body.website as string) || null,
        description: (body.description as string) || null,
        min_gpa: (body.minGpa as number) ?? null,
        min_ielts: (body.minIelts as number) ?? null,
        tuition_fee_usd: (body.tuitionFee as number) ?? null,
        application_fee_usd: (body.applicationFee as number) ?? null,
        program_name: (body.programName as string) || null,
        program_level: (body.programLevel as string) || null,
        fields_offered: Array.isArray(body.programs)
          ? (body.programs as string[])
          : [],
        is_partnered: Boolean(body.isPartnered),
        partnered_at: body.isPartnered ? new Date().toISOString() : null,
        partnership_notes: null,
        created_at: new Date().toISOString(),
        updated_at: null,
      };
      universities.push(row);
      await fulfillJson(route, { university: row });
      return;
    }

    if (path.match(/\/admin\/universities\/\d+$/) && method === "PUT") {
      await fulfillJson(route, { university: universities[0] || {} });
      return;
    }
    if (path.match(/\/admin\/universities\/\d+$/) && method === "DELETE") {
      await fulfillJson(route, { status: "ok", message: "ok" });
      return;
    }
    if (path.match(/\/admin\/universities\/\d+\/partnership$/) && method === "PATCH") {
      await fulfillJson(route, { university: universities[0] || {} });
      return;
    }

    if (path.includes("/admin/notifications")) {
      await fulfillJson(route, { unreadCount: 0, notifications: [] });
      return;
    }

    await route.continue();
  });
}
