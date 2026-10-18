"use client";

import { RoleGuard } from "@/components/layout/role-guard";
import { InvoiceTabs } from "@/components/modules/invoices/invoice-tabs";
import { ProductGrid } from "@/components/modules/invoices/product-grid";
import { CartSummary } from "@/components/modules/invoices/cart-summary";
import { CreditPaymentModal } from "@/components/modules/invoices/credit-payment-modal";
import { CashPaymentModal } from "@/components/modules/drawer/cash-payment-modal";
import { useInvoices } from "@/hooks/useInvoices";
import { useTranslation } from "react-i18next";

export default function InvoicesPage() {
  const {
    products,
    users,
    cartItems,
    totalCartAmount,
    isCreditModalOpen,
    setIsCreditModalOpen,
    isCashModalOpen,
    setIsCashModalOpen,
    handleSelectProduct,
    handleCheckout,
    handleCompleteInvoice,
    updateItemQuantity,
    removeItemFromActiveTab,
    clearActiveTab,
  } = useInvoices();
  const { i18n } = useTranslation();
  const isRtl = i18n.language === "ar";

  return (
    <RoleGuard allowedRoles={["ADMIN", "CASHIER"]}>
      <div
        className="flex flex-col h-full gap-3 text-(--text-main)"
        dir={isRtl ? "rtl" : "ltr"}
      >
        <InvoiceTabs />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 flex-1">
          <div className="lg:col-span-2">
            <ProductGrid
              products={products}
              onSelectProduct={handleSelectProduct}
            />
          </div>
          <div>
            <CartSummary
              cart={cartItems as any}
              onUpdateQuantity={updateItemQuantity}
              onRemoveItem={removeItemFromActiveTab}
              onClearCart={clearActiveTab}
              onCheckout={handleCheckout}
            />
          </div>
        </div>

        <CreditPaymentModal
          isOpen={isCreditModalOpen}
          onClose={() => setIsCreditModalOpen(false)}
          totalAmount={totalCartAmount}
          users={users}
          onConfirm={async (customerId) => {
            await handleCompleteInvoice("CREDIT", customerId);
          }}
        />

        <CashPaymentModal
          isOpen={isCashModalOpen}
          onClose={() => setIsCashModalOpen(false)}
          invoiceTotal={totalCartAmount}
          onConfirm={async () => {
            await handleCompleteInvoice("CASH");
          }}
        />
      </div>
    </RoleGuard>
  );
}
