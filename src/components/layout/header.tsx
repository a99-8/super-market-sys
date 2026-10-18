"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/utils/currencyFormatter";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { DoorOpen } from "lucide-react";

export const Header: React.FC = () => {
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const getRoleLabel = (role?: string) => {
    switch (role) {
      case "ADMIN":
        return "مسؤول نظام";
      case "CASHIER":
        return "محاسب";
      case "STORE_KEEPER":
        return "مسؤول مخزن";
      case "REPORTS_SUPERVISOR":
        return "مشرف تقارير";
      case "USERS_SUPERVISOR":
        return "مشرف مستخدمين";
      default:
        return "مستخدم";
    }
  };

  return (
    <header className="h-16 bg-(--bg-card) border-b border-(--border-color) px-6 flex items-center justify-between shadow-sm transition-colors duration-200">
      <div className="flex items-center gap-3">
        <span className="text-(--text-muted) text-sm">مرحباً بك،</span>
        <span className="font-bold text-(--text-main) text-sm">
          {user?.username}
        </span>
        <span className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-[11px] px-2 py-0.5 rounded-full font-medium">
          {getRoleLabel(user?.role)}
        </span>
      </div>

      <div className="flex items-center gap-4">
        {user?.creditLimit !== undefined && user.creditLimit > 0 && (
          <div className="text-xs font-medium text-(--text-muted) bg-(--bg-subtle) px-3 py-1.5 rounded-lg">
            رصيد الدين المتاح:{" "}
            <span className="font-bold text-(--color-primary)">
              {formatCurrency(user.creditLimit)}
            </span>
          </div>
        )}

        <ThemeToggle />

        <Button variant="ghost" size="sm" onClick={handleLogout}>
          خروج <DoorOpen />
        </Button>
      </div>
    </header>
  );
};
