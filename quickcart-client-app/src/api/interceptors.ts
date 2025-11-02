import type {
  AxiosRequestConfig,
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";
import {
  getRefreshToken,
  setTokens,
  isRefreshTokenExpired,
  clearTokens,
} from "../services/tokenStorage";
import {
  selectIsTokenExpired,
  selectIsTokenExpiringSoon,
  selectToken,
} from "../features/auth/authSelectors";
import { store } from "../app/store";
import { loginSuccess, logout } from "../features/auth/authSlice";
import type { AuthResponsePayload, UserRole } from "../types/auth";
import { doRefresh, fetchRoles } from "../services/authService";
import { API_BASE, api } from "./apiClient";

// single shared promise used as a mutex
let refreshPromise: Promise<AuthResponsePayload | null> | null = null;

// Request interceptor (proactive refresh)
api.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  const state = store.getState();
  const isAccessTokenExpiringSoon = selectIsTokenExpiringSoon(state);
  const access_token = selectToken(state);
  const isTokenExpired = selectIsTokenExpired(state);

  try {
    const url = config.url;
    if (url && url.startsWith(`${API_BASE}/public`)) {
      // don't add auth to public endpoints
      return config;
    }

    // Refresh if expiring soon
    if (isAccessTokenExpiringSoon || isTokenExpired) {
      try {
        const payload = await doRefreshOnce();
        if (payload && config.headers)
          config.headers.Authorization = `Bearer ${payload.access_token}`;
      } catch {
        // allow to 401 -> response interceptor will handle
      }
    } else {
      if (access_token && config.headers)
        config.headers.Authorization = `Bearer ${access_token}`;
    }
  } catch {
    // fail silently
  }
  return config;
});

// Response interceptor (reactive refresh on 401)
api.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const originalConfig = error.config as AxiosRequestConfig & {
      _retry?: boolean;
    };
    if (!originalConfig) return Promise.reject(error);

    // avoid trying to refresh for auth endpoints (refresh/roles)
    const url = originalConfig.url ?? "";
    if (url && url.startsWith(`${API_BASE}/public`)) {
      return Promise.reject(error);
    }

    const method = (originalConfig.method || "get").toLowerCase();
    if (["post", "put", "patch", "delete"].includes(method)) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalConfig._retry) {
      originalConfig._retry = true;
      try {
        const payload = await doRefreshOnce();
        if (payload) {
          originalConfig.headers = originalConfig.headers ?? {};
          originalConfig.headers.Authorization = `Bearer ${payload.access_token}`;
        }
        return api(originalConfig); // retry original request (interceptors run again)
      } catch (refreshErr) {
        // refresh failed -> doRefreshOnce already cleared tokens / dispatched logout
        return Promise.reject(refreshErr);
      }
    }

    // clear tokens only after a retry failed
    clearTokens();
    store.dispatch(logout());
    return Promise.reject(error);
  }
);

// ======================= Helpers =======================

const doRefreshOnce = async (): Promise<AuthResponsePayload | null> => {
  if (refreshPromise) return refreshPromise;

  if (isRefreshTokenExpired()) throw new Error("Refresh token expired");
  const refresh = getRefreshToken();
  if (!refresh) throw new Error("No refresh token");

  refreshPromise = (async () => {
    try {
      const payload = await doRefresh(refresh);
      const { access_token, access_expires_in } = payload;
      const accessExpiry = new Date(Date.now() + access_expires_in * 1000);
      setTokens(payload);

      // Uses your pluggable fetchRoles function
      const roles: UserRole[] = await fetchRoles(access_token);
      store.dispatch(
        loginSuccess({
          token: access_token,
          roles,
          expiry: accessExpiry.toISOString(),
        })
      );
      return payload;
    } catch (err) {
      throw err;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
};
