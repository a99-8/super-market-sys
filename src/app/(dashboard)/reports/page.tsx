"use client";

import { RoleGuard } from "@/components/layout/role-guard";
import { Button } from "@/components/ui/button";
import { PrintTemplate } from "@/components/modules/reports/print-template";
import { useReports } from "@/hooks/useReports";
import { Printer } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function ReportsPage() {
  const { activeReport, setActiveReport, reportData, handlePrint } =
    useReports();

  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === "ar";

  return (
    <RoleGuard allowedRoles={["ADMIN", "REPORTS_VIEWER"]}>
      <div className="space-y-4 text-(--text-main)" dir={isRtl ? "rtl" : "ltr"}>
        <div className="flex justify-between items-center bg-(--bg-card) p-4 rounded-xl border border-(--border-color) shadow-sm print:hidden">
          <div className="flex gap-2">
            <Button
              variant={activeReport === "SALES" ? "primary" : "outline"}
              size="sm"
              onClick={() => setActiveReport("SALES")}
            >
              {t("ReportsPage.salesReport")}
            </Button>
            <Button
              variant={activeReport === "INVENTORY" ? "primary" : "outline"}
              size="sm"
              onClick={() => setActiveReport("INVENTORY")}
            >
              {t("ReportsPage.inventoryReport")}
            </Button>
            <Button
              variant={activeReport === "DEBTS" ? "primary" : "outline"}
              size="sm"
              onClick={() => setActiveReport("DEBTS")}
            >
              {t("ReportsPage.debtsReport")}
            </Button>
          </div>
          <Button variant="secondary" size="sm" onClick={handlePrint}>
            {t("ReportsPage.printReport")}
            <Printer />
          </Button>
        </div>

        <div className="bg-(--bg-card) border border-(--border-color) rounded-xl shadow-sm">
          <PrintTemplate
            title={reportData.title}
            dataHeaders={reportData.headers}
            dataRows={reportData.rows}
            summaryItems={reportData.summary}
          />
        </div>
      </div>
    </RoleGuard>
  );
}
