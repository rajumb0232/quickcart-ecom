import type { RootState } from "../../app/store";

export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated;
export const selectToken = (state: RootState) => state.auth.token;
export const selectRoles = (state: RootState) => state.auth.roles;
export const selectTokenExpiry = (state: RootState) => state.auth.expiry;

export const selectIsTokenExpired = (state: RootState) => {
  const expiry = state.auth.expiry ? new Date(state.auth.expiry) : null;
  if (!expiry) return false; // default/no token → not expired
  return new Date(expiry).getTime() < Date.now();
};

export const selectIsTokenExpiringSoon = (state: RootState) => {
  const expiry = state.auth.expiry ? new Date(state.auth.expiry) : null;
  if (!expiry) return false; // default/no token → not expiring
  const diff = new Date(expiry).getTime() - Date.now();
  return diff > 0 && diff < 1 * 60 * 1000; // less than 1 minute remaining
};
