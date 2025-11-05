// src/types/auth.ts
export type UserRole = "customer" | "seller" | "admin";

export interface AuthResponsePayload {
  access_token: string;
  access_expires_in: number;
  refresh_token: string;
  refresh_expires_in: number;
  token_type: string;
}

export interface UserRoleProfile {
  role: "customer" | "seller" | "admin";
  bio?: string;
  selling_since?: string;
}

export interface UserProfile {
  user_id: string;
  first_name?: string;
  last_name?: string;
  email: string;
  phone?: string;
  created_at: string;
  updated_at: string;
  profiles: UserRoleProfile[];
}