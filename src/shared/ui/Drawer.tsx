import type { ReactNode } from "react";

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}

/** O'ngdan chiqadigan universal panel (drawer). */
export function Drawer({ open, onClose, title, children }: DrawerProps) {
  return (
    <>
      <div
        onClick={onClose}
        className={`fixed inset-0 z-modal bg-neutral-900/30 transition-opacity ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-hidden={!open}
      />
      <aside
        role="dialog"
        aria-label={title}
        className={`fixed right-0 top-0 z-modal flex h-full w-full max-w-sm flex-col bg-neutral-0 shadow-header transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
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
        <div className="flex-1 overflow-y-auto p-5">{children}</div>
      </aside>
    </>
  );
}
