"use client";

import { RoleGuard } from "@/components/layout/role-guard";
import { Button } from "@/components/ui/button";
import { ProductFormModal } from "@/components/modules/inventory/product-form-modal";
import { JsonImportExport } from "@/components/modules/inventory/json-import-export";
import { formatCurrency } from "@/utils/currencyFormatter";
import { useInventory } from "@/hooks/useInventory";
import { useTranslation } from "react-i18next";

export default function InventoryPage() {
  const {
    products,
    isModalOpen,
    setIsModalOpen,
    selectedProduct,
    loadProducts,
    handleSaveProduct,
    handleDeleteProduct,
    openCreateModal,
    openEditModal,
  } = useInventory();
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === "ar";

  return (
    <RoleGuard allowedRoles={["ADMIN", "STORE_KEEPER"]}>
      <div className="space-y-4" dir={isRtl ? "rtl" : "ltr"}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-(--bg-card) p-4 rounded-xl border border-(--border-color) shadow-sm">
          <div>
            <h2 className="text-lg font-bold text-(--text-main)">
              {t("InventoryPage.title")}
            </h2>
            <p className="text-xs text-(--text-muted)">
              {t("InventoryPage.totalProducts")} {products.length}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <JsonImportExport onDataRefresh={loadProducts} />
            <Button variant="primary" size="sm" onClick={openCreateModal}>
              {t("InventoryPage.addProduct")}
            </Button>
          </div>
        </div>

        <div className="bg-(--bg-card) border border-(--border-color) rounded-xl overflow-hidden shadow-sm">
          <table className="w-full text-right text-xs">
            <thead className="bg-(--bg-subtle) border-b border-(--border-color) font-bold text-(--text-main)">
              <tr>
                <th className="p-3">{t("InventoryPage.table.barcode")}</th>
                <th className="p-3">{t("InventoryPage.table.productName")}</th>
                <th className="p-3">{t("InventoryPage.table.cost")}</th>
                <th className="p-3">{t("InventoryPage.table.sellingPrice")}</th>
                <th className="p-3">
                  {t("InventoryPage.table.smartDiscount")}
                </th>
                <th className="p-3">
                  {t("InventoryPage.table.availableStock")}
                </th>
                <th className="p-3 text-center">
                  {t("InventoryPage.table.actions")}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-(--border-color) text-(--text-main)">
              {products.map((p) => (
                <tr
                  key={p.id}
                  className="hover:bg-(--bg-subtle) transition-colors"
                >
                  <td className="p-3 font-mono">{p.barcode}</td>
                  <td className="p-3 font-semibold text-(--text-main)">
                    {p.name}
                  </td>
                  <td className="p-3">{formatCurrency(p.costPrice)}</td>
                  <td className="p-3 font-bold text-(--color-primary)">
                    {formatCurrency(p.sellingPrice)}
                  </td>
                  <td className="p-3">
                    {p.discountPrice ? (
                      <span className="text-amber-500 font-medium">
                        {formatCurrency(p.discountPrice)} (
                        {t("InventoryPage.table.remaining")}{" "}
                        {p.discountQuantity} {t("InventoryPage.table.pcs")})
                      </span>
                    ) : (
                      <span className="text-(--text-muted)">-</span>
                    )}
                  </td>
                  <td className="p-3 font-bold">{p.stockQuantity}</td>
                  <td className="p-3 text-center space-x-2 space-x-reverse">
                    <button
                      onClick={() => openEditModal(p)}
                      className="text-(--color-primary) hover:underline font-medium ml-2"
                    >
                      {t("InventoryPage.table.edit")}
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(p.id!)}
                      className="text-(--color-danger) hover:underline font-medium"
                    >
                      {t("InventoryPage.table.delete")}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <ProductFormModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          productToEdit={selectedProduct}
          onSave={handleSaveProduct}
        />
      </div>
    </RoleGuard>
  );
}
