import { adminApi } from "@/services/api";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import { RootState } from "..";

export const fetchUsersThunk = createAsyncThunk(
  "fetchUsers",
  async (_, api) => {
    try {
      const { filter, order_by, page, per_page, search, sort } = (
        api.getState() as RootState
      ).users.meta;
      const res = await adminApi.get("/users", {
        params: {
          filter: filter?.role_id.length ? btoa(JSON.stringify(filter)) : "",
          order_by,
          page,
          per_page,
          search,
          sort,
        },
      });
      const data = await res.data;
      return data;
    } catch (err) {
      if (err instanceof AxiosError) {
        return api.rejectWithValue(err.response?.data);
      } else {
        return null;
      }
    }
  }
);
