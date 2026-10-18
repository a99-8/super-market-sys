import { db } from "@/db";
import { Product } from "@/types";

export class ProductService {
  static async getAllProducts(): Promise<Product[]> {
    return await db.products.toArray();
  }

  static async searchProducts(query: string): Promise<Product[]> {
    return await db.products
      .filter((p) => p.name.includes(query) || p.barcode.includes(query))
      .toArray();
  }

  static async addProduct(
    productData: Omit<
      Product,
      "id" | "reservedQuantity" | "createdAt" | "updatedAt"
    >,
  ): Promise<string> {
    const existing = await db.products
      .where("barcode")
      .equals(productData.barcode)
      .first();
    if (existing) throw new Error("الباركود مكرر لمنتج آخر");

    const newProduct: Product = {
      ...productData,
      id: crypto.randomUUID(),
      reservedQuantity: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return await db.products.add(newProduct);
  }

  static async updateProduct(
    id: string,
    updates: Partial<Product>,
  ): Promise<void> {
    await db.products.update(id, {
      ...updates,
      updatedAt: new Date().toISOString(),
    });
  }

  static async deleteProduct(id: string): Promise<void> {
    await db.products.delete(id);
  }

  static async reserveQuantity(productId: string, qty: number): Promise<void> {
    await db.transaction("rw", db.products, async () => {
      const product = await db.products.get(productId);
      if (!product) throw new Error("المنتج غير موجود");

      const availableStock = product.stockQuantity - product.reservedQuantity;
      if (availableStock < qty) {
        throw new Error(
          `الكمية المتاحة غير كافية. المتبقي بالمخزن: ${availableStock}`,
        );
      }

      await db.products.update(productId, {
        reservedQuantity: product.reservedQuantity + qty,
      });
    });
  }

  static async releaseReservedQuantity(
    productId: string,
    qty: number,
  ): Promise<void> {
    await db.transaction("rw", db.products, async () => {
      const product = await db.products.get(productId);
      if (!product) return;

      await db.products.update(productId, {
        reservedQuantity: Math.max(0, product.reservedQuantity - qty),
      });
    });
  }

  static async commitSale(productId: string, soldQty: number): Promise<void> {
    await db.transaction("rw", db.products, async () => {
      const product = await db.products.get(productId);
      if (!product) throw new Error("المنتج غير موجود");

      let newDiscountQty = product.discountQuantity;
      if (product.discountPrice && newDiscountQty > 0) {
        newDiscountQty = Math.max(0, newDiscountQty - soldQty);
      }

      await db.products.update(productId, {
        stockQuantity: Math.max(0, product.stockQuantity - soldQty),
        reservedQuantity: Math.max(0, product.reservedQuantity - soldQty),
        discountQuantity: newDiscountQty,
        updatedAt: new Date().toISOString(),
      });
    });
  }

  static async exportToJson(): Promise<string> {
    const products = await db.products.toArray();
    return JSON.stringify(products, null, 2);
  }

  static async importFromJson(jsonData: string): Promise<void> {
    const products: Product[] = JSON.parse(jsonData);
    await db.transaction("rw", db.products, async () => {
      await db.products.clear();
      await db.products.bulkAdd(products);
    });
  }

  static async createProduct(
    productData: Omit<
      Product,
      "id" | "reservedQuantity" | "createdAt" | "updatedAt"
    >,
  ): Promise<string> {
    return this.addProduct(productData);
  }
}
