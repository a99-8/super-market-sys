import { db } from "@/db";
import { Invoice } from "@/types";
import { UserService } from "@/services/userService";

export const invoiceService = {
  async createInvoice(
    invoiceData: Omit<Invoice, "id" | "createdAt">,
  ): Promise<string> {
    return await db.transaction(
      "rw",
      [db.invoices, db.products, db.users, db.drawerSessions],
      async () => {
        for (const item of invoiceData.items) {
          const product = await db.products.get(item.productId);
          if (!product) {
            throw new Error(`المنتج غير موجود: ${item.productName}`);
          }

          if (product.stockQuantity < item.quantity) {
            throw new Error(`الكمية غير متوفرة للمنتج: ${product.name}`);
          }

          const updatedStock = product.stockQuantity - item.quantity;
          let updatedDiscountQuantity = product.discountQuantity;

          if (product.discountQuantity && product.discountQuantity > 0) {
            updatedDiscountQuantity = Math.max(
              0,
              product.discountQuantity - item.quantity,
            );
          }

          await db.products.update(item.productId, {
            stockQuantity: updatedStock,
            discountQuantity: updatedDiscountQuantity,
          });
        }

        if (invoiceData.paymentMethod === "CREDIT") {
          if (!invoiceData.customerId) {
            throw new Error("يجب تحديد العميل لعملية الدفع بالآجل");
          }
          await UserService.deductCredit(
            invoiceData.customerId,
            invoiceData.totalAmount,
          );
        }

        const newInvoice: Omit<Invoice, "id"> = {
          ...invoiceData,
          createdAt: new Date().toISOString(),
        };

        const id = await db.invoices.add(newInvoice as Invoice);
        return id.toString();
      },
    );
  },

  async getAllInvoices(): Promise<Invoice[]> {
    return await db.invoices.orderBy("createdAt").reverse().toArray();
  },

  async getInvoiceById(id: string): Promise<Invoice | undefined> {
    return await db.invoices.get(id);
  },
};
