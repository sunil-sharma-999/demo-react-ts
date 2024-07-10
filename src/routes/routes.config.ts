import Auth from "@/modules/auth/index.tsx";
import Users from "@/modules/users/index.tsx";
import routesConstants from "./routesConstants.ts";
import { IRoute } from "./types.ts";

const routesConfig: {
  private: IRoute[];
  public: IRoute[];
} = {
  private: [
    {
      path: routesConstants.USERS,
      Component: Users,
      children: [],
    },
  ],
  public: [
    {
      path: "/",
      Component: Auth,
      children: [],
    },
  ],
};

export default routesConfig;
