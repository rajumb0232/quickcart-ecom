import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAPI } from "./useApi";
import {
  isApiResponse,
  type ApiAck,
  type ApiResult,
} from "../types/apiResponseType";
import { authService, fetchRoles } from "../services/authService";
import type {
  CreationResponse,
  Credentials,
  LogoutRequest,
} from "../services/authService";
import {
  clearTokens,
  getAccessToken,
  getRefreshToken,
  setTokens,
} from "../services/tokenStorage";
import type { UserRole, AuthResponsePayload, UserProfile } from "../types/auth";
import { loginSuccess, logout } from "../features/auth/authSlice";
import { store } from "../app/store";
import { selectIsAuthenticated } from "../features/auth/authSelectors";
import { useSelector } from "react-redux";

export const useRegister = () => {
  const api = useAPI();

  return useMutation<ApiResult<CreationResponse>, Error, Credentials>({
    mutationFn: (data: Credentials) => authService.register(api, data),
  });
};

export const useLogin = () => {
  const api = useAPI();
  const queryClient = useQueryClient();

  return useMutation<ApiResult<AuthResponsePayload>, Error, Credentials>({
    mutationFn: async (data: Credentials) => {
      // Step 1: Login
      const loginResult = await authService.login(api, data);

      // Step 2: If login successful, fetch roles
      if (loginResult.success && isApiResponse(loginResult)) {
        const { access_token, access_expires_in } = loginResult.data;
        const accessExpiry = new Date(Date.now() + access_expires_in * 1000);

        // Store tokens
        setTokens(loginResult.data);

        // Fetch roles
        const roles = await fetchRoles(access_token);

        // Dispatch to Redux
        store.dispatch(
          loginSuccess({
            token: access_token,
            roles,
            expiry: accessExpiry.toISOString(),
          })
        );

        // Invalidate queries - now matches your queryKey
        queryClient.invalidateQueries({ queryKey: ["user_roles"] });
      }

      return loginResult;
    },
  });
};

export const useLogout = () => {
  const api = useAPI();
  const queryClient = useQueryClient();

  const doLogout = () => {
    // Clear tokens from localStorage & redux store
    clearTokens();
    store.dispatch(logout());

    // Clear all cached queries (user data, etc.)
    queryClient.clear();
  };

  return useMutation<ApiAck, Error>({
    mutationFn: async () => {
      const access_token = getAccessToken();
      const refresh_token = getRefreshToken();

      // If no tokens, nothing to send to server
      if (!refresh_token || !access_token) {
        doLogout();
        return { success: true, message: "Already logged out" } as ApiAck;
      }

      // Send logout request to server
      const request: LogoutRequest = {
        access_token: access_token,
        refresh_token: refresh_token,
      };

      return authService.logout(api, request);
    },
    onSuccess: doLogout,
    onError: (error) => {
      // Even if logout API fails, clear local state
      console.error("Logout API failed:", error);
      doLogout();
    },
  });
};

export const useGetUserRoles = () => {
  const api = useAPI();
  const isAuthenticated = useSelector(selectIsAuthenticated);

  return useQuery<ApiResult<UserRole[]>, Error>({
    queryKey: ["user_roles"],
    queryFn: () => authService.fetchRoles(api),
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000, // 5 mins
    retry: 1,
  });
};

export const useGetUserProfile = () => {
  const api = useAPI();
  const isAuthenticated = useSelector(selectIsAuthenticated);

  return useQuery<ApiResult<UserProfile>, Error>({
    queryKey: ["user_profile"],
    queryFn: () => authService.fetchProfileInfo(api),
    enabled: isAuthenticated,
    staleTime: 30 * 1000, // 30 seconds
    retry: 1,
  });
};
