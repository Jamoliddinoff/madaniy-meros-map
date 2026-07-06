import { useLoginForm } from "./hooks/useLoginForm";

export default function LoginPage() {
  const {
    login,
    password,
    errors,
    submitting,
    setLogin,
    setPassword,
    handleSubmit,
  } = useLoginForm();

  return (
    <div className="flex min-h-full items-center justify-center bg-neutral-50 p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-2xl border border-line bg-neutral-0 p-8 shadow-header"
      >
        <h1 className="mb-1 text-2xl font-semibold text-brand-dark">
          Madaniy meros
        </h1>
        <p className="mb-6 text-sm text-neutral-500">Tizimga kirish</p>

        <label className="mb-4 block">
          <span className="mb-1 block text-sm font-medium text-neutral-900">
            Login
          </span>
          <input
            type="text"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
            autoComplete="username"
            aria-label="Login"
            className="w-full rounded-lg border border-line bg-neutral-0 px-3 py-2 text-neutral-900 outline-none focus:border-primary-600"
          />
          {errors.login && (
            <span className="mt-1 block text-xs text-error-dark">
              {errors.login}
            </span>
          )}
        </label>

        <label className="mb-4 block">
          <span className="mb-1 block text-sm font-medium text-neutral-900">
            Parol
          </span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            aria-label="Parol"
            className="w-full rounded-lg border border-line bg-neutral-0 px-3 py-2 text-neutral-900 outline-none focus:border-primary-600"
          />
          {errors.password && (
            <span className="mt-1 block text-xs text-error-dark">
              {errors.password}
            </span>
          )}
        </label>

        {errors.form && (
          <p className="mb-4 rounded-lg bg-neutral-100 px-3 py-2 text-sm text-error-dark">
            {errors.form}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-lg bg-primary-600 py-2.5 font-medium text-neutral-0 transition-colors hover:bg-primary-700 disabled:opacity-60"
        >
          {submitting ? "Kirilmoqda..." : "Kirish"}
        </button>
      </form>
    </div>
  );
}
