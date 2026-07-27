import { useState } from "react";
import { Modal } from "@/shared/ui/Modal";
import { useToast } from "@/shared/ui/toast/toast-context";
import type { CadastralSelection } from "../types";

interface CadastralModalProps {
  selection: CadastralSelection | null;
  onClose: () => void;
  /** Validatsiyadan o'tgach chaqiriladi; POST + refetch tashqarida bajariladi. */
  onSave: (record: {
    landCadastralNumber: string;
    cadastralNumbers: string[];
  }) => Promise<void>;
  /** Land uchun qo'lda yangi poligon chizishni boshlaydi (faqat bir nechta bino bo'lganda). */
  onAddPolygon: (landCadastralNumber: string) => void;
}

const inputClass =
  "w-full rounded-lg border border-line bg-neutral-0 px-3 py-2 font-mono text-neutral-900 outline-none focus:border-primary-600";

/**
 * Poligon bosilganda ochiladigan modal:
 * kadastr raqamlari + "madaniy meros sifatida saqlaysizmi?" savoli.
 * Building click → bitta bino (input). Land click → binolardan bir nechtasini tanlash (checkbox).
 */
export function CadastralModal({
  selection,
  onClose,
  onSave,
  onAddPolygon,
}: CadastralModalProps) {
  const options = selection?.cadastralNumbers ?? [];
  const isMultiSelect = options.length > 1;

  // State parent `key` orqali har yangi tanlovda qayta init bo'ladi (effektsiz).
  const [landCadastralNumber, setLandCadastralNumber] = useState(
    selection?.landCadastralNumber ?? "",
  );
  const [cadastralNumber, setCadastralNumber] = useState(options[0] ?? "");
  const [selectedCadastralNumbers, setSelectedCadastralNumbers] = useState<
    string[]
  >([]);
  const [saving, setSaving] = useState(false);
  const { showToast } = useToast();

  const toggleCadastralNumber = (cad: string) => {
    setSelectedCadastralNumbers((prev) =>
      prev.includes(cad) ? prev.filter((item) => item !== cad) : [...prev, cad],
    );
  };

  const handleAddPolygon = () => {
    onAddPolygon(selection?.landCadastralNumber ?? landCadastralNumber);
  };

  const handleYes = async () => {
    const land = landCadastralNumber.trim();
    const cadastralNumbers = isMultiSelect
      ? selectedCadastralNumbers
      : [cadastralNumber.trim()].filter(Boolean);
    if (!land || cadastralNumbers.length === 0) {
      showToast("Yer va bino kadastr raqamlari to'ldirilishi shart", "error");
      return;
    }
    setSaving(true);
    try {
      await onSave({ landCadastralNumber: land, cadastralNumbers });
      showToast("Muvaffaqiyatli saqlandi", "success");
    } catch {
      showToast("Saqlashda xatolik yuz berdi", "error");
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

        {!isMultiSelect &&<div className="block">
          <span className="mb-1 block text-sm font-medium text-neutral-900">
            Bino kadastr raqami
          </span>
          {/*<div*/}
          {/*  role="group"*/}
          {/*  aria-label="Bino kadastr raqami"*/}
          {/*  className="flex max-h-48 flex-col gap-1 overflow-y-auto rounded-lg border border-line bg-neutral-0 p-2"*/}
          {/*>*/}
          {/*  {options.map((cad) => (*/}
          {/*    <label*/}
          {/*      key={cad}*/}
          {/*      className="flex items-center gap-2 rounded px-2 py-1.5 font-mono text-sm text-neutral-900 hover:bg-neutral-100"*/}
          {/*    >*/}
          {/*      <input*/}
          {/*        type="checkbox"*/}
          {/*        checked={selectedCadastralNumbers.includes(cad)}*/}
          {/*        onChange={() => toggleCadastralNumber(cad)}*/}
          {/*        className="accent-primary-600"*/}
          {/*      />*/}
          {/*      {cad}*/}
          {/*    </label>*/}
          {/*  ))}*/}
          {/*</div>
           */}

            <input
              type="text"
              value={cadastralNumber}
              onChange={(e) => setCadastralNumber(e.target.value)}
              aria-label="Bino kadastr raqami"
              className={inputClass}
            />

        </div>}

        {isMultiSelect && (
          <button
            type="button"
            onClick={handleAddPolygon}
            className="flex-1 rounded-lg bg-primary-600 py-2.5 font-medium text-neutral-0 transition-colors hover:bg-primary-700 disabled:opacity-60"
          >

            Poligon qo'shish
          </button>
        )}

        {!isMultiSelect&&<>
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
            {saving ? "Saqlanmoqda..." : "Saqlash"}
          </button>
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="flex-1 rounded-lg border border-line py-2.5 font-medium text-neutral-900 transition-colors hover:bg-neutral-100 disabled:opacity-60"
          >
            Yo'q
          </button>
        </div></>}
      </div>
    </Modal>
  );
}
