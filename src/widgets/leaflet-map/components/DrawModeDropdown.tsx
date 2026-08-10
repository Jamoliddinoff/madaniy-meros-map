import { useEffect, useRef, useState } from "react";
import { LiaDrawPolygonSolid } from "react-icons/lia";
import { FaRegCircle } from "react-icons/fa";
import type { DrawMode } from "../hooks/useDrawPolygon";

interface DrawModeDropdownProps {
  mode: DrawMode;
  onChange: (mode: DrawMode) => void;
}

const OPTIONS: { value: DrawMode; label: string; icon: React.ReactNode }[] = [
  {
    value: "polygon",
    label: "Poligon chizish",
    icon: <LiaDrawPolygonSolid className="text-base" />,
  },
  {
    value: "circle",
    label: "Doira chizish",
    icon: <FaRegCircle className="text-base" />,
  },
];

/** Poligon/doira chizish rejimini tanlaydigan dropdown (icon bilan). */
export function DrawModeDropdown({ mode, onChange }: DrawModeDropdownProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const active = OPTIONS.find((option) => option.value === mode) ?? OPTIONS[0];

  useEffect(() => {
    if (!open) return;
    const handleOutsideClick = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-2 rounded-lg border border-line bg-neutral-0/95 px-3 py-2 text-sm font-medium text-neutral-900 shadow-header backdrop-blur transition-colors hover:bg-neutral-100"
      >
        <span className="flex items-center gap-2">
          {active.icon}
          {active.label}
        </span>
      </button>
      {open && (
        <div
          role="listbox"
          className="absolute right-0 top-full z-dropdown mt-1 w-full min-w-max overflow-hidden rounded-lg border border-line bg-neutral-0/95 shadow-header backdrop-blur"
        >
          {OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              role="option"
              aria-selected={option.value === mode}
              onClick={() => {
                onChange(option.value);
                setOpen(false);
              }}
              className={`flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition-colors ${
                option.value === mode
                  ? "bg-primary-600 text-neutral-0"
                  : "text-neutral-900 hover:bg-neutral-100"
              }`}
            >
              {option.icon}
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
