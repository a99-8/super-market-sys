import React, { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CreditPaymentModalProps } from "@/types";
import { verifyPassword } from "@/utils/passwordHasher";
import { formatCurrency } from "@/utils/currencyFormatter";

export const CreditPaymentModal: React.FC<CreditPaymentModalProps> = ({
  isOpen,
  onClose,
  totalAmount,
  users,
  onConfirm,
}) => {
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const selectedUser = users.find((u) => u.id === selectedUserId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!selectedUserId) {
      setError("يرجى اختيار العميل");
      return;
    }

    if (!selectedUser) {
      setError("المستخدم غير موجود");
      return;
    }

    if (selectedUser.creditBalance < totalAmount) {
      setError(
        `الرصيد المتاح (${formatCurrency(selectedUser.creditBalance)}) غير كافٍ لتغطية مبلغ الفاتورة`,
      );
      return;
    }

    if (!verifyPassword(password, selectedUser.passwordHash)) {
      setError("كلمة المرور غير صحيحة");
      return;
    }

    try {
      setLoading(true);
      await onConfirm(selectedUserId);
      onClose();
    } catch (err: any) {
      setError(err.message || "حدث خطأ أثناء معالجة عملية البيع بالآجل");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="تأكيد الدفع بالآجل (دَين)">
      <form onSubmit={handleSubmit} className="space-y-4 text-(--text-main)">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-(--text-main)">
            اختر العميل:
          </label>
          <select
            value={selectedUserId}
            onChange={(e) => {
              setSelectedUserId(e.target.value);
              setError("");
            }}
            className="w-full px-3 py-2 border rounded-lg text-sm bg-(--bg-card) text-(--text-main) border-(--border-color) focus:outline-none focus:ring-2 focus:ring-(--color-primary) transition-colors"
          >
            <option value="">-- اختر من القائمة --</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.username} ({u.phone}) - الرصيد:{" "}
                {formatCurrency(u.creditBalance)}
              </option>
            ))}
          </select>
        </div>

        {selectedUser && (
          <div className="bg-(--bg-subtle) p-3 rounded-lg border border-(--border-color) text-xs space-y-1">
            <div className="flex justify-between">
              <span className="text-(--text-muted)">المبلغ المطلوب:</span>
              <span className="font-bold text-(--color-danger)">
                {formatCurrency(totalAmount)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-(--text-muted)">الرصيد المتاح للعميل:</span>
              <span className="font-bold text-(--color-primary)">
                {formatCurrency(selectedUser.creditBalance)}
              </span>
            </div>
          </div>
        )}

        <Input
          type="password"
          label="كلمة مرور العميل لتأكيد الشراء:"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="أدخل كلمة المرور الخاصة بالعميل"
        />

        {error && (
          <p className="text-xs text-(--color-danger) font-medium">{error}</p>
        )}

        <div className="flex justify-end gap-2 pt-3">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            disabled={loading}
          >
            إلغاء
          </Button>
          <Button type="submit" variant="primary" disabled={loading}>
            {loading ? "جاري الاعتماد..." : "تأكيد الخصم والشراء"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
