import { useState } from "react";

interface CadastralNumberListProps {
  numbers: string[];
  onSelect: (cadastralNumber: string) => void;
}

/**
 * Filterlangan bino kadastr raqamlari ro'yxati (scrollable) — bosilganda xarita
 * shu binoga fokus qiladi. Yuqorisidagi input — ro'yxat ichida kadastr raqam
 * bor-yo'qligini tekshirish uchun (mahalliy qidiruv, ro'yxatni filterlaydi).
 */
export function CadastralNumberList({
  numbers,
  onSelect,
}: CadastralNumberListProps) {
  const [query, setQuery] = useState("");
  const filtered = query.trim()
    ? numbers.filter((number) => number.includes(query.trim()))
    : numbers;

  return (
    <div className="absolute left-4 top-32 z-sticky flex max-h-[50vh] w-[300px] flex-col rounded-xl bg-neutral-0/95 p-2 shadow-header backdrop-blur">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Kadastr raqami bo'yicha qidirish..."
        aria-label="Ro'yxatdan kadastr raqami bo'yicha qidirish"
        className="mb-2 shrink-0 rounded-lg border border-line bg-neutral-0 px-3 py-2 font-mono text-sm text-neutral-900 outline-none focus:border-primary-600"
      />
      <div className="overflow-y-auto">
        {filtered.length === 0 ? (
          <p className="px-2 py-3 text-center text-sm text-neutral-500">
            Kadastr raqamlar topilmadi
          </p>
        ) : (
          <ul className="flex flex-col gap-1">
            {filtered.map((number) => (
              <li key={number}>
                <button
                  type="button"
                  onClick={() => onSelect(number)}
                  className="w-full rounded-lg px-3 py-2 text-left font-mono text-sm text-neutral-900 transition-colors hover:bg-neutral-100"
                >
                  {number}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
