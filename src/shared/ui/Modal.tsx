import type { ReactNode } from "react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}

/** Markazda ochiladigan universal modal oyna. */
export function Modal({ open, onClose, title, children }: ModalProps) {
  if (!open) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-modal flex items-center justify-center bg-neutral-900/40 p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-label={title}
        className="w-full max-w-md rounded-2xl bg-neutral-0 shadow-header"
      >
        <header className="flex items-center justify-between border-b border-line px-5 py-4">
          <h2 className="text-base font-semibold text-neutral-900">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Yopish"
            className="rounded-lg px-2 py-1 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
          >
            ✕
          </button>
        </header>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}
