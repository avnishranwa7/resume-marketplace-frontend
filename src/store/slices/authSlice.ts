import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  token: string | null;
  role: string | null;
  userId: string | null;
}

const initialState: AuthState = {
  token: localStorage.getItem("auth_token"),
  role: localStorage.getItem("auth_role"),
  userId: localStorage.getItem("auth_user_id"),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (
      state,
      action: PayloadAction<{ token: string; role: string; userId: string }>
    ) => {
      const { token, role, userId } = action.payload;
      state.token = token;
      state.role = role;
      state.userId = userId;

      // Persist to localStorage
      localStorage.setItem("auth_token", token);
      localStorage.setItem("auth_role", role);
      localStorage.setItem("auth_user_id", userId);
    },
    logout: (state) => {
      state.token = null;
      state.role = null;
      state.userId = null;

      // Clear localStorage
      localStorage.removeItem("auth_token");
      localStorage.removeItem("auth_role");
      localStorage.removeItem("auth_user_id");
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
