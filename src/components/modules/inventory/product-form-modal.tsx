import React, { useState, useEffect } from "react";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ProductFormModalProps } from "@/types";

export const ProductFormModal: React.FC<ProductFormModalProps> = ({
  isOpen,
  onClose,
  productToEdit,
  onSave,
}) => {
  const [formData, setFormData] = useState({
    barcode: "",
    name: "",
    costPrice: "",
    sellingPrice: "",
    discountPrice: "",
    discountQuantity: "",
    stockQuantity: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (productToEdit) {
      setFormData({
        barcode: productToEdit.barcode,
        name: productToEdit.name,
        costPrice: productToEdit.costPrice.toString(),
        sellingPrice: productToEdit.sellingPrice?.toString() || "",
        discountPrice: productToEdit.discountPrice?.toString() || "",
        discountQuantity: productToEdit.discountQuantity?.toString() || "",
        stockQuantity: productToEdit.stockQuantity.toString(),
      });
    } else {
      setFormData({
        barcode: "",
        name: "",
        costPrice: "",
        sellingPrice: "",
        discountPrice: "",
        discountQuantity: "",
        stockQuantity: "",
      });
    }
    setError("");
  }, [productToEdit, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (
      !formData.barcode ||
      !formData.name ||
      !formData.sellingPrice ||
      !formData.stockQuantity
    ) {
      setError("يرجى ملء جميع الحقول الأساسية المطلوبة");
      return;
    }

    try {
      setLoading(true);
      const payload = {
        ...(productToEdit ? { id: productToEdit.id } : {}),
        barcode: formData.barcode,
        name: formData.name,
        costPrice: Number(formData.costPrice) || 0,
        sellingPrice: Number(formData.sellingPrice),
        discountPrice: formData.discountPrice
          ? Number(formData.discountPrice)
          : undefined,
        discountQuantity: formData.discountQuantity
          ? Number(formData.discountQuantity)
          : undefined,
        stockQuantity: Number(formData.stockQuantity),
      };

      await onSave(payload as any);
      onClose();
    } catch (err: any) {
      setError(err.message || "حدث خطأ أثناء حفظ بيانات المنتج");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={productToEdit ? "تعديل بيانات المنتج" : "إضافة منتج جديد للمستودع"}
    >
      <form onSubmit={handleSubmit} className="space-y-3 text-(--text-main)">
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="رقم الباركود *"
            value={formData.barcode}
            onChange={(e) =>
              setFormData({ ...formData, barcode: e.target.value })
            }
            placeholder="6281..."
            required
          />
          <Input
            label="اسم المنتج *"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="اسم المنتج"
            required
          />
        </div>

        <div className="grid grid-cols-3 gap-3">
          <Input
            type="number"
            step="0.01"
            label="سعر التكلفة"
            value={formData.costPrice}
            onChange={(e) =>
              setFormData({ ...formData, costPrice: e.target.value })
            }
            placeholder="0.00"
          />
          <Input
            type="number"
            step="0.01"
            label="سعر البيع *"
            value={formData.sellingPrice}
            onChange={(e) =>
              setFormData({ ...formData, sellingPrice: e.target.value })
            }
            placeholder="0.00"
            required
          />
          <Input
            type="number"
            label="الكمية المتوفرة *"
            value={formData.stockQuantity}
            onChange={(e) =>
              setFormData({ ...formData, stockQuantity: e.target.value })
            }
            placeholder="0"
            required
          />
        </div>

        <div className="p-3 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200 dark:border-amber-800 space-y-2">
          <h4 className="text-xs font-bold text-amber-900 dark:text-amber-200">
            إعدادات نظام التخفيض الذكي
          </h4>
          <div className="grid grid-cols-2 gap-3">
            <Input
              type="number"
              step="0.01"
              label="سعر التخفيض"
              value={formData.discountPrice}
              onChange={(e) =>
                setFormData({ ...formData, discountPrice: e.target.value })
              }
              placeholder="0.00"
            />
            <Input
              type="number"
              label="كمية التخفيض المتاحة"
              value={formData.discountQuantity}
              onChange={(e) =>
                setFormData({ ...formData, discountQuantity: e.target.value })
              }
              placeholder="0"
            />
          </div>
        </div>

        {error && (
          <p className="text-xs text-(--color-danger) font-medium">{error}</p>
        )}

        <div className="flex justify-end gap-2 pt-2">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            disabled={loading}
          >
            إلغاء
          </Button>
          <Button type="submit" variant="primary" disabled={loading}>
            {loading ? "جاري الحفظ..." : "حفظ المنتج"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
