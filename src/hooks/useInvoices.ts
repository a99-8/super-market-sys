import { useState, useEffect } from "react";
import { useInvoiceTabsStore } from "@/store/useInvoiceTabsStore";
import { useAuthStore } from "@/store/useAuthStore";
import { ProductService } from "@/services/productService";
import { UserService } from "@/services/userService";
import { invoiceService } from "@/services/invoiceService";
import { Product, User, InvoiceItem } from "@/types";

export function useInvoices() {
  const { user } = useAuthStore();
  const {
    tabs,
    activeTabId,
    addProductToActiveTab,
    updateItemQuantity,
    removeItemFromActiveTab,
    clearActiveTab,
  } = useInvoiceTabsStore();

  const [products, setProducts] = useState<Product[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isCreditModalOpen, setIsCreditModalOpen] = useState(false);
  const [isCashModalOpen, setIsCashModalOpen] = useState(false);

  const activeTab = tabs.find((t) => t.tabId === activeTabId);
  const cartItems: InvoiceItem[] = activeTab ? activeTab.items : [];
  const totalCartAmount = activeTab?.totalAmount || 0;

  const loadData = async () => {
    const allProducts = await ProductService.getAllProducts();
    const allUsers = await UserService.getAllUsers();
    setProducts(allProducts);
    setUsers(allUsers);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSelectProduct = async (product: Product) => {
    await addProductToActiveTab(product, 1);
  };

  const handleCheckout = (method: "CASH" | "CARD" | "CREDIT") => {
    if (method === "CREDIT") {
      setIsCreditModalOpen(true);
    } else if (method === "CASH") {
      setIsCashModalOpen(true);
    } else if (method === "CARD") {
      handleCompleteInvoice("CARD");
    }
  };

  const handleCompleteInvoice = async (
    method: "CASH" | "CARD" | "CREDIT",
    customerId?: string,
  ) => {
    if (!user || cartItems.length === 0) return;

    const totalAmount = activeTab?.totalAmount || 0;

    await invoiceService.createInvoice({
      cashierId: user.id!,
      items: cartItems,
      totalAmount,
      paymentMethod: method,
      customerId,
    } as any);

    await clearActiveTab();
    await loadData();
  };

  return {
    products,
    users,
    cartItems,
    totalCartAmount,
    isCreditModalOpen,
    setIsCreditModalOpen,
    isCashModalOpen,
    setIsCashModalOpen,
    handleSelectProduct,
    handleCheckout,
    handleCompleteInvoice,
    updateItemQuantity,
    removeItemFromActiveTab,
    clearActiveTab,
  };
}
