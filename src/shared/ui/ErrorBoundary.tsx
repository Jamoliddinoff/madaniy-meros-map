import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  error: Error | null;
}

/** Har bir qatlamni o'rab turadigan xatolik chegarasi (section 17). */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("ErrorBoundary:", error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <div className="flex min-h-full flex-col items-center justify-center gap-2 p-6 text-center">
          <h2 className="text-lg font-semibold text-error-dark">
            Xatolik yuz berdi
          </h2>
          {import.meta.env.DEV && (
            <pre className="max-w-full overflow-x-auto rounded-lg bg-neutral-100 p-3 text-left text-xs text-neutral-900">
              {this.state.error.message}
            </pre>
          )}
        </div>
      );
    }
    return this.props.children;
  }
}
