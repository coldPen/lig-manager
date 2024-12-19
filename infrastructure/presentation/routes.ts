import { type RouteConfig, index, route } from "@react-router/dev/routes"

export default [
  index("routes/home.tsx"),
  route("classes", "routes/classes/index.tsx", [
    index("routes/classes/classList.tsx"),
    route(":classId", "routes/classes/classView.tsx"),
  ]),
] satisfies RouteConfig
