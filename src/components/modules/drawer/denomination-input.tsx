import React from "react";
import { DenominationInputProps } from "@/types";
import { formatCurrency } from "@/utils/currencyFormatter";

export const DenominationInput: React.FC<DenominationInputProps> = ({
  denominations,
  onChange,
}) => {
  const handleCountChange = (denomValue: number, newCount: number) => {
    const updated = denominations.map((item) =>
      item.value === denomValue
        ? { ...item, count: Math.max(0, newCount) }
        : item,
    );
    onChange(updated);
  };

  const totalSum = denominations.reduce(
    (sum, item) => sum + item.value * item.count,
    0,
  );

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {denominations.map((item) => (
          <div
            key={item.value}
            className="flex flex-col p-2.5 bg-(--bg-subtle) border border-(--border-color) rounded-lg transition-colors"
          >
            <span className="text-xs font-bold text-(--text-main)">
              فئة {item.value} ريال
            </span>
            <div className="flex items-center gap-2 mt-2">
              <input
                type="number"
                min="0"
                value={item.count || ""}
                onChange={(e) =>
                  handleCountChange(item.value, parseInt(e.target.value) || 0)
                }
                className="w-full px-2 py-1 text-sm border border-(--border-color) rounded bg-(--bg-card) text-(--text-main) text-center focus:outline-none focus:ring-1 focus:ring-(--color-primary)"
              />
            </div>
            <span className="text-[10px] text-(--text-muted) mt-1 text-left">
              الإجمالي: {formatCurrency(item.value * item.count)}
            </span>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center p-3 bg-emerald-50 border border-emerald-200 dark:bg-emerald-950/40 dark:border-emerald-800 rounded-lg">
        <span className="text-sm font-bold text-emerald-900 dark:text-emerald-200">
          المجموع الكلي للفئات:
        </span>
        <span className="text-base font-black text-emerald-600 dark:text-emerald-400">
          {formatCurrency(totalSum)}
        </span>
      </div>
    </div>
  );
};
