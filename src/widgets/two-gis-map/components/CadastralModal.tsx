import { useState } from "react";
import { Modal } from "@/shared/ui/Modal";
import type { CadastralSelection } from "../types";

interface CadastralModalProps {
  selection: CadastralSelection | null;
  onClose: () => void;
  /** Validatsiyadan o'tgach chaqiriladi; POST + refetch tashqarida bajariladi. */
  onSave: (record: {
    landCadastralNumber: string;
    cadastralNumber: string;
  }) => Promise<void>;
}

const inputClass =
  "w-full rounded-lg border border-line bg-neutral-0 px-3 py-2 font-mono text-neutral-900 outline-none focus:border-primary-600";

/**
 * Poligon bosilganda ochiladigan modal:
 * kadastr raqamlari + "madaniy meros sifatida saqlaysizmi?" savoli.
 * Building click → bitta bino (input). Land click → binolardan select.
 */
export function CadastralModal({
  selection,
  onClose,
  onSave,
}: CadastralModalProps) {
  const options = selection?.cadastralNumbers ?? [];
  const isSelect = options.length > 1;

  // State parent `key` orqali har yangi tanlovda qayta init bo'ladi (effektsiz).
  const [landCadastralNumber, setLandCadastralNumber] = useState(
    selection?.landCadastralNumber ?? "",
  );
  const [cadastralNumber, setCadastralNumber] = useState(options[0] ?? "");
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
    <Modal open={!!selection} onClose={onClose} title="Obyekt ma'lumoti">
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
            className={inputClass}
            disabled={true}
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-sm font-medium text-neutral-900">
            Bino kadastr raqami
          </span>
          {isSelect ? (
            <select
              value={cadastralNumber}
              onChange={(e) => setCadastralNumber(e.target.value)}
              aria-label="Bino kadastr raqami"
              className={inputClass}
            >
              {options.map((cad) => (
                <option key={cad} value={cad}>
                  {cad}
                </option>
              ))}
            </select>
          ) : (
            <input
              type="text"
              value={cadastralNumber}
              onChange={(e) => setCadastralNumber(e.target.value)}
              aria-label="Bino kadastr raqami"
              className={inputClass}
            />
          )}
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
