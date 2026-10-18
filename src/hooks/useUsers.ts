import { useState, useEffect } from "react";
import { UserService } from "@/services/userService";
import { User, UserRole } from "@/types";
import { AlertState } from "@/components/ui/alert-modal";
import { convertArabicToEnglishNumbers } from "@/utils/currencyFormatter";

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("CASHIER");
  const [creditLimit, setCreditLimit] = useState("0");

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
    const list = await UserService.getAllUsers();
    setUsers(list);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      await UserService.createUser({
        username,
        password,
        phone: convertArabicToEnglishNumbers(phone),
        role,
        creditLimit:
          parseFloat(convertArabicToEnglishNumbers(creditLimit)) || 0,
      });
      setIsModalOpen(false);
      setUsername("");
      setPhone("");
      setPassword("");
      setCreditLimit("0");
      await loadUsers();
      showAlert("نجاح", "تمت إضافة المستخدم بنجاح", "success");
    } catch (err: any) {
      showAlert("خطأ", err.message || "حدث خطأ أثناء إضافة المستخدم", "error");
    } finally {
      setLoading(false);
    }
  };

  return {
    users,
    isModalOpen,
    setIsModalOpen,
    loading,
    form: {
      username,
      setUsername,
      phone,
      setPhone,
      password,
      setPassword,
      role,
      setRole,
      creditLimit,
      setCreditLimit,
    },
    alertState,
    closeAlert,
    handleCreateUser,
  };
}
