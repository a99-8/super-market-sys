"use client";

import { RoleGuard } from "@/components/layout/role-guard";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { AlertDialogModal } from "@/components/ui/alert-modal";
import { UserRole } from "@/types";
import {
  formatCurrency,
  convertArabicToEnglishNumbers,
} from "@/utils/currencyFormatter";
import { useUsers } from "@/hooks/useUsers";
import { UserRoundPlus } from "lucide-react";
import { ROLE_LABELS } from "@/constant";
import { useTranslation } from "react-i18next";

export default function UsersPage() {
  const {
    users,
    isModalOpen,
    setIsModalOpen,
    loading,
    form,
    alertState,
    closeAlert,
    handleCreateUser,
  } = useUsers();
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === "ar";

  return (
    <RoleGuard allowedRoles={["ADMIN", "USERS_SUPERVISOR", "USER_SUPERVISOR"]}>
      <div
        className="max-w-6xl mx-auto space-y-6 text-(--text-main)"
        dir={isRtl ? "rtl" : "ltr"}
      >
        <div className="flex justify-between items-center bg-(--bg-card) p-4 rounded-xl border border-(--border-color) shadow-sm">
          <div>
            <h2 className="text-lg font-bold text-(--text-main)">
              {t("UsersPage.title")}
            </h2>
            <p className="text-xs text-(--text-muted)">
              {t("UsersPage.subtitle")}
            </p>
          </div>
          <Button variant="primary" onClick={() => setIsModalOpen(true)}>
            <UserRoundPlus /> {t("UsersPage.addNewUser")}
          </Button>
        </div>

        <div className="bg-(--bg-card) rounded-xl border border-(--border-color) shadow-sm overflow-hidden">
          <table className="w-full text-right text-sm">
            <thead className="bg-(--bg-subtle) text-(--text-muted) border-b border-(--border-color) text-xs font-semibold">
              <tr>
                <th className="p-3">{t("UsersPage.table.name")}</th>
                <th className="p-3">{t("UsersPage.table.phone")}</th>
                <th className="p-3">{t("UsersPage.table.role")}</th>
                <th className="p-3">{t("UsersPage.table.creditLimit")}</th>
                <th className="p-3">{t("UsersPage.table.currentBalance")}</th>
                <th className="p-3">{t("UsersPage.table.createdAt")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-(--border-color)">
              {users.map((u) => (
                <tr
                  key={u.id}
                  className="hover:bg-(--bg-subtle) transition-colors"
                >
                  <td className="p-3 font-semibold text-(--text-main)">
                    {u.username}
                  </td>
                  <td className="p-3 text-(--text-muted) dir-ltr text-right">
                    {u.phone || "—"}
                  </td>
                  <td className="p-3">
                    <span className="bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 px-2.5 py-1 rounded-full text-xs font-bold">
                      {ROLE_LABELS[u.role] || u.role}
                    </span>
                  </td>
                  <td className="p-3 text-(--text-main) font-semibold">
                    {formatCurrency(u.creditLimit || 0)}
                  </td>
                  <td className="p-3 text-(--text-main)">
                    {formatCurrency(u.creditBalance || 0)}
                  </td>
                  <td className="p-3 text-xs text-(--text-muted)">
                    {new Date(u.createdAt).toLocaleDateString(
                      isRtl ? "ar-SA" : "en-US",
                    )}
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="p-6 text-center text-(--text-muted) text-xs"
                  >
                    {t("UsersPage.noUsersFound")}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={t("UsersPage.addNewUser")}
        >
          <form
            onSubmit={handleCreateUser}
            className="space-y-4 text-(--text-main)"
          >
            <div>
              <label className="text-xs font-semibold text-(--text-main)">
                {t("UsersPage.form.username")}:
              </label>
              <input
                type="text"
                value={form.username}
                onChange={(e) => form.setUsername(e.target.value)}
                className="w-full mt-1 px-3 py-2 border rounded-lg text-sm bg-(--bg-card) text-(--text-main) border-(--border-color) focus:outline-none focus:ring-2 focus:ring-(--color-primary) transition-colors"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-(--text-main)">
                {t("UsersPage.form.password")}:
              </label>
              <input
                type="password"
                value={form.password}
                onChange={(e) => form.setPassword(e.target.value)}
                className="w-full mt-1 px-3 py-2 border rounded-lg text-sm bg-(--bg-card) text-(--text-main) border-(--border-color) focus:outline-none focus:ring-2 focus:ring-(--color-primary) transition-colors"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-(--text-main)">
                {t("UsersPage.form.phoneWithContact")}
              </label>
              <input
                type="text"
                value={form.phone}
                onChange={(e) =>
                  form.setPhone(convertArabicToEnglishNumbers(e.target.value))
                }
                className="w-full mt-1 px-3 py-2 border rounded-lg text-sm bg-(--bg-card) text-(--text-main) border-(--border-color) focus:outline-none focus:ring-2 focus:ring-(--color-primary) transition-colors"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-(--text-main)">
                {t("UsersPage.form.roleLeader")}
              </label>
              <select
                value={form.role}
                onChange={(e) => form.setRole(e.target.value as UserRole)}
                className="w-full mt-1 px-3 py-2 border rounded-lg text-sm bg-(--bg-card) text-(--text-main) border-(--border-color) focus:outline-none focus:ring-2 focus:ring-(--color-primary) transition-colors"
              >
                {Object.entries(ROLE_LABELS).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-(--text-main)">
                {t("UsersPage.form.creditLimitSar")}
              </label>
              <input
                type="text"
                value={form.creditLimit}
                onChange={(e) =>
                  form.setCreditLimit(
                    convertArabicToEnglishNumbers(e.target.value),
                  )
                }
                className="w-full mt-1 px-3 py-2 border rounded-lg text-sm bg-(--bg-card) text-(--text-main) border-(--border-color) focus:outline-none focus:ring-2 focus:ring-(--color-primary) transition-colors"
              />
            </div>

            <div className="flex justify-end gap-2 pt-3">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsModalOpen(false)}
              >
                {t("UsersPage.form.cancel")}
              </Button>
              <Button type="submit" variant="primary" disabled={loading}>
                {t("UsersPage.form.saveUser")}
              </Button>
            </div>
          </form>
        </Modal>

        <AlertDialogModal state={alertState} onClose={closeAlert} />
      </div>
    </RoleGuard>
  );
}
