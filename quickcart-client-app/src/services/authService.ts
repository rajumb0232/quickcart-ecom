import type { ApiResponse } from './../types/apiResponseType';
// authService.ts
import type { AuthResponsePayload, UserRole } from "../types/auth";
import { api } from "../api/apiClient"; // plain axios wrapper instance
import { selectRoles } from "../features/auth/authSelectors";
import { store } from "../app/store";

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
