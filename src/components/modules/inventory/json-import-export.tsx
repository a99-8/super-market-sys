import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { ProductService } from "@/services/productService";
import { JsonImportExportProps } from "@/types";
import { AlertDialogModal, AlertState } from "@/components/ui/alert-modal";

export const JsonImportExport: React.FC<JsonImportExportProps> = ({
  onDataRefresh,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleExport = async () => {
    try {
      const products = await ProductService.getAllProducts();
      const dataStr =
        "data:text/json;charset=utf-8," +
        encodeURIComponent(JSON.stringify(products, null, 2));
      const downloadAnchor = document.createElement("a");
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute(
        "download",
        `inventory_backup_${new Date().toISOString().slice(0, 10)}.json`,
      );
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    } catch (err) {
      showAlert("خطأ", "حدث خطأ أثناء تصدير البيانات", "error");
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (Array.isArray(json)) {
          if (typeof (ProductService as any).importProducts === "function") {
            await (ProductService as any).importProducts(json);
          } else {
            for (const item of json) {
              await ProductService.createProduct(item);
            }
          }
          showAlert("نجاح", "تم استيراد البيانات بنجاح!", "success");
          onDataRefresh();
        } else {
          showAlert("خطأ في الملف", "صيغة الملف غير صالحة", "error");
        }
      } catch (err) {
        showAlert("خطأ", "فشل في قراءة ملف JSON", "error");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  return (
    <>
      <div className="flex items-center gap-2">
        <input
          type="file"
          accept=".json"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
        />
        <Button
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
        >
          استيراد JSON
        </Button>
        <Button variant="secondary" size="sm" onClick={handleExport}>
          تصدير JSON
        </Button>
      </div>

      <AlertDialogModal state={alertState} onClose={closeAlert} />
    </>
  );
};
