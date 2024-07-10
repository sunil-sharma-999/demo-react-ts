import { IUser } from "@/types/users";
import { createSlice } from "@reduxjs/toolkit";
import { fetchUsersThunk } from "../thunks/usersThunk";

type IState = {
  data: IUser[];
  loading: boolean;
  error: string | null;
  meta: {
    total: number;
    page: number;
    per_page: number;
    search: string;
    filter: { role_id: string[] };
    sort: string;
    order_by: "asc" | "desc";
  };
};

const initialState: IState = {
  data: [],
  loading: true,
  error: "",
  meta: {
    total: 0,
    page: 1,
    per_page: 10,
    search: "",
    filter: { role_id: [] },
    sort: "",
    order_by: "asc",
  },
};

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    setUsersFilter(
      state,
      {
        payload,
      }: {
        payload: {
          role_id: string[];
        };
      }
    ) {
      state.meta.filter.role_id = payload.role_id;
    },
    setUsersPage(state, { payload }: { payload: number }) {
      state.meta.page = payload;
    },
    setUsersPerPage(state, { payload }: { payload: number }) {
      state.meta.per_page = payload;
    },
    setUsersSearch(state, { payload }: { payload: string }) {
      state.meta.search = payload as string;
    },
    setUsersSort(
      state,
      {
        payload,
      }: {
        payload: {
          sort: string;
        };
      }
    ) {
      if (state.meta.sort === payload.sort) {
        state.meta.order_by = state.meta.order_by === "asc" ? "desc" : "asc";
      } else {
        state.meta.sort = payload.sort;
        state.meta.order_by = "asc";
      }
    },
    resetUsers() {
      return structuredClone(initialState);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsersThunk.fulfilled, (state, { payload }) => {
        state.data = payload?.data as IUser[];
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchUsersThunk.rejected, (state, { error }) => {
        state.error = error.message || null;
        state.loading = false;
        state.data = [];
      })
      .addCase(fetchUsersThunk.pending, (state) => {
        state.error = null;
        state.loading = true;
      });
  },
});

export const {
  setUsersFilter,
  setUsersPage,
  setUsersSearch,
  setUsersSort,
  setUsersPerPage,
  resetUsers,
} = usersSlice.actions;

export default usersSlice.reducer;
