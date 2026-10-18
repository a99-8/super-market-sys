import { useState, useEffect } from "react";
import { drawerService } from "@/services/drawerService";
import { useAuthStore } from "@/store/useAuthStore";
import { useDrawerStore } from "@/store/useDrawerStore";
import { CashDenomination, DenominationCount } from "@/types";
import { AlertState } from "@/components/ui/alert-modal";
import { convertArabicToEnglishNumbers } from "@/utils/currencyFormatter";
import { DEFAULT_DENOMINATIONS } from "@/constant";

export function useDrawer() {
  const { user } = useAuthStore();
  const { currentSession, setCurrentSession } = useDrawerStore();

  const [denominations, setDenominations] = useState<DenominationCount[]>(
    DEFAULT_DENOMINATIONS,
  );
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawReason, setWithdrawReason] = useState("");
  const [isExchangeModalOpen, setIsExchangeModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [alertState, setAlertState] = useState<AlertState>({
    isOpen: false,
    title: "",
    message: "",
    type: "info",
  });

  const showAlert = (
    title: string,
    message: string,
    type: "success" | "error" | "info" = "info",
  ) => {
    setAlertState({ isOpen: true, title, message, type });
  };

  const closeAlert = () => {
    setAlertState((prev) => ({ ...prev, isOpen: false }));
  };

  const loadActiveSession = async () => {
    const session = await drawerService.getActiveSession();
    setCurrentSession(session || null);
    if (session) {
      setDenominations(session.denominations);
    } else {
      setDenominations(DEFAULT_DENOMINATIONS);
    }
  };

  useEffect(() => {
    loadActiveSession();
  }, []);

  const handleOpenSession = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const initialBalance = denominations.reduce(
        (sum, item) => sum + item.value * item.count,
        0,
      );
      await drawerService.openSession(user.id!, denominations, initialBalance);
      await loadActiveSession();
      showAlert("نجاح", "تم فتح وملء الدرج بنجاح", "success");
    } catch (err: any) {
      showAlert("خطأ", err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSession = async () => {
    if (!currentSession) return;
    try {
      setLoading(true);
      await drawerService.closeSession(currentSession.id!, denominations);
      await loadActiveSession();
      showAlert("نجاح", "تمت تصفية وإغلاق الدرج بنجاح", "success");
    } catch (err: any) {
      showAlert("خطأ", err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentSession || !withdrawAmount || !withdrawReason) return;
    try {
      setLoading(true);
      const parsedAmount = parseFloat(
        convertArabicToEnglishNumbers(withdrawAmount),
      );
      await drawerService.addTransaction(
        currentSession.id!,
        "WITHDRAW",
        parsedAmount,
        withdrawReason,
        denominations,
      );
      setWithdrawAmount("");
      setWithdrawReason("");
      await loadActiveSession();
      showAlert("نجاح", "تمت إضافة عملية الصرف بنجاح", "success");
    } catch (err: any) {
      showAlert("خطأ", err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleExchangeConfirm = async (
    updatedDenominations: CashDenomination[],
    detailsNote: string,
  ) => {
    if (!currentSession) return;
    await drawerService.exchangeDenominations(
      currentSession.id!,
      updatedDenominations,
      detailsNote,
    );
    await loadActiveSession();
    showAlert("نجاح", "تم تبديل الفئات وتحديث الدرج بنجاح", "success");
  };

  return {
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
  };
}
