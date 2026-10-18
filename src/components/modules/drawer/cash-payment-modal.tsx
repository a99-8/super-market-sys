"use client";

import { useState, useMemo } from "react";
import { Modal } from "@/components/ui/modal";
import {
  CashDenomination,
  CashDenominationValue,
  CashPaymentModalProps,
} from "@/types";
import {
  calculateChange,
  validateDrawerExchange,
} from "@/utils/changeCalculator";

const AVAILABLE_DENOMINATIONS: CashDenominationValue[] = [
  200, 100, 50, 20, 10, 5, 1, 0.5,
];

export function CashPaymentModal({
  isOpen,
  onClose,
  invoiceTotal = 0,
  drawerDenominations = [],
  onPaymentSuccess,
  onDepositNewCash,
  onChangePaymentMethod,
}: CashPaymentModalProps) {
  const [givenCash, setGivenCash] = useState<CashDenomination[]>(
    AVAILABLE_DENOMINATIONS.map((v) => ({ value: v, count: 0 })),
  );

  const [showExchangeMode, setShowExchangeMode] = useState(false);
  const [takenExchange, setTakenExchange] = useState<CashDenomination[]>(
    AVAILABLE_DENOMINATIONS.map((v) => ({ value: v, count: 0 })),
  );
  const [addedExchange, setAddedExchange] = useState<CashDenomination[]>(
    AVAILABLE_DENOMINATIONS.map((v) => ({ value: v, count: 0 })),
  );

  const totalGivenAmount = useMemo(
    () => givenCash.reduce((sum, item) => sum + item.value * item.count, 0),
    [givenCash],
  );

  const changeDue = Math.max(0, totalGivenAmount - invoiceTotal);

  const changeResult = useMemo(
    () => calculateChange(changeDue, drawerDenominations),
    [changeDue, drawerDenominations],
  );

  const handleGivenCountChange = (
    value: CashDenominationValue,
    count: number,
  ) => {
    setGivenCash((prev) =>
      prev.map((item) =>
        item.value === value ? { ...item, count: Math.max(0, count) } : item,
      ),
    );
  };

  const handleConfirmPayment = () => {
    if (totalGivenAmount < invoiceTotal) return;

    if (changeResult.success) {
      onPaymentSuccess?.(givenCash, changeResult.returnedDenominations);
      onClose();
    }
  };

  const handleConfirmExchange = () => {
    const exchangeResult = validateDrawerExchange(takenExchange, addedExchange);
    if (exchangeResult.isValid) {
      setShowExchangeMode(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="عملية الدفع نقداً">
      {!showExchangeMode ? (
        <div className="space-y-4 text-right">
          <div className="bg-gray-100 p-3 rounded-lg flex justify-between items-center font-bold">
            <span>مبلغ الفاتورة:</span>
            <span className="text-blue-600">{invoiceTotal} ريال</span>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              الفئات المالية المقبوضة من الزبون:
            </label>
            <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto p-1">
              {givenCash.map((item) => (
                <div
                  key={item.value}
                  className="flex items-center justify-between border p-2 rounded"
                >
                  <span className="text-sm font-semibold">
                    {item.value} ريال
                  </span>
                  <input
                    type="number"
                    min="0"
                    value={item.count || ""}
                    onChange={(e) =>
                      handleGivenCountChange(
                        item.value,
                        parseInt(e.target.value) || 0,
                      )
                    }
                    className="w-16 border rounded text-center p-1"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="border-t pt-3 space-y-1">
            <div className="flex justify-between text-sm">
              <span>المبلغ المقبوض:</span>
              <span className="font-bold">{totalGivenAmount} ريال</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>الفكة المستحقة:</span>
              <span className="font-bold text-green-600">{changeDue} ريال</span>
            </div>
          </div>

          {totalGivenAmount >= invoiceTotal && !changeResult.success && (
            <div className="bg-red-50 border-r-4 border-red-500 p-3 rounded text-sm text-red-700 space-y-2">
              {changeResult.reason === "INSUFFICIENT_TOTAL_CASH" && (
                <>
                  <p className="font-bold">
                    رصيد الدرج الإجمالي غير كافٍ لإرجاع الفكة!
                  </p>
                  <p>
                    المبلغ الناقص بالدرج: {changeResult.remainingShortage} ريال.
                  </p>
                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() =>
                        onDepositNewCash?.(changeResult.remainingShortage)
                      }
                      className="bg-red-600 text-white text-xs px-3 py-1.5 rounded"
                    >
                      إيداع مبلغ جديد بالدرج
                    </button>
                  </div>
                </>
              )}

              {changeResult.reason === "UNAVAILABLE_DENOMINATIONS" && (
                <>
                  <p className="font-bold">
                    المبلغ بالدرج كافٍ، ولكن لا تتوفر الفئات المالية المناسبة
                    لإرجاع المتبقي بدقة!
                  </p>
                  <p>تعذر إرجاع: {changeResult.remainingShortage} ريال.</p>
                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => setShowExchangeMode(true)}
                      className="bg-amber-600 text-white text-xs px-3 py-1.5 rounded"
                    >
                      طلب صرف (تبديل فئات بالدرج)
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

          <div className="flex flex-col gap-2 pt-4">
            <button
              disabled={
                totalGivenAmount < invoiceTotal || !changeResult.success
              }
              onClick={handleConfirmPayment}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white font-bold py-2 rounded"
            >
              تأكيد الدفع وطباعة الفاتورة
            </button>

            <div className="flex justify-between text-xs pt-2">
              <button
                onClick={onChangePaymentMethod}
                className="text-blue-600 underline"
              >
                تغيير طريقة الدفع (شبكة / دَين)
              </button>
              <button onClick={onClose} className="text-red-600 underline">
                إلغاء الدفع النقدي
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4 text-right">
          <p className="text-sm text-gray-600">
            قم بتحديد الفئات المالية التي أخذتها من الدرج، والفئات الجديدة التي
            أدخلتها بدلاً عنها ليصبح مجموع القيمة متطابقاً:
          </p>

          <div className="grid grid-cols-2 gap-4">
            <div className="border p-2 rounded">
              <h4 className="text-xs font-bold text-red-600 mb-2">
                أوراق أُخذت من الدرج:
              </h4>
              {takenExchange.map((item) => (
                <div
                  key={item.value}
                  className="flex justify-between items-center text-xs mb-1"
                >
                  <span>{item.value} ريال</span>
                  <input
                    type="number"
                    min="0"
                    value={item.count || ""}
                    onChange={(e) =>
                      setTakenExchange((prev) =>
                        prev.map((i) =>
                          i.value === item.value
                            ? { ...i, count: parseInt(e.target.value) || 0 }
                            : i,
                        ),
                      )
                    }
                    className="w-12 border text-center"
                  />
                </div>
              ))}
            </div>

            <div className="border p-2 rounded">
              <h4 className="text-xs font-bold text-green-600 mb-2">
                أوراق جديدة أُدخلت للدرج:
              </h4>
              {addedExchange.map((item) => (
                <div
                  key={item.value}
                  className="flex justify-between items-center text-xs mb-1"
                >
                  <span>{item.value} ريال</span>
                  <input
                    type="number"
                    min="0"
                    value={item.count || ""}
                    onChange={(e) =>
                      setAddedExchange((prev) =>
                        prev.map((i) =>
                          i.value === item.value
                            ? { ...i, count: parseInt(e.target.value) || 0 }
                            : i,
                        ),
                      )
                    }
                    className="w-12 border text-center"
                  />
                </div>
              ))}
            </div>
          </div>

          {(() => {
            const check = validateDrawerExchange(takenExchange, addedExchange);
            return (
              <div className="text-xs space-y-1 bg-gray-50 p-2 rounded border">
                <div className="flex justify-between">
                  <span>إجمالي المأخوذ: {check.takenTotal} ريال</span>
                  <span>إجمالي المضاف: {check.addedTotal} ريال</span>
                </div>
                {!check.isValid && check.takenTotal > 0 && (
                  <p className="text-red-600 font-bold">
                    الفارق: {check.difference} ريال (يجب أن يكون القيمة المأخوذة
                    مساوية للمضافة تماماً)
                  </p>
                )}
              </div>
            );
          })()}

          <div className="flex gap-2">
            <button
              onClick={handleConfirmExchange}
              disabled={
                !validateDrawerExchange(takenExchange, addedExchange).isValid
              }
              className="flex-1 bg-blue-600 disabled:bg-gray-300 text-white py-2 rounded text-sm font-bold"
            >
              تأكيد الصرف
            </button>
            <button
              onClick={() => setShowExchangeMode(false)}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded text-sm"
            >
              إلغاء
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
}
