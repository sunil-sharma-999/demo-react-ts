import { adminApi } from "@/services/api";
import { useAppDispatch } from "@/store";
import { logout } from "@/store/slices/authSlice";
import { Button, Container } from "@mui/material";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div className="min-h-[100vh] bg-[#d5e7ec]">
      <Container>
        <div className="flex justify-end pt-4">
          <Logout />
        </div>
      </Container>
      <div>
        <Outlet />
      </div>
    </div>
  );
};

function Logout() {
  const dispatch = useAppDispatch();
  return (
    <Button
      variant="contained"
      style={{
        fontSize: "13px",
      }}
      onClick={async () => {
        try {
          await adminApi.get("/logout");
        } catch (e) {
          console.error(e);
        } finally {
          dispatch(logout());
        }
      }}
    >
      Logout
    </Button>
  );
}

export default Layout;
