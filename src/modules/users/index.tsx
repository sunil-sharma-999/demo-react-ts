import { useAppDispatch, useAppSelector } from "@/store";
import { fetchUsersThunk } from "@/store/thunks/usersThunk";
import { Card, Container } from "@mui/material";
import { useDebounce } from "@uidotdev/usehooks";
import { useEffect } from "react";
import UsersTable from "./components/UsersTable";

const Users = () => {
  const dispatch = useAppDispatch();

  const {
    meta: { filter, order_by, page, per_page, search, sort },
  } = useAppSelector((state) => state.users);

  const debouncedSearch = useDebounce(search, 800);

  useEffect(() => {
    dispatch(fetchUsersThunk());
  }, [filter, order_by, page, per_page, sort, dispatch, debouncedSearch]);

  return (
    <div>
      <Container className="py-5">
        <Card className="p-8">
          <UsersTable />
        </Card>
      </Container>
    </div>
  );
};

export default Users;
