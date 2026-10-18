import React from "react";
import { formatCurrency } from "@/utils/currencyFormatter";
import { PrintTemplateProps } from "@/types";

export const PrintTemplate: React.FC<PrintTemplateProps> = ({
  title,
  subtitle,
  dataHeaders,
  dataRows,
  summaryItems,
}) => {
  return (
    <div className="p-6 bg-(--bg-card) text-(--text-main) font-sans print:p-0 print:bg-white print:text-slate-900">
      <div className="text-center border-b border-(--border-color) print:border-slate-300 pb-4 mb-4">
        <h2 className="text-xl font-bold">{title}</h2>
        {subtitle && (
          <p className="text-xs text-(--text-muted) print:text-slate-500 mt-1">
            {subtitle}
          </p>
        )}
        <p className="text-[10px] text-(--text-muted) print:text-slate-400 mt-1">
          تاريخ الطباعة: {new Date().toLocaleString("ar-SA")}
        </p>
      </div>

      <table className="w-full text-right border-collapse text-xs mb-4">
        <thead>
          <tr className="border-b border-(--border-color) print:border-slate-300 bg-(--bg-subtle) print:bg-slate-100">
            {dataHeaders.map((header, idx) => (
              <th
                key={idx}
                className="p-2 font-bold text-(--text-main) print:text-slate-700"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-(--border-color) print:divide-slate-200">
          {dataRows.map((row, rIdx) => (
            <tr key={rIdx}>
              {row.map((cell, cIdx) => (
                <td key={cIdx} className="p-2">
                  {typeof cell === "number" ? formatCurrency(cell) : cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {summaryItems && summaryItems.length > 0 && (
        <div className="border-t border-(--border-color) print:border-slate-300 pt-3 space-y-1 text-xs">
          {summaryItems.map((item, idx) => (
            <div key={idx} className="flex justify-between font-semibold">
              <span className="text-(--text-muted) print:text-slate-600">
                {item.label}:
              </span>
              <span>
                {typeof item.value === "number"
                  ? formatCurrency(item.value)
                  : item.value}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
