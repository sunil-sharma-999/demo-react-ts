import { clearCookies, cookieKeys, getCookie } from "@/services/cookies";
import {
  clearLocalStorage,
  getLocalStorage,
  localStorageKeys,
} from "@/services/localStorage";
import { IUser } from "@/types/users";
import { createSlice } from "@reduxjs/toolkit";

type IState = {
  user: IUser | null;
  token: string;
};

const initialState: IState = {
  user: (getLocalStorage(localStorageKeys.USER) as IUser) || null,
  token: (getCookie(cookieKeys.TOKEN) as string) || "",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(state, { payload }) {
      payload = payload as IUser | null;
      state.user = payload;
      state.token = payload?.authorization || "";
    },
    logout(state) {
      state.token = "";
      state.user = null;
      clearCookies();
      clearLocalStorage();
    },
  },
  extraReducers: () => {},
});

export const { login, logout } = authSlice.actions;

export default authSlice.reducer;
