import UsersList from "@pages/UsersList";
import { Navigate, Outlet, RouteObject } from "react-router-dom";
import Layout from "./components/Layout";
import { ProtectedRoute } from "./contexts/AuthContext";
import Attendance from "./pages/Attendance";
import CreateUser from "./pages/CreateUser";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Rewards from "./pages/Rewards";
import Tasks from "./pages/Tasks";
import UserCabinet from "./pages/UserCabinet";

export const routes: RouteObject[] = [
  {
    path: "/mao-admin-panel",
    element: (
      <ProtectedRoute>
        <Layout>
          <Outlet />
        </Layout>
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: "tasks",
        element: <Tasks />,
      },
      {
        path: "attendance",
        element: <Attendance />,
      },
      {
        path: "rewards",
        element: <Rewards />,
      },
      {
        path: "create-user",
        element: <CreateUser />,
      },
      {
        path: "users-list",
        element: <UsersList />,
      },
      {
        path: "cabinet",
        element: <UserCabinet />,
      },
    ],
  },
  {
    path: "/mao-admin-panel/login",
    element: <Login />,
  },
  {
    path: "/user-cabinet",
    element: (
      <ProtectedRoute>
        <UserCabinet />
      </ProtectedRoute>
    ),
  },
  {
    path: "*",
    element: <Navigate to="/mao-admin-panel" replace />,
  },
];
