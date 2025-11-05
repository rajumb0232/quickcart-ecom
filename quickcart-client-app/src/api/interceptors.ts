import type {
  AxiosRequestConfig,
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";
import {
  clearTokens,
} from "../services/tokenStorage";
import {
  selectIsTokenExpired,
  selectIsTokenExpiringSoon,
  selectToken,
} from "../features/auth/authSelectors";
import { store } from "../app/store";
import { logout } from "../features/auth/authSlice";
import { API_BASE, api } from "./apiClient";
import {doRefreshOnce} from "../services/authService"

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
      if (access_token && config.headers) {
        config.headers.Authorization = `Bearer ${access_token}`;
      }
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

