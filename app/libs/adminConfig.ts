const rawApiBaseUrl = process.env.NEXT_PUBLIC_API_URL?.trim();

if (!rawApiBaseUrl) {
  throw new Error("NEXT_PUBLIC_API_URL is not configured. Add it to .env.");
}

export const API_BASE_URL = rawApiBaseUrl.replace(/\/+$/, "");
