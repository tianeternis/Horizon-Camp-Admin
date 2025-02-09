import { createBrowserRouter } from "react-router-dom";

import MainLayout from "@/layouts/MainLayout";

import Dashboard from "@/pages/Dashboard";
import Login from "@/pages/Login";
import NotFound from "@/pages/NotFound";
import AppLayout from "@/layouts/AppLayout";
import User from "@/pages/User";
import Category from "@/pages/Category";

const routes = [
  {
    path: "",
    element: <AppLayout />,
    children: [
      {
        element: <MainLayout />,
        children: [
          {
            index: true,
            element: <Dashboard />,
          },
          {
            path: "manage-user",
            element: <User />,
          },
          {
            path: "manage-category",
            element: <Category />,
          },
        ],
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
];

const router = createBrowserRouter(routes);

export default router;
