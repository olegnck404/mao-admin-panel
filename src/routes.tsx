import { Navigate, Outlet, RouteObject } from "react-router-dom";
import Layout from "./components/Layout";
import { ProtectedRoute } from "./contexts/AuthContext";
import Attendance from "./pages/Attendance";
import CreateUser from "./pages/CreateUser";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Rewards from "./pages/Rewards";
import Tasks from "./pages/Tasks";

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
    ],
  },
  {
    path: "/mao-admin-panel/login",
    element: <Login />,
  },
  {
    path: "*",
    element: <Navigate to="/mao-admin-panel" replace />,
  },
];
