import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import {
  Product,
  InvoiceItem,
  PaymentMethod,
  InvoiceTabsState,
  TabInvoice,
} from "@/types";
import { ProductService } from "@/services/productService";
import i18n from "@/utils/i18n";

const MAX_TABS = 10;
const TAX_RATE = 0.15;

const calculateTotals = (items: InvoiceItem[]) => {
  const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0);
  const tax = Math.round(subtotal * TAX_RATE * 100) / 100;
  const totalAmount = Math.round((subtotal + tax) * 100) / 100;
  return { subtotal, tax, totalAmount };
};

export const useInvoiceTabsStore = create<InvoiceTabsState>()(
  persist(
    (set, get) => ({
      tabs: [
        {
          id: "tab_1",
          tabId: "tab_1",
          tabTitle: i18n.t("useInvoiceTabsStore.defaultTabTitle"),
          items: [],
          cart: [],
          subtotal: 0,
          tax: 0,
          totalAmount: 0,
          paymentMethod: "CASH",
        },
      ],
      activeTabId: "tab_1",

      setActiveTab: (tabId: string) => {
        set({ activeTabId: tabId });
      },

      createTab: () => {
        return get().addNewTab();
      },

      addNewTab: () => {
        const { tabs } = get();
        if (tabs.length >= MAX_TABS) {
          return false;
        }

        const newTabId = `tab_${Date.now()}`;
        const newTabNumber = tabs.length + 1;
        const newTab: TabInvoice = {
          id: newTabId,
          tabId: newTabId,
          tabTitle: `فاتورة ${newTabNumber}`,
          items: [],
          cart: [],
          subtotal: 0,
          tax: 0,
          totalAmount: 0,
          paymentMethod: "CASH",
        };

        set({
          tabs: [...tabs, newTab],
          activeTabId: newTabId,
        });
        return true;
      },

      closeTab: async (tabId: string) => {
        const { tabs, activeTabId } = get();

        if (tabs.length === 1) {
          const singleTab = tabs[0];
          for (const item of singleTab.items) {
            await ProductService.releaseReservedQuantity(
              item.productId,
              item.quantity,
            );
          }
          set({
            tabs: [
              {
                ...singleTab,
                items: [],
                cart: [],
                subtotal: 0,
                tax: 0,
                totalAmount: 0,
              },
            ],
          });
          return;
        }

        const tabToClose = tabs.find((t) => t.tabId === tabId);
        if (tabToClose) {
          for (const item of tabToClose.items) {
            await ProductService.releaseReservedQuantity(
              item.productId,
              item.quantity,
            );
          }
        }

        const filteredTabs = tabs.filter((t) => t.tabId !== tabId);
        let nextActiveId = activeTabId;

        if (activeTabId === tabId) {
          nextActiveId = filteredTabs[filteredTabs.length - 1].tabId;
        }

        set({
          tabs: filteredTabs,
          activeTabId: nextActiveId,
        });
      },

      addProductToActiveTab: async (product: Product, quantityToAdd = 1) => {
        const { tabs, activeTabId } = get();
        const activeTab = tabs.find((t) => t.tabId === activeTabId);
        if (!activeTab) return;

        await ProductService.reserveQuantity(product.id, quantityToAdd);

        const existingItemIndex = activeTab.items.findIndex(
          (i) => i.productId === product.id,
        );
        let updatedItems = [...activeTab.items];

        if (existingItemIndex > -1) {
          const existingItem = updatedItems[existingItemIndex];
          const newQty = existingItem.quantity + quantityToAdd;

          let unitPrice = product.sellingPrice;
          let isDiscountApplied = false;

          if (product.discountPrice && product.discountQuantity >= newQty) {
            unitPrice = product.discountPrice;
            isDiscountApplied = true;
          }

          updatedItems[existingItemIndex] = {
            ...existingItem,
            quantity: newQty,
            unitPrice,
            isDiscountApplied,
            totalPrice: newQty * unitPrice,
          };
        } else {
          let unitPrice = product.sellingPrice;
          let isDiscountApplied = false;

          if (
            product.discountPrice &&
            product.discountQuantity >= quantityToAdd
          ) {
            unitPrice = product.discountPrice;
            isDiscountApplied = true;
          }

          updatedItems.push({
            productId: product.id,
            productName: product.name,
            quantity: quantityToAdd,
            unitPrice,
            isDiscountApplied,
            totalPrice: quantityToAdd * unitPrice,
          });
        }

        const totals = calculateTotals(updatedItems);

        set({
          tabs: tabs.map((t) =>
            t.tabId === activeTabId
              ? { ...t, items: updatedItems, cart: updatedItems, ...totals }
              : t,
          ),
        });
      },

      updateItemQuantity: async (productId: string, newQuantity: number) => {
        if (newQuantity <= 0) {
          await get().removeItemFromActiveTab(productId);
          return;
        }

        const { tabs, activeTabId } = get();
        const activeTab = tabs.find((t) => t.tabId === activeTabId);
        if (!activeTab) return;

        const currentItem = activeTab.items.find(
          (i) => i.productId === productId,
        );
        if (!currentItem) return;

        const diff = newQuantity - currentItem.quantity;

        if (diff > 0) {
          await ProductService.reserveQuantity(productId, diff);
        } else if (diff < 0) {
          await ProductService.releaseReservedQuantity(
            productId,
            Math.abs(diff),
          );
        }

        const product = await ProductService.getAllProducts().then((prods) =>
          prods.find((p) => p.id === productId),
        );

        const updatedItems = activeTab.items.map((item) => {
          if (item.productId === productId) {
            let unitPrice = item.unitPrice;
            let isDiscountApplied = item.isDiscountApplied;

            if (
              product &&
              product.discountPrice &&
              product.discountQuantity >= newQuantity
            ) {
              unitPrice = product.discountPrice;
              isDiscountApplied = true;
            } else if (product) {
              unitPrice = product.sellingPrice;
              isDiscountApplied = false;
            }

            return {
              ...item,
              quantity: newQuantity,
              unitPrice,
              isDiscountApplied,
              totalPrice: newQuantity * unitPrice,
            };
          }
          return item;
        });

        const totals = calculateTotals(updatedItems);

        set({
          tabs: tabs.map((t) =>
            t.tabId === activeTabId
              ? { ...t, items: updatedItems, cart: updatedItems, ...totals }
              : t,
          ),
        });
      },

      removeItemFromActiveTab: async (productId: string) => {
        const { tabs, activeTabId } = get();
        const activeTab = tabs.find((t) => t.tabId === activeTabId);
        if (!activeTab) return;

        const itemToRemove = activeTab.items.find(
          (i) => i.productId === productId,
        );
        if (itemToRemove) {
          await ProductService.releaseReservedQuantity(
            productId,
            itemToRemove.quantity,
          );
        }

        const updatedItems = activeTab.items.filter(
          (i) => i.productId !== productId,
        );
        const totals = calculateTotals(updatedItems);

        set({
          tabs: tabs.map((t) =>
            t.tabId === activeTabId
              ? { ...t, items: updatedItems, cart: updatedItems, ...totals }
              : t,
          ),
        });
      },

      setPaymentMethod: (method: PaymentMethod, customerId?: string) => {
        const { tabs, activeTabId } = get();
        set({
          tabs: tabs.map((t) =>
            t.tabId === activeTabId
              ? { ...t, paymentMethod: method, customerId }
              : t,
          ),
        });
      },

      clearActiveTab: async () => {
        const { tabs, activeTabId } = get();
        set({
          tabs: tabs.map((t) =>
            t.tabId === activeTabId
              ? {
                  ...t,
                  items: [],
                  cart: [],
                  subtotal: 0,
                  tax: 0,
                  totalAmount: 0,
                  customerId: undefined,
                }
              : t,
          ),
        });
      },
    }),
    {
      name: "pos_invoice_tabs_storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
