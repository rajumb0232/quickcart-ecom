import type { AuthResponsePayload } from "../types/auth";

const ACCESS_TOKEN = "qc_access_token";
const REFRESH_TOKEN = "qc_refresh_token";
const ACCESS_EXPIRY = "qc_access_expiry";
const REFRESH_EXPIRY = "qc_refresh_expiry";

// --- getters ---
export const getAccessToken = (): string | null => localStorage.getItem(ACCESS_TOKEN);
export const getRefreshToken = (): string | null => localStorage.getItem(REFRESH_TOKEN);

export const getAccessTokenExpiry = (): Date | null => {
  try {
    const expiry = localStorage.getItem(ACCESS_EXPIRY);
    return expiry ? new Date(expiry) : null;
  } catch {
    // corrupted value -> clear and return null
    clearTokens();
    return null;
  }
};

export const getRefreshTokenExpiry = (): Date | null => {
  try {
    const expiry = localStorage.getItem(REFRESH_EXPIRY);
    return expiry ? new Date(expiry) : null;
  } catch {
    clearTokens();
    return null;
  }
};

// --- helpers ---
export const isExpired = (expiryDate: Date | null): boolean => {
  if (!expiryDate) return true;
  return Date.now() >= expiryDate.getTime();
};

/**
 * Returns true if token will expire within the next `thresholdSeconds` seconds.
 * Useful to proactively refresh before it actually expires.
 */
export const isExpiringSoon = (expiryDate: Date | null, thresholdSeconds = 30): boolean => {
  if (!expiryDate) return true;
  return Date.now() + thresholdSeconds * 1000 >= expiryDate.getTime();
};

export const isAccessTokenExpired = (): boolean => isExpired(getAccessTokenExpiry());
export const isRefreshTokenExpired = (): boolean => isExpired(getRefreshTokenExpiry());
export const isAccessTokenExpiringSoon = (thresholdSeconds = 30) =>
  isExpiringSoon(getAccessTokenExpiry(), thresholdSeconds);

// --- setters ---
export const setTokens = (payload: AuthResponsePayload): void => {
  // guard: ensure required fields exist
  if (!payload?.access_token || !payload?.refresh_token) {
    throw new Error("Invalid token payload");
  }

  localStorage.setItem(ACCESS_TOKEN, payload.access_token);
  localStorage.setItem(REFRESH_TOKEN, payload.refresh_token);

  // convert seconds -> ms and store ISO
  const accessExpiry = new Date(Date.now() + payload.access_expires_in * 1000).toISOString();
  const refreshExpiry = new Date(Date.now() + payload.refresh_expires_in * 1000).toISOString();

  localStorage.setItem(ACCESS_EXPIRY, accessExpiry);
  localStorage.setItem(REFRESH_EXPIRY, refreshExpiry);
};

// --- clear ---
export const clearTokens = (): void => {
  try {
    localStorage.removeItem(ACCESS_TOKEN);
    localStorage.removeItem(REFRESH_TOKEN);
    localStorage.removeItem(ACCESS_EXPIRY);
    localStorage.removeItem(REFRESH_EXPIRY);
  } catch {
    // ignore failures to delete (rare)
  }
};
