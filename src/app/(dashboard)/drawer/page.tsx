"use client";

import { RoleGuard } from "@/components/layout/role-guard";
import { Button } from "@/components/ui/button";
import { DenominationInput } from "@/components/modules/drawer/denomination-input";
import { CurrencyExchangeModal } from "@/components/modules/drawer/currency-exchange-modal";
import { AlertDialogModal } from "@/components/ui/alert-modal";
import {
  formatCurrency,
  convertArabicToEnglishNumbers,
} from "@/utils/currencyFormatter";
import { useDrawer } from "@/hooks/useDrawer";
import { CheckCircle2, RefreshCcw, XCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function DrawerPage() {
  const {
    currentSession,
    denominations,
    setDenominations,
    withdrawAmount,
    setWithdrawAmount,
    withdrawReason,
    setWithdrawReason,
    isExchangeModalOpen,
    setIsExchangeModalOpen,
    loading,
    alertState,
    showAlert,
    closeAlert,
    handleOpenSession,
    handleCloseSession,
    handleWithdraw,
    handleExchangeConfirm,
  } = useDrawer();
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === "ar";

  return (
    <RoleGuard allowedRoles={["ADMIN", "CASHIER"]}>
      <div className="max-w-4xl mx-auto space-y-6" dir={isRtl ? "rtl" : "ltr"}>
        <div className="flex justify-between items-center bg-(--bg-card) p-4 rounded-xl border border-(--border-color) shadow-sm">
          <div>
            <h2 className="text-lg font-bold text-(--text-main)">
              {t("DrawerPage.title")}
            </h2>
            <p className="flex items-center gap-1.5 text-xs text-(--text-muted)">
              <span>
                {t("DrawerPage.sessionStatus")}
                {currentSession
                  ? t("DrawerPage.statusOpen")
                  : t("DrawerPage.statusClosed")}
              </span>
              {currentSession ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-green-500 inline-block" />
              ) : (
                <XCircle className="w-3.5 h-3.5 text-red-500 inline-block" />
              )}
            </p>
          </div>
          {currentSession && (
            <div className="flex items-center gap-4 text-left">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsExchangeModalOpen(true)}
              >
                <RefreshCcw />
                {t("DrawerPage.exchangeCurrency")}
              </Button>
              <div>
                <span className="text-xs text-(--text-muted)">
                  {t("DrawerPage.currentBalance")}
                </span>
                <p className="text-xl font-black text-(--color-primary)">
                  {formatCurrency(currentSession.totalAmount)}
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-(--bg-card) p-4 rounded-xl border border-(--border-color) shadow-sm space-y-4">
            <h3 className="font-bold text-(--text-main) text-sm">
              {t("DrawerPage.distributionTitle")}
            </h3>
            <DenominationInput
              denominations={denominations}
              onChange={setDenominations}
            />

            <div className="flex gap-3 pt-2">
              {!currentSession ? (
                <Button
                  variant="primary"
                  fullWidth
                  onClick={handleOpenSession}
                  disabled={loading}
                >
                  {t("DrawerPage.confirmAndOpen")}
                </Button>
              ) : (
                <Button
                  variant="danger"
                  fullWidth
                  onClick={handleCloseSession}
                  disabled={loading}
                >
                  {t("DrawerPage.clearAndClose")}
                </Button>
              )}
            </div>
          </div>

          <div className="bg-(--bg-card) p-4 rounded-xl border border-(--border-color) shadow-sm space-y-4 h-fit">
            <h3 className="font-bold text-(--text-main) text-sm">
              {t("DrawerPage.withdrawTitle")}
            </h3>
            <form onSubmit={handleWithdraw} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-(--text-main)">
                  {t("DrawerPage.withdrawAmount")}
                </label>
                <input
                  type="text"
                  disabled={!currentSession}
                  value={withdrawAmount}
                  onChange={(e) =>
                    setWithdrawAmount(
                      convertArabicToEnglishNumbers(e.target.value),
                    )
                  }
                  className="w-full mt-1 px-3 py-2 border rounded-lg text-sm bg-(--bg-subtle) text-(--text-main) border-(--border-color) focus:outline-none focus:ring-2 focus:ring-(--color-primary) disabled:opacity-50"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-(--text-main)">
                  {t("DrawerPage.withdrawReason")}
                </label>
                <input
                  type="text"
                  disabled={!currentSession}
                  value={withdrawReason}
                  onChange={(e) => setWithdrawReason(e.target.value)}
                  className="w-full mt-1 px-3 py-2 border rounded-lg text-sm bg-(--bg-subtle) text-(--text-main) border-(--border-color) focus:outline-none focus:ring-2 focus:ring-(--color-primary) disabled:opacity-50"
                  required
                />
              </div>

              <Button
                type="submit"
                variant="secondary"
                fullWidth
                disabled={!currentSession || loading}
              >
                {t("DrawerPage.recordWithdraw")}{" "}
              </Button>
            </form>
          </div>
        </div>

        <CurrencyExchangeModal
          isOpen={isExchangeModalOpen}
          onClose={() => setIsExchangeModalOpen(false)}
          currentDenominations={denominations}
          onConfirmExchange={handleExchangeConfirm}
          showAlert={showAlert}
        />

        <AlertDialogModal state={alertState} onClose={closeAlert} />
      </div>
    </RoleGuard>
  );
}
