import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/index.route.tsx"),
  route("/auth", "routes/auth/page.route.tsx"),
  route("/auth/logout", "routes/auth/logout.route.tsx"),
] satisfies RouteConfig;
