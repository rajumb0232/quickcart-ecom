import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { UserRole } from "../../types/auth";

export interface AuthState {
  isAuthenticated: boolean;
  roles: UserRole[];
  token: string | null;
  expiry: string | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  roles: [],
  token: null,
  expiry: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {

    loginSuccess: (state, action: PayloadAction<{ token: string; roles: UserRole[]; expiry: string; }>) => {
      state.isAuthenticated = true;
      state.roles = action.payload.roles;
      state.token = action.payload.token;
      state.expiry = action.payload.expiry;
    },

    logout: (state) => {
      state.isAuthenticated = false;
      state.roles = [];
      state.token = null;
    },
    
  },
});

// Export actions so you can dispatch them from components
export const { loginSuccess, logout } = authSlice.actions;

// Export reducer to register in store.ts
export default authSlice.reducer;
