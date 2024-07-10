import { Suspense } from "react";
import { Navigate, Routes as ReactRouterRoutes, Route } from "react-router-dom";
import routesConfig from "./routes.config.ts";
import routesConstants from "./routesConstants.ts";
import { IRoute } from "./types.ts";
import getRoute from "./utils/getRoute.ts";
import Layout from "@/layout/index.tsx";
import { useAppSelector } from "@/store/index.ts";

const Public = (route: IRoute) => {
  // Logic for public routes
  const { Component } = route;

  if (!Component) {
    return null;
  }

  return (
    <Suspense fallback={"Loading..."}>
      <Component />
    </Suspense>
  );
};

const Private = (route: IRoute) => {
  const { Component } = route;

  if (!Component) {
    return null;
  }
  return (
    <Suspense fallback={"Loading..."}>
      <Component />
    </Suspense>
  );
};

const createNestedRoutes = (
  routes: IRoute[],
  RouteType: (route: IRoute) => JSX.Element | null
) => {
  return routes.map((route, i) => {
    if (!route.Component) {
      throw new Error("Component must be required....");
    }
    if (route.children) {
      return (
        <Route path={route.path} key={i} element={<RouteType {...route} />}>
          {createNestedRoutes(route.children, RouteType)}
        </Route>
      );
    } else {
      return (
        <Route
          key={i}
          index={route.index}
          path={route.path}
          element={<RouteType {...route} />}
        />
      );
    }
  });
};

const Routes = () => {
  const { token } = useAppSelector((state) => state.auth);
  const { private: privateRoutes, public: publicRoutes } = routesConfig;

  return (
    <ReactRouterRoutes>
      {token ? (
        <>
          <Route
            index
            element={<Navigate to={getRoute([routesConstants.USERS])} />}
          />
          <Route path="/" element={<Layout />}>
            {createNestedRoutes(privateRoutes, Private)}
          </Route>
          <Route
            path="*"
            element={<Navigate to={getRoute([routesConstants.USERS])} />}
          />
        </>
      ) : (
        <>
          {createNestedRoutes(publicRoutes, Public)}
          <Route
            path="*"
            element={<Navigate to={getRoute([routesConstants.LOGIN])} />}
          />
        </>
      )}
    </ReactRouterRoutes>
  );
};

export default Routes;
