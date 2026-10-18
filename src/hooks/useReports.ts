import { useState, useEffect } from "react";
import { invoiceService } from "@/services/invoiceService";
import { ProductService } from "@/services/productService";
import { UserService } from "@/services/userService";
import { Invoice, Product, User } from "@/types";

export function useReports() {
  const [activeReport, setActiveReport] = useState<
    "SALES" | "INVENTORY" | "DEBTS"
  >("SALES");
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const inv = await invoiceService.getAllInvoices();
      const prod = await ProductService.getAllProducts();
      const usrs = await UserService.getAllUsers();
      setInvoices(inv);
      setProducts(prod);
      setUsers(usrs);
    };
    fetchData();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const getReportData = () => {
    if (activeReport === "SALES") {
      const totalSales = invoices.reduce((sum, i) => sum + i.totalAmount, 0);
      return {
        title: "تقرير المبيعات الشامل",
        headers: ["رقم الفاتورة", "المجموع", "طريقة الدفع", "التاريخ"],
        rows: invoices.map((i) => [
          i.id || "-",
          i.totalAmount,
          i.paymentMethod,
          new Date(i.createdAt).toLocaleString("ar-SA"),
        ]),
        summary: [{ label: "إجمالي المبيعات", value: totalSales }],
      };
    } else if (activeReport === "INVENTORY") {
      const totalCost = products.reduce(
        (sum, p) => sum + p.costPrice * p.stockQuantity,
        0,
      );
      return {
        title: "تقرير جرد المستودع والمخزون",
        headers: ["الباركود", "اسم المنتج", "المخزون", "سعر البيع"],
        rows: products.map((p) => [
          p.barcode,
          p.name,
          p.stockQuantity,
          p.salePrice,
        ]),
        summary: [{ label: "إجمالي قيمة التكلفة بالمتجر", value: totalCost }],
      };
    } else {
      const totalDebts = users.reduce((sum, u) => sum + u.creditBalance, 0);
      return {
        title: "تقرير ديون وأرصدة العملاء",
        headers: ["اسم المستخدم", "رقم الجوال", "الرصيد المتاح"],
        rows: users.map((u) => [u.username, u.phone, u.creditBalance]),
        summary: [
          { label: "إجمالي الأرصدة المتاحة للديون", value: totalDebts },
        ],
      };
    }
  };

  return {
    activeReport,
    setActiveReport,
    reportData: getReportData(),
    handlePrint,
  };
}
