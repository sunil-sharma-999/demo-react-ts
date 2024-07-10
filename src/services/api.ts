import axios, { AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { clearCookies, cookieKeys, getCookie } from "./cookies";
import { clearLocalStorage } from "./localStorage";
import { store } from "@/store";
import { logout } from "@/store/slices/authSlice";

export const API_URL = import.meta.env.VITE_API_URL;

function requestMiddleware(req: InternalAxiosRequestConfig<unknown>) {
  const token = getCookie(cookieKeys.TOKEN);
  if (token) {
    req.headers.Authorization = "Bearer " + token;
  }

  return req;
}

function responseMiddleware(response: AxiosResponse<unknown, unknown>) {
  return response;
}

function responseErr(error: any) {
  if (error?.response?.status === 401) {
    store.dispatch(logout());
    return Promise.reject(error);
  }

  return Promise.reject(error);
}

const adminApi = axios.create({
  baseURL: API_URL,
});

adminApi.interceptors.request.use(requestMiddleware);
adminApi.interceptors.response.use(responseMiddleware, responseErr);

export { adminApi };
