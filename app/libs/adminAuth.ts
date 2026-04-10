export const ADMIN_TOKEN_STORAGE_KEY = "study_advisor_admin_token";

type JwtPayload = {
  id?: number;
  email?: string;
  role?: string;
  exp?: number;
};

function decodeBase64Url(value: string): string {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized.padEnd(
    normalized.length + ((4 - (normalized.length % 4)) % 4),
    "=",
  );
  return atob(padded);
}

export function setAdminAuthToken(token: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(ADMIN_TOKEN_STORAGE_KEY, token);
}

export function getAdminAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return (
    localStorage.getItem(ADMIN_TOKEN_STORAGE_KEY) ||
    localStorage.getItem("token") ||
    null
  );
}

export function clearAdminAuthToken() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(ADMIN_TOKEN_STORAGE_KEY);
}

export function decodeJwtPayload(token: string | null): JwtPayload | null {
  if (!token) return null;

  try {
    const parts = token.split(".");
    if (parts.length < 2) return null;
    return JSON.parse(decodeBase64Url(parts[1])) as JwtPayload;
  } catch {
    return null;
  }
}

export function hasAdminSession(token: string | null): boolean {
  const payload = decodeJwtPayload(token);
  if (!payload) return false;

  const role = String(payload.role || "").toLowerCase();
  if (role !== "admin") return false;

  if (typeof payload.exp === "number") {
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp <= now) return false;
  }

  return true;
}
