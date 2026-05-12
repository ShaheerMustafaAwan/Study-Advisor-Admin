import { getAdminAuthToken } from "@/app/libs/adminAuth";
import { API_BASE_URL } from "@/app/libs/adminConfig";

type ApiRequestInit = RequestInit & {
  includeAuth?: boolean;
};

async function parseApiError(
  response: Response,
  fallback: string,
): Promise<string> {
  try {
    const data = await response.json();
    if (typeof data?.message === "string" && data.message.trim())
      return data.message;
    if (typeof data?.detail === "string" && data.detail.trim())
      return data.detail;
    if (typeof data?.error === "string" && data.error.trim()) return data.error;
  } catch {
    // ignore
  }

  try {
    const text = await response.text();
    if (text.trim()) return text;
  } catch {
    // ignore
  }

  return fallback;
}

async function request<T>(path: string, init?: ApiRequestInit): Promise<T> {
  const { includeAuth = true, ...requestInit } = init || {};
  const token = getAdminAuthToken();

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...requestInit,
    headers: {
      "Content-Type": "application/json",
      ...(includeAuth && token ? { Authorization: `Bearer ${token}` } : {}),
      ...(requestInit.headers || {}),
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const message = await parseApiError(response, "Request failed");
    throw new Error(message);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

export type AdminCounselor = {
  id: number;
  name: string;
  email: string;
  phone: string;
  capacity: number;
  skills: string[];
  joined: string;
  isActive: boolean;
  assignedStudents: number;
};

export type AdminStudent = {
  id: number;
  name: string;
  email: string;
  program: string;
  location: string;
  date: string;
  assignedCounselor: {
    assignmentId: number;
    id: number;
    name: string;
    email: string;
  } | null;
};

export type AdminStudentDocument = {
  id: number;
  type: string;
  fileName: string;
  fileUrl: string;
  uploadedAt: string;
};

export type AdminStudentDetails = {
  id: number;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  profile: {
    phoneNumber: string | null;
    nationality: string | null;
    desiredProgram: string | null;
    preferredCountry: string | null;
    preferredIntake: string | null;
    currentEducationLevel: string | null;
    institutionName: string | null;
    fieldOfStudy: string | null;
    cgpa: number | null;
    ieltsScore: number | null;
    updatedAt: string | null;
  };
  assignedCounselor: {
    assignmentId: number;
    assignedAt: string;
    name: string;
    email: string;
  } | null;
  documents: AdminStudentDocument[];
  latestSop: {
    id: number;
    version: number;
    title: string | null;
    status: string;
    reviewNotes: string | null;
    submittedAt: string | null;
    reviewedAt: string | null;
    updatedAt: string;
    document: {
      id: number;
      fileName: string;
      fileUrl: string;
      createdAt: string;
    } | null;
    reviewer: {
      id: number;
      fullName: string;
      email: string;
    } | null;
  } | null;
};

export type AdminUniversity = {
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
};

export type DashboardSummaryResponse = {
  students: { total: number; assigned: number; unassigned: number };
  counselors: { total: number };
  universities: { total: number; partnered: number };
  documents: { total: number };
  sop: { total: number };
  applications: { total: number };
  connections: { pendingRequests: number };
};

export type StudentsPagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type DashboardTrend = {
  month: string;
  students: number;
  applications: number;
  documents: number;
};

export type DashboardActivity = {
  id: string;
  type: "Student" | "Counselor" | "University" | "System" | "Document";
  message: string;
  time: string;
  activityCode?: string;
  actor?: {
    name: string;
    email: string | null;
    role: string;
  };
  subject?: {
    name: string;
    email: string | null;
    role: string;
  } | null;
  target?: {
    name: string;
    email: string | null;
    role: string;
  } | null;
};

export type AdminNotification = {
  id: number;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
  readAt: string | null;
  studentId: number | null;
  student: {
    id: number;
    fullName: string;
    email: string;
  } | null;
  isConnectionRequest: boolean;
  actionPath: string | null;
};

export const adminApi = {
  login(payload: { email: string; password: string }) {
    return request<{
      status: string;
      message: string;
      token: string;
      user: {
        id: number;
        fullName: string;
        email: string;
        role: string;
      };
    }>("/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
      includeAuth: false,
    });
  },

  getDashboardSummary() {
    return request<DashboardSummaryResponse>("/admin/dashboard/summary");
  },

  getDashboardMonthlyTrends() {
    return request<{ trends: DashboardTrend[] }>(
      "/admin/dashboard/monthly-trends",
    );
  },

  getDashboardRecentActivity() {
    return request<{ activities: DashboardActivity[] }>(
      "/admin/dashboard/recent-activity",
    );
  },

  getNotifications(params?: { unreadOnly?: boolean; limit?: number }) {
    const search = new URLSearchParams();
    if (params?.unreadOnly) search.set("unreadOnly", "true");
    if (typeof params?.limit === "number") {
      search.set("limit", String(params.limit));
    }
    const suffix = search.toString() ? `?${search.toString()}` : "";

    return request<{ unreadCount: number; notifications: AdminNotification[] }>(
      `/admin/notifications${suffix}`,
    );
  },

  markNotificationRead(notificationId: number) {
    return request<{ status: string }>(
      `/admin/notifications/${notificationId}/read`,
      {
        method: "PUT",
      },
    );
  },

  getCounselors() {
    return request<{ counselors: AdminCounselor[] }>("/admin/counselors");
  },

  createCounselor(payload: {
    fullName: string;
    email: string;
    password: string;
    phone?: string;
    capacity?: number;
    skills?: string[];
    isActive?: boolean;
  }) {
    return request<{ counselor: AdminCounselor }>("/admin/counselors", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  updateCounselor(
    id: number,
    payload: Partial<{
      fullName: string;
      email: string;
      password: string;
      phone: string;
      capacity: number;
      skills: string[];
      isActive: boolean;
    }>,
  ) {
    return request<{ counselor: AdminCounselor }>(`/admin/counselors/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },

  deleteCounselor(id: number) {
    return request<{ status: string; message: string }>(
      `/admin/counselors/${id}`,
      {
        method: "DELETE",
      },
    );
  },

  getStudents(params?: { q?: string; page?: number; limit?: number }) {
    const search = new URLSearchParams();
    if (params?.q) search.set("q", params.q);
    if (typeof params?.page === "number") {
      search.set("page", String(params.page));
    }
    if (typeof params?.limit === "number") {
      search.set("limit", String(params.limit));
    }
    const suffix = search.toString() ? `?${search.toString()}` : "";

    return request<{
      students: AdminStudent[];
      summary: { total: number; assigned: number; unassigned: number };
      pagination: StudentsPagination;
    }>(`/admin/students${suffix}`);
  },

  getStudentDetails(studentId: number) {
    return request<{ student: AdminStudentDetails }>(
      `/admin/students/${studentId}/details`,
    );
  },

  createAssignment(payload: {
    studentId: number;
    counselorId: number;
    notes?: string;
  }) {
    return request<{ assignment: { id: number } }>("/admin/assignments", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  updateAssignment(
    assignmentId: number,
    payload: { counselorId?: number; notes?: string; status?: string },
  ) {
    return request<{ assignment: { id: number } }>(
      `/admin/assignments/${assignmentId}`,
      {
        method: "PUT",
        body: JSON.stringify(payload),
      },
    );
  },

  deleteAssignment(assignmentId: number) {
    return request<{ status: string; message: string }>(
      `/admin/assignments/${assignmentId}`,
      {
        method: "DELETE",
      },
    );
  },

  getUniversities(params?: {
    q?: string;
    country?: string;
    partnered?: boolean;
  }) {
    const search = new URLSearchParams();
    if (params?.q) search.set("q", params.q);
    if (params?.country) search.set("country", params.country);
    if (params?.partnered !== undefined) {
      search.set("partnered", String(params.partnered));
    }

    const suffix = search.toString() ? `?${search.toString()}` : "";
    return request<{ universities: AdminUniversity[] }>(
      `/admin/universities${suffix}`,
    );
  },

  createUniversity(payload: {
    name: string;
    country: string;
    city?: string;
    ranking?: number;
    tuitionFee?: number;
    applicationFee?: number;
    minGpa?: number;
    minIelts?: number;
    website?: string;
    description?: string;
    programs?: string[];
    programName?: string;
    programLevel?: string;
    partnershipNotes?: string;
    isPartnered?: boolean;
  }) {
    return request<{ university: AdminUniversity }>("/admin/universities", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  updateUniversity(id: number, payload: Record<string, unknown>) {
    return request<{ university: AdminUniversity }>(
      `/admin/universities/${id}`,
      {
        method: "PUT",
        body: JSON.stringify(payload),
      },
    );
  },

  deleteUniversity(id: number) {
    return request<{ status: string; message: string }>(
      `/admin/universities/${id}`,
      {
        method: "DELETE",
      },
    );
  },

  toggleUniversityPartnership(
    id: number,
    payload: { isPartnered: boolean; partnershipNotes?: string },
  ) {
    return request<{ university: AdminUniversity }>(
      `/admin/universities/${id}/partnership`,
      {
        method: "PATCH",
        body: JSON.stringify(payload),
      },
    );
  },
};

export function formatRelativeTime(input: string | Date): string {
  const date = input instanceof Date ? input : new Date(input);
  const diffMs = Date.now() - date.getTime();

  if (diffMs < 60_000) return "Just now";
  if (diffMs < 3_600_000) return `${Math.floor(diffMs / 60_000)}m ago`;
  if (diffMs < 86_400_000) return `${Math.floor(diffMs / 3_600_000)}h ago`;
  return `${Math.floor(diffMs / 86_400_000)}d ago`;
}
