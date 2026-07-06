/* eslint-disable react-refresh/only-export-components -- route config, komponent moduli emas */
import { lazy } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import { ProtectedRoute } from "@/features/auth/ProtectedRoute";

const LoginPage = lazy(() => import("@/pages/login/LoginPage"));
const MapPage = lazy(() => import("@/pages/map/MapPage"));

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/",
        element: <MapPage />,
      },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);
