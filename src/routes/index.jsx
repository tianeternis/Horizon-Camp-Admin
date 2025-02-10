import { createBrowserRouter } from "react-router-dom";

import MainLayout from "@/layouts/MainLayout";

import Dashboard from "@/pages/Dashboard";
import Login from "@/pages/Login";
import NotFound from "@/pages/NotFound";
import AppLayout from "@/layouts/AppLayout";
import User from "@/pages/User";
import Category from "@/pages/Category";
import Brand from "@/pages/Brand";
import PicnicGuide from "@/pages/PicnicGuide";

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
          {
            path: "manage-brand",
            element: <Brand />,
          },
          {
            path: "picnic-guide",
            element: <PicnicGuide />,
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
