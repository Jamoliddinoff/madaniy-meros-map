import { Modal } from "@/shared/ui/Modal";
import { Spinner } from "@/shared/ui/Spinner";

interface DrawConfirmModalProps {
  open: boolean;
  landCadastralNumber: string | null;
  saving: boolean;
  onConfirm: () => void;
  onDecline: () => void;
}

/** Chizilgan poligonni landCadastralNumber'ga biriktirishni so'rovchi tasdiqlash modali. */
export function DrawConfirmModal({
  open,
  landCadastralNumber,
  saving,
  onConfirm,
  onDecline,
}: DrawConfirmModalProps) {
  return (
    <Modal open={open} onClose={onDecline} title="Poligonni biriktirish">
      <div className="flex flex-col gap-4">
        <p className="text-sm text-neutral-900">
          <span className="font-mono font-medium">{landCadastralNumber}</span>{" "}
          yer kadastr raqamiga chizilgan poligon biriktirilsinmi?
        </p>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onConfirm}
            disabled={saving}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary-600 py-2.5 font-medium text-neutral-0 transition-colors hover:bg-primary-700 disabled:opacity-60"
          >
            {saving && <Spinner className="h-4 w-4 text-neutral-0" />}
            {saving ? "Saqlanmoqda..." : "Ha"}
          </button>
          <button
            type="button"
            onClick={onDecline}
            disabled={saving}
            className="flex-1 rounded-lg border border-line py-2.5 font-medium text-neutral-900 transition-colors hover:bg-neutral-100 disabled:opacity-60"
          >
            Yo'q
          </button>
        </div>
      </div>
    </Modal>
  );
}
