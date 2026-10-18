"use client";

import { RoleGuard } from "@/components/layout/role-guard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { AlertDialogModal } from "@/components/ui/alert-modal";
import { UserRole } from "@/types";
import { formatCurrency } from "@/utils/currencyFormatter";
import { useSettings } from "@/hooks/useSettings";
import { useTranslation } from "react-i18next";

export default function SettingsPage() {
  const {
    users,
    form,
    rechargeModal,
    alertState,
    closeAlert,
    handleCreateUser,
  } = useSettings();
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === "ar";

  return (
    <RoleGuard allowedRoles={["ADMIN", "USER_SUPERVISOR", "USERS_SUPERVISOR"]}>
      <div
        className="grid grid-cols-1 md:grid-cols-3 gap-6 text-(--text-main)"
        dir={isRtl ? "rtl" : "ltr"}
      >
        <div className="bg-(--bg-card) p-4 rounded-xl border border-(--border-color) shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-(--text-main)">
            {t("public.addNewUser")}
          </h3>
          <form onSubmit={handleCreateUser} className="space-y-3">
            <Input
              label={t("public.username")}
              value={form.username}
              onChange={(e) => form.setUsername(e.target.value)}
              required
            />
            <Input
              type="password"
              label={t("public.password")}
              value={form.password}
              onChange={(e) => form.setPassword(e.target.value)}
              required
            />
            <Input
              label={t("public.phone")}
              value={form.phone}
              onChange={(e) => form.setPhone(e.target.value)}
              required
            />

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-(--text-muted)">
                {t("public.roleLabel")}
              </label>
              <select
                value={form.role}
                onChange={(e) => form.setRole(e.target.value as UserRole)}
                className="w-full px-3 py-2 border rounded-lg text-sm bg-(--bg-subtle) text-(--text-main) border-(--border-color) focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="CASHIER">{t("public.roles.cashier")}</option>
                <option value="INVENTORY_MANAGER">
                  {t("public.roles.inventoryManager")}
                </option>
                <option value="REPORTS_VIEWER">
                  {t("public.roles.reportsViewer")}
                </option>
                <option value="USERS_SUPERVISOR">
                  {t("public.roles.usersSupervisor")}
                </option>
                <option value="ADMIN">{t("public.roles.admin")}</option>
              </select>
            </div>

            <Input
              type="number"
              label={t("public.creditBalance")}
              value={form.creditBalance}
              onChange={(e) => form.setCreditBalance(e.target.value)}
            />

            <Button type="submit" variant="primary" fullWidth>
              {t("public.saveUser")}
            </Button>
          </form>
        </div>

        <div className="md:col-span-2 bg-(--bg-card) p-4 rounded-xl border border-(--border-color) shadow-sm space-y-3">
          <h3 className="font-bold text-sm text-(--text-main)">
            {t("public.registeredUsers")}
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-(--bg-subtle) border-b border-(--border-color) font-bold text-(--text-muted)">
                <tr>
                  <th className="p-2.5">{t("SettingsPage.table.name")}</th>
                  <th className="p-2.5">{t("public.phone")}</th>
                  <th className="p-2.5">{t("public.role")}</th>
                  <th className="p-2.5">{t("public.creditBalance")}</th>
                  <th className="p-2.5 text-center">{t("public.action")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-(--border-color)">
                {users.map((u) => (
                  <tr key={u.id}>
                    <td className="p-2.5 font-bold text-(--text-main)">
                      {u.username}
                    </td>
                    <td className="p-2.5 text-(--text-muted)">{u.phone}</td>
                    <td className="p-2.5 text-(--text-muted)">{u.role}</td>
                    <td className="p-2.5 font-bold text-(--color-primary)">
                      {formatCurrency(u.creditBalance)}
                    </td>
                    <td className="p-2.5 text-center">
                      <button
                        onClick={() => rechargeModal.openModal(u.id!)}
                        className="text-xs bg-(--bg-subtle) text-(--color-primary) border border-(--border-color) px-2 py-1 rounded hover:opacity-80 font-medium transition-opacity"
                      >
                        {t("public.recharge")}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <Modal
          isOpen={rechargeModal.isOpen}
          onClose={() => rechargeModal.setIsOpen(false)}
          title={t("public.rechargeTitle")}
        >
          <div className="space-y-4 text-(--text-main)">
            <Input
              type="number"
              label={t("public.rechargeAmountLabel")}
              value={rechargeModal.amount}
              onChange={(e) => rechargeModal.setAmount(e.target.value)}
              placeholder={t("SettingsPage.rechargeModal.placeholder")}
            />
            <div className="flex justify-end gap-2">
              <Button
                variant="ghost"
                onClick={() => rechargeModal.setIsOpen(false)}
              >
                {t("public.cancel")}
              </Button>
              <Button variant="primary" onClick={rechargeModal.confirmRecharge}>
                {t("public.confirmRecharge")}
              </Button>
            </div>
          </div>
        </Modal>

        <AlertDialogModal state={alertState} onClose={closeAlert} />
      </div>
    </RoleGuard>
  );
}
