const getRoute = (
  routes: string[] = [],
  startingSlash = false,
  trailingSlash = false
) =>
  (startingSlash ? "/" : "") +
  (Array.isArray(routes)
    ? routes.join("/")
    : typeof routes === "string"
    ? routes
    : "") +
  (trailingSlash ? "/" : "");

export default getRoute;
