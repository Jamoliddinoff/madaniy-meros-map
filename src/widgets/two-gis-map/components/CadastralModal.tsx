import { useState } from "react";
import { Modal } from "@/shared/ui/Modal";
import type { SelectedBuilding } from "../types";

interface CadastralModalProps {
  building: SelectedBuilding | null;
  onClose: () => void;
  /** Validatsiyadan o'tgach chaqiriladi; POST + refetch tashqarida bajariladi. */
  onSave: (record: {
    landCadastralNumber: string;
    cadastralNumber: string;
  }) => Promise<void>;
}

/**
 * Bino poligoni bosilganda ochiladigan modal:
 * kadastr raqamlari + "madaniy meros sifatida saqlaysizmi?" savoli.
 */
export function CadastralModal({
  building,
  onClose,
  onSave,
}: CadastralModalProps) {
  // Inputlar bino ma'lumoti bilan to'ldiriladi. Boshqa bino tanlanganda
  // parent `key` orqali komponentni remount qiladi — state qayta init bo'ladi.
  const [landCadastralNumber, setLandCadastralNumber] = useState(
    building?.landCadastralNumber ?? "",
  );
  const [cadastralNumber, setCadastralNumber] = useState(
    building?.cadastralNumber ?? "",
  );
  const [saving, setSaving] = useState(false);

  const handleYes = async () => {
    const land = landCadastralNumber.trim();
    const cad = cadastralNumber.trim();
    if (!land || !cad) {
      alert("Yer va bino kadastr raqamlari to'ldirilishi shart");
      return;
    }
    setSaving(true);
    try {
      await onSave({ landCadastralNumber: land, cadastralNumber: cad });
    } catch {
      alert("Saqlashda xatolik yuz berdi");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal open={!!building} onClose={onClose} title="Obyekt ma'lumoti">
      <div className="flex flex-col gap-4">
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-neutral-900">
            Yer kadastr raqami
          </span>
          <input
            type="text"
            value={landCadastralNumber}
            onChange={(e) => setLandCadastralNumber(e.target.value)}
            aria-label="Yer kadastr raqami"
            className="w-full rounded-lg border border-line bg-neutral-0 px-3 py-2 font-mono text-neutral-900 outline-none focus:border-primary-600"
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-sm font-medium text-neutral-900">
            Bino kadastr raqami
          </span>
          <input
            type="text"
            value={cadastralNumber}
            onChange={(e) => setCadastralNumber(e.target.value)}
            aria-label="Bino kadastr raqami"
            className="w-full rounded-lg border border-line bg-neutral-0 px-3 py-2 font-mono text-neutral-900 outline-none focus:border-primary-600"
          />
        </label>

        <p className="text-sm text-neutral-500">
          Ushbu binoni madaniy meros obyekti sifatida saqlaysizmi?
        </p>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={handleYes}
            disabled={saving}
            className="flex-1 rounded-lg bg-primary-600 py-2.5 font-medium text-neutral-0 transition-colors hover:bg-primary-700 disabled:opacity-60"
          >
            {saving ? "Saqlanmoqda..." : "Ha, saqlaymiz"}
          </button>
          <button
            type="button"
            onClick={onClose}
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
