"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { useLogin } from "@/hooks/useLogin";
import { useTranslation } from "react-i18next";
import { ShoppingCart } from "lucide-react";

export default function LoginPage() {
  const {
    username,
    setUsername,
    password,
    setPassword,
    error,
    loading,
    handleSubmit,
  } = useLogin();
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === "ar";

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-(--bg-app) p-4 transition-colors duration-200 relative"
      dir={isRtl ? "rtl" : "ltr"}
    >
      <div className="absolute top-4 left-4">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md bg-(--bg-card) border border-(--border-color) rounded-2xl shadow-xl p-8 space-y-6">
        <div className="text-center space-y-2">
          <ShoppingCart />

          <h1 className="text-2xl font-bold text-(--text-main)">
            {t("LoginPage.title")}
          </h1>
          <p className="text-xs text-(--text-muted)">
            {t("LoginPage.subtitle")}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label={t("public.username")}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder={t("LoginPage.usernamePlaceholder")}
            required
          />

          <Input
            type="password"
            label={t("public.username")}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={t("LoginPage.passwordPlaceholder")}
            required
          />

          {error && (
            <p className="text-xs text-(--color-danger) font-medium text-center">
              {error}
            </p>
          )}

          <Button type="submit" variant="primary" fullWidth disabled={loading}>
            {loading ? t("LoginPage.verifying") : t("LoginPage.login")}
          </Button>
        </form>

        <div className="bg-(--bg-subtle) p-3 rounded-lg border border-(--border-color) text-xs text-(--text-muted) space-y-1">
          <p className="font-bold text-(--text-main)">
            {t("LoginPage.demoAccounts")}
          </p>
          <p>• مدير النظام: admin / 123456</p>
          <p>• محاسب: cashier / 123456</p>
        </div>
      </div>
    </div>
  );
}
