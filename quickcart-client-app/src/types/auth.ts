// src/types/auth.ts
export type UserRole = "customer" | "seller" | "admin";

export interface AuthResponsePayload {
  access_token: string;
  access_expires_in: number;
  refresh_token: string;
  refresh_expires_in: number;
  token_type: string;
}
