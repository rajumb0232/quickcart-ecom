import { loginSuccess, logout } from "../features/auth/authSlice";
import { doRefreshOnce, fetchRoles } from "../services/authService";
import {
  clearTokens,
  getAccessToken,
  getAccessTokenExpiry,
  getRefreshToken,
  getRefreshTokenExpiry,
  isAccessTokenExpiringSoon,
} from "../services/tokenStorage";
import { store } from "./store";

export const hydrateAuthState = async (): Promise<void> => {
  const token = getAccessToken();
  const expiry = getAccessTokenExpiry();
  const refresh = getRefreshToken();
  const refresh_expiry = getRefreshTokenExpiry();

  // Clear if no valid refresh token
  if (!refresh || !refresh_expiry || refresh_expiry.getTime() < Date.now()) {
    doClearAll();
    return;
  }

  if (token && expiry) {
    if (isAccessTokenExpiringSoon(30)) {
      // Access to expired or expiring soon, try refreshing
      await doRefresh();
    } else {
      // Access Token Valid, try refreshing
      await updateContext(token, expiry);
    }

  } else {
    // No access token but valid refresh token: try refreshing
    await doRefresh();
  }
};

const doClearAll = () => {
  clearTokens();
  store.dispatch(logout());
};

const doRefresh = async () => {
  try {
    await doRefreshOnce();
  } catch (error) {
    console.error("Failed to refresh token.", error);
    doClearAll();
  }
};

const updateContext = async (token: string, expiry: Date) => {
      try {
      const roles = await fetchRoles(token);
      store.dispatch(
        loginSuccess({
          token,
          roles,
          expiry: expiry.toISOString(),
        })
      );
    } catch (error) {
      console.error("Failed to fetch user roles:", error);
      doClearAll();
    }
}
