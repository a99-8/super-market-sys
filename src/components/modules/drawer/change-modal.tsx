import React from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { ChangeModalProps } from "@/types";
import { formatCurrency } from "@/utils/currencyFormatter";

export const ChangeModal: React.FC<ChangeModalProps> = ({
  isOpen,
  onClose,
  paidAmount,
  totalAmount,
  changeDue,
  changeBreakdown,
  onConfirm,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="حساب المتبقي وإرجاع الفكة">
      <div className="space-y-4 text-(--text-main)">
        <div className="grid grid-cols-3 gap-2 bg-(--bg-subtle) p-3 rounded-lg text-center border border-(--border-color)">
          <div>
            <p className="text-[11px] text-(--text-muted)">الإجمالي</p>
            <p className="text-sm font-bold text-(--text-main)">
              {formatCurrency(totalAmount)}
            </p>
          </div>
          <div>
            <p className="text-[11px] text-(--text-muted)">المستلم</p>
            <p className="text-sm font-bold text-(--color-primary)">
              {formatCurrency(paidAmount)}
            </p>
          </div>
          <div>
            <p className="text-[11px] text-(--text-muted)">المتبقي (الفكة)</p>
            <p className="text-sm font-bold text-(--color-danger)">
              {formatCurrency(changeDue)}
            </p>
          </div>
        </div>

        {changeDue > 0 && (
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-(--text-main)">
              الفئات الواجب تسليمها للعميل:
            </h4>
            <div className="divide-y divide-(--border-color) border border-(--border-color) rounded-lg bg-(--bg-card) overflow-hidden">
              {changeBreakdown.length > 0 ? (
                changeBreakdown.map((item) => (
                  <div
                    key={item.value}
                    className="flex justify-between items-center p-2.5 text-xs"
                  >
                    <span className="font-semibold text-(--text-main)">
                      فئة {item.value} ريال
                    </span>
                    <span className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 px-2 py-0.5 rounded-full font-bold">
                      عدد {item.count}
                    </span>
                  </div>
                ))
              ) : (
                <p className="p-3 text-xs text-(--color-danger) text-center">
                  تحذير: لا توجد فئات نقدية متوفرة بالدرج لتغطية الفكة بالكامل!
                </p>
              )}
            </div>
          </div>
        )}

        <div className="flex justify-end gap-2 pt-2">
          <Button variant="primary" fullWidth onClick={onConfirm}>
            تم التسليم وإتمام الفاتورة
          </Button>
        </div>
      </div>
    </Modal>
  );
};
