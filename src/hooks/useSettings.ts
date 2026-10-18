import { useState, useEffect } from "react";
import { UserService } from "@/services/userService";
import { User, UserRole } from "@/types";
import { AlertState } from "@/components/ui/alert-modal";

export function useSettings() {
  const [users, setUsers] = useState<User[]>([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState<UserRole>("CASHIER");
  const [creditBalance, setCreditBalance] = useState("0");

  const [rechargeModalOpen, setRechargeModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [rechargeAmount, setRechargeAmount] = useState("");

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

  const loadUsers = async () => {
    const data = await UserService.getAllUsers();
    setUsers(data);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password || !phone) return;

    try {
      await UserService.createUser({
        username,
        password,
        phone,
        role,
        creditBalance: Number(creditBalance) || 0,
      });

      setUsername("");
      setPassword("");
      setPhone("");
      setCreditBalance("0");
      await loadUsers();
      showAlert("نجاح", "تم إضافة المستخدم بنجاح", "success");
    } catch (err: any) {
      showAlert("خطأ", err.message || "حدث خطأ أثناء إضافة المستخدم", "error");
    }
  };

  const openRechargeModal = (userId: string) => {
    setSelectedUserId(userId);
    setRechargeAmount("");
    setRechargeModalOpen(true);
  };

  const handleConfirmRecharge = async () => {
    if (!selectedUserId) return;
    const amount = Number(rechargeAmount);
    if (!isNaN(amount) && amount > 0) {
      const user = users.find((u) => u.id === selectedUserId);
      if (user) {
        await UserService.updateCreditBalance(
          selectedUserId,
          user.creditBalance + amount,
        );
        await loadUsers();
        setRechargeModalOpen(false);
        showAlert("تمت العملية", "تم إعادة شحن الرصيد بنجاح", "success");
      }
    } else {
      showAlert("تنبيه", "يرجى إدخال مبلغ صحيح أكبر من الصفر", "info");
    }
  };

  return {
    users,
    form: {
      username,
      setUsername,
      password,
      setPassword,
      phone,
      setPhone,
      role,
      setRole,
      creditBalance,
      setCreditBalance,
    },
    rechargeModal: {
      isOpen: rechargeModalOpen,
      setIsOpen: setRechargeModalOpen,
      amount: rechargeAmount,
      setAmount: setRechargeAmount,
      openModal: openRechargeModal,
      confirmRecharge: handleConfirmRecharge,
    },
    alertState,
    closeAlert,
    handleCreateUser,
  };
}
