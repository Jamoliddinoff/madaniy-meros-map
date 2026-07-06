import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/features/auth/model/auth-context";
import { loginSchema } from "../login.schema";

interface FieldErrors {
  login?: string;
  password?: string;
  form?: string;
}

/** Login formasining barcha holati va logikasi. */
export function useLoginForm() {
  const { login: authenticate } = useAuth();
  const navigate = useNavigate();

  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrors({});

    const parsed = loginSchema.safeParse({ login, password });
    if (!parsed.success) {
      const fieldErrors: FieldErrors = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof FieldErrors;
        fieldErrors[key] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    setSubmitting(true);
    const ok = await authenticate(parsed.data.login, parsed.data.password);
    setSubmitting(false);

    if (!ok) {
      setErrors({ form: "Login yoki parol noto'g'ri" });
      return;
    }
    navigate("/", { replace: true });
  };

  return {
    login,
    password,
    errors,
    submitting,
    setLogin,
    setPassword,
    handleSubmit,
  };
}
