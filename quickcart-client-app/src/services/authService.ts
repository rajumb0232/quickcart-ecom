import type { ApiResponse } from './../types/apiResponseType';
import type { UserProfile, AuthResponsePayload, UserRole, UserProfileEditRequest, SellerProfileEditRequest } from "../types/auth";
import { api } from "../api/apiClient"; // plain axios wrapper instance
import { selectRoles } from "../features/auth/authSelectors";
import { store } from "../app/store";
import { useAPI } from '../hooks/useApi';
import { getRefreshToken, isRefreshTokenExpired, setTokens } from './tokenStorage';
import { loginSuccess } from '../features/auth/authSlice';

let refreshPromise: Promise<AuthResponsePayload | null> | null = null;

export const doRefreshOnce = async (): Promise<AuthResponsePayload | null> => {
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

export async function doRefresh(
  refreshToken: string
): Promise<AuthResponsePayload> {
  const formData = new URLSearchParams();
  formData.append("refresh_token", refreshToken);

  const resp = await api.post("/public/login/refresh", formData, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });

  const apiResponse: ApiResponse<AuthResponsePayload> = resp?.data;

  if(apiResponse) {
    return apiResponse?.data;
  }
  // if your apiClient wraps responses differently, adjust accordingly
  throw new Error(
    (resp && (resp as any).message) || "Invalid refresh response"
  );
}

export async function fetchRoles(token: string): Promise<UserRole[]> {
  const cached = selectRoles(store.getState());
  if (cached && cached.length > 0) return cached;

  const resp = await api.get("/users/roles", {
    headers: { Authorization: `Bearer ${token}` },
    timeout: 10000,
  });

  const apiResponse: ApiResponse<UserRole[]> = resp?.data;

  if(apiResponse) {
    return apiResponse?.data;
  }
  throw new Error((resp && (resp as any).message) || "Invalid roles response");
}


// =================== Services for Tanstack Query (Login, Logout, Register & getRoles) ===================

export interface Credentials {
  email: string;
  password: string;
}

export interface CreationResponse {
  success: boolean;
  message: string;
}

export interface LogoutRequest {
  access_token: string;
  refresh_token: string;
}


export const authService = {
  
  register: (api: ReturnType< typeof useAPI> ,data: Credentials) => {
    return api.post<CreationResponse>('/public/users/register', data);
  },

  login: (api: ReturnType< typeof useAPI> ,data: Credentials) => {
    const formData = new URLSearchParams();
    formData.append("email", data.email);
    formData.append("password", data.password);
    return api.post<AuthResponsePayload>('/public/login', formData);
  },

  logout: (api: ReturnType< typeof useAPI>, data: LogoutRequest) => {
    const formData = new URLSearchParams();
    formData.append("access_token", data.access_token);
    formData.append("refresh_token", data.refresh_token);
    return api.post<CreationResponse>('/public/logout', formData);
  },

  fetchRoles: (api: ReturnType< typeof useAPI>) => {
    return api.get<UserRole[]>("/users/roles");
  },

  fetchProfileInfo: (api: ReturnType< typeof useAPI>) => {
    return api.get<UserProfile>("/users/profile");
  },

  updateProfile: (api: ReturnType< typeof useAPI>, data: UserProfileEditRequest) => {
    return api.put<UserProfile>("/users/profile", data);
  },

  updateSellerProfile: (api: ReturnType< typeof useAPI>, data: SellerProfileEditRequest) => {
    return api.put<UserProfile>("/sellers/profile", data);
  }
}
