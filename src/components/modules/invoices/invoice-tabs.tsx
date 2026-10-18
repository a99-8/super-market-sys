import React from "react";
import { useInvoiceTabsStore } from "@/store/useInvoiceTabsStore";
import { InvoiceItem } from "@/types";
import { X } from "lucide-react";

export const InvoiceTabs: React.FC = () => {
  const { tabs, activeTabId, setActiveTab, createTab, closeTab } =
    useInvoiceTabsStore();

  return (
    <div className="flex items-center gap-2 overflow-x-auto p-2 bg-(--bg-subtle) border-b border-(--border-color)">
      {tabs.map((tab, index) => {
        const tabIdentifier = tab.id || tab.tabId;
        const isActive = tabIdentifier === activeTabId;

        const itemsList = tab.cart || tab.items || [];
        const itemCount = itemsList.reduce(
          (sum: number, item: InvoiceItem) => sum + item.quantity,
          0,
        );

        return (
          <div
            key={tabIdentifier}
            onClick={() => setActiveTab(tabIdentifier)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm cursor-pointer border transition-all whitespace-nowrap select-none ${
              isActive
                ? "bg-(--color-primary) text-white border-(--color-primary) shadow-sm font-medium"
                : "bg-(--bg-card) text-(--text-main) border-(--border-color) hover:bg-(--bg-subtle)"
            }`}
          >
            <span>فاتورة #{index + 1}</span>
            {itemCount > 0 && (
              <span
                className={`text-xs px-1.5 py-0.5 rounded-full ${
                  isActive
                    ? "bg-black/20 text-white"
                    : "bg-(--bg-subtle) text-(--text-muted) border border-(--border-color)"
                }`}
              >
                {itemCount}
              </span>
            )}
            {tabs.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  closeTab(tabIdentifier);
                }}
                className={`text-xs rounded p-0.5 hover:bg-black/10 transition-colors ${
                  isActive
                    ? "text-white"
                    : "text-(--text-muted) hover:text-(--text-main)"
                }`}
              >
                <X />
              </button>
            )}
          </div>
        );
      })}

      {tabs.length < 10 && (
        <button
          onClick={createTab}
          className="flex items-center justify-center px-3 py-1.5 rounded-lg border border-dashed border-(--border-color) text-(--text-muted) text-sm hover:border-(--color-primary) hover:text-(--color-primary) transition-colors font-semibold bg-(--bg-card)"
        >
          + جديد
        </button>
      )}
    </div>
  );
};
