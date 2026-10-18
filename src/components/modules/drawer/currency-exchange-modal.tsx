"use client";

import React, { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { DenominationInput } from "./denomination-input";
import { CashDenomination, DenominationCount } from "@/types";
import { validateDrawerExchange } from "@/utils/changeCalculator";
import { formatCurrency } from "@/utils/currencyFormatter";

interface CurrencyExchangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentDenominations: CashDenomination[];
  onConfirmExchange: (
    newDenominations: CashDenomination[],
    detailsNote: string,
  ) => Promise<void>;
  showAlert: (
    title: string,
    message: string,
    type?: "success" | "error" | "info",
  ) => void;
}

const DEFAULT_DENOMINATIONS: CashDenomination[] = [
  { value: 200, count: 0, denomination: 200 },
  { value: 100, count: 0, denomination: 100 },
  { value: 50, count: 0, denomination: 50 },
  { value: 20, count: 0, denomination: 20 },
  { value: 10, count: 0, denomination: 10 },
  { value: 5, count: 0, denomination: 5 },
  { value: 1, count: 0, denomination: 1 },
  { value: 0.5, count: 0, denomination: 0.5 },
];

export const CurrencyExchangeModal: React.FC<CurrencyExchangeModalProps> = ({
  isOpen,
  onClose,
  currentDenominations,
  onConfirmExchange,
  showAlert,
}) => {
  const [taken, setTaken] = useState<DenominationCount[]>(
    DEFAULT_DENOMINATIONS,
  );
  const [added, setAdded] = useState<DenominationCount[]>(
    DEFAULT_DENOMINATIONS,
  );
  const [loading, setLoading] = useState(false);

  const validation = validateDrawerExchange(taken, added);

  const handleExecuteExchange = async () => {
    if (!validation.isValid) return;

    for (const item of taken) {
      const currentItem = currentDenominations.find(
        (d) => d.value === item.value,
      );
      if (item.count > (currentItem?.count || 0)) {
        showAlert(
          "خطأ بالرصيد",
          `عدد الفئات من فئة ${item.value} ريال المطلوبة سحبها غير متوفرة بالدرج!`,
          "error",
        );
        return;
      }
    }

    const updatedDenominations = currentDenominations.map((item) => {
      const takenCount = taken.find((t) => t.value === item.value)?.count || 0;
      const addedCount = added.find((a) => a.value === item.value)?.count || 0;
      return {
        ...item,
        count: item.count - takenCount + addedCount,
      };
    });

    const detailsNote = `تم سحب بقيمة ${formatCurrency(validation.takenTotal)} وإدخال بقيمة ${formatCurrency(validation.addedTotal)}`;

    try {
      setLoading(true);
      await onConfirmExchange(updatedDenominations, detailsNote);
      setTaken(DEFAULT_DENOMINATIONS);
      setAdded(DEFAULT_DENOMINATIONS);
      onClose();
    } catch (err: any) {
      showAlert("خطأ", err.message || "حدث خطأ أثناء التبديل", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="تبديل وصرف فئات العملة">
      <div className="space-y-4 max-h-[80vh] overflow-y-auto p-1 text-(--text-main)">
        <div>
          <h4 className="text-xs font-bold text-(--color-danger) mb-2">
            الفئات المسحوبة من الدرج:
          </h4>
          <DenominationInput denominations={taken} onChange={setTaken} />
        </div>

        <div>
          <h4 className="text-xs font-bold text-(--color-primary) mb-2">
            الفئات المضافة إلى الدرج:
          </h4>
          <DenominationInput denominations={added} onChange={setAdded} />
        </div>

        <div className="bg-(--bg-subtle) p-3 rounded-lg flex justify-between items-center text-xs border border-(--border-color)">
          <div>
            <span>المسحوب: </span>
            <strong className="text-(--color-danger)">
              {formatCurrency(validation.takenTotal)}
            </strong>
          </div>
          <div>
            <span>المضاف: </span>
            <strong className="text-(--color-primary)">
              {formatCurrency(validation.addedTotal)}
            </strong>
          </div>
          <div>
            <span>الفارق: </span>
            <strong
              className={
                validation.difference === 0
                  ? "text-(--color-primary)"
                  : "text-(--color-danger)"
              }
            >
              {formatCurrency(validation.difference)}
            </strong>
          </div>
        </div>

        {!validation.isValid && validation.takenTotal > 0 && (
          <p className="text-xs text-(--color-danger) font-semibold text-center">
            تنبيه: يجب أن تكون قيمة الفئات المسحوبة مساوية تماماً لقيمة الفئات
            المضافة!
          </p>
        )}

        <Button
          variant="primary"
          fullWidth
          disabled={!validation.isValid || loading}
          onClick={handleExecuteExchange}
        >
          تأكيد تبديل العملات
        </Button>
      </div>
    </Modal>
  );
};
