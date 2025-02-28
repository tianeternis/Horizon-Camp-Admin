import { createBrowserRouter } from "react-router-dom";
import PrivateRoute from "./private/PrivateRoute";

import MainLayout from "@/layouts/MainLayout";

import Dashboard from "@/pages/Dashboard";
import Login from "@/pages/Login";
import NotFound from "@/pages/NotFound";
import AppLayout from "@/layouts/AppLayout";
import User from "@/pages/User";
import Category from "@/pages/Category";
import Brand from "@/pages/Brand";
import PicnicGuide from "@/pages/PicnicGuide";
import Product from "@/pages/Product";
import Order from "@/pages/Order";
import Profile from "@/pages/Profile";

const routes = [
  {
    path: "",
    element: <AppLayout />,
    children: [
      {
        element: (
          <PrivateRoute>
            <MainLayout />
          </PrivateRoute>
        ),
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
            path: "manage-product",
            element: <Product />,
          },
          {
            path: "order",
            element: <Order />,
          },
          {
            path: "picnic-guide",
            element: <PicnicGuide />,
          },
          {
            path: "profile",
            element: <Profile />,
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
