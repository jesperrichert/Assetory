import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/index.tsx"),
  route("/auth", "routes/auth/page.tsx"),
  route("/auth/logout", "routes/auth/logout.tsx"),
] satisfies RouteConfig;
