"use client";

import { useAuthStore } from "@/store/useAuthStore";
import { formatCurrency } from "@/utils/currencyFormatter";
import { useTranslation } from "react-i18next";

export default function ProfilePage() {
  const { user } = useAuthStore();
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === "ar";

  if (!user) return null;

  return (
    <div
      className="max-w-xl mx-auto bg-(--bg-card) p-6 rounded-2xl border border-(--border-color) shadow-sm space-y-6 text-(--text-main)"
      dir={isRtl ? "rtl" : "ltr"}
    >
      <div className="flex items-center gap-4 pb-4 border-b border-(--border-color)">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 rounded-full flex items-center justify-center text-2xl font-bold">
          {user.username.slice(0, 2).toUpperCase()}
        </div>
        <div>
          <h2 className="text-xl font-bold text-(--text-main)">
            {user.username}
          </h2>
          <p className="text-xs text-(--text-muted)">
            {t("ProfilePage.userRole")} {user.role}
          </p>
        </div>
      </div>

      <div className="space-y-3 text-sm">
        <div className="flex justify-between py-2 border-b border-(--border-color)">
          <span className="text-(--text-muted)">{t("ProfilePage.phone")}</span>
          <span className="font-semibold text-(--text-main)">{user.phone}</span>
        </div>
        <div className="flex justify-between py-2 border-b border-(--border-color)">
          <span className="text-(--text-muted)">{t("ProfilePage.userId")}</span>
          <span className="font-mono text-xs text-(--text-muted)">
            {user.id}
          </span>
        </div>
        <div className="flex justify-between py-2 border-b border-(--border-color)">
          <span className="text-(--text-muted)">
            {t("ProfilePage.creditBalance")}
          </span>
          <span className="font-bold text-(--color-primary)">
            {formatCurrency(user.creditBalance)}
          </span>
        </div>
      </div>
    </div>
  );
}
