import { Suspense } from "react";
import { RouterProvider } from "react-router-dom";
import { AuthProvider } from "./providers/AuthProvider";
import { router } from "./router";
import { ErrorBoundary } from "@/shared/ui/ErrorBoundary";

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Suspense fallback={null}>
          <RouterProvider router={router} />
        </Suspense>
      </AuthProvider>
    </ErrorBoundary>
  );
}
