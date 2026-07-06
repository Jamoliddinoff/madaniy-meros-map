import { Suspense } from "react";
import { RouterProvider } from "react-router-dom";
import { AuthProvider } from "./providers/AuthProvider";
import { router } from "./router";
import { ErrorBoundary } from "@/shared/ui/ErrorBoundary";
import { ToastProvider } from "@/shared/ui/toast/ToastProvider";

export default function App() {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <AuthProvider>
          <Suspense fallback={null}>
            <RouterProvider router={router} />
          </Suspense>
        </AuthProvider>
      </ToastProvider>
    </ErrorBoundary>
  );
}
