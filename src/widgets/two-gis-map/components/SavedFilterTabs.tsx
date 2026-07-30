import type { SavedFilterMode } from "../types";

interface SavedFilterTabsProps {
  value: SavedFilterMode;
  onChange: (value: SavedFilterMode) => void;
}

const OPTIONS: { value: SavedFilterMode; label: string }[] = [
  { value: "all", label: "Barchasi" },
  { value: "marked", label: "Belgilangan" },
  { value: "unmarked", label: "Belgilanmagan" },
];

/** Xarita chap yuqorisidagi binolarni belgilanganlik bo'yicha filterlash (tab/segmented). */
export function SavedFilterTabs({ value, onChange }: SavedFilterTabsProps) {
  return (
    <div
      role="tablist"
      aria-label="Binolarni belgilanganlik bo'yicha filterlash"
      className="absolute left-4 top-20 z-sticky flex gap-1 rounded-xl bg-neutral-0/95 p-1 shadow-header backdrop-blur"
    >
      {OPTIONS.map((option) => (
        <button
          key={option.value}
          type="button"
          role="tab"
          aria-selected={value === option.value}
          onClick={() => onChange(option.value)}
          className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
            value === option.value
              ? "bg-primary-600 text-neutral-0"
              : "text-neutral-500 hover:bg-neutral-100"
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
