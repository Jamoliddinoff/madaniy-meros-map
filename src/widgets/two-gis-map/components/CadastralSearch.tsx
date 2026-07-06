import { useState, type FormEvent } from "react";
import { useToast } from "@/shared/ui/toast/toast-context";

interface CadastralSearchProps {
  /** Topilса true qaytaradi (topilmasa false). */
  onSearch: (query: string) => boolean;
}

/** Xarita chap yuqorisidagi kadastr raqami bo'yicha qidiruv. */
export function CadastralSearch({ onSearch }: CadastralSearchProps) {
  const [value, setValue] = useState("");
  const { showToast } = useToast();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const query = value.trim();
    if (!query) return;
    if (!onSearch(query)) {
      showToast("Kadastr raqami topilmadi", "error");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="absolute left-4 top-4 z-sticky flex w-[400px]  gap-2 rounded-xl bg-neutral-0/95 p-2 shadow-header backdrop-blur bg-transparent"
    >
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Kadastr raqami..."
        aria-label="Kadastr raqami bo'yicha qidirish"
        className="min-w-0  flex-1 rounded-lg border border-line bg-neutral-0 px-3 py-2 font-mono text-sm text-neutral-900 outline-none focus:border-primary-600"
      />
      <button
        type="submit"
        aria-label="Qidirish"
        className="shrink-0 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-neutral-0 transition-colors hover:bg-primary-700"
      >
        Qidirish
      </button>
    </form>
  );
}
