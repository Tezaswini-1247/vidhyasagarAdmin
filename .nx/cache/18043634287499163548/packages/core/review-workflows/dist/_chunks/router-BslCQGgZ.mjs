import { jsx } from "react/jsx-runtime";
import { lazy } from "react";
import { Routes, Route } from "react-router-dom";
const ProtectedListPage = lazy(
  () => import("./index-D0D7uQQv.mjs").then((mod) => ({ default: mod.ProtectedListPage }))
);
const ProtectedEditPage = lazy(
  () => import("./id-FuGqdNs8.mjs").then((mod) => ({ default: mod.ProtectedEditPage }))
);
const routes = [
  {
    path: "/",
    Component: ProtectedListPage
  },
  {
    path: ":id",
    Component: ProtectedEditPage
  }
];
const Router = () => /* @__PURE__ */ jsx(Routes, { children: routes.map((route) => /* @__PURE__ */ jsx(Route, { ...route }, route.path)) });
export {
  Router
};
//# sourceMappingURL=router-BslCQGgZ.mjs.map
