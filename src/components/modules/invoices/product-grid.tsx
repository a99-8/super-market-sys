import React, { useState } from "react";
import { ProductGridProps } from "@/types";
import { Input } from "@/components/ui/input";
import { formatCurrency } from "@/utils/currencyFormatter";

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  onSelectProduct,
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.barcode.includes(searchTerm),
  );

  return (
    <div className="flex flex-col h-full gap-4 text-(--text-main)">
      <Input
        type="text"
        placeholder="ابحث برقم الباركود أو اسم المنتج..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full"
      />

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 overflow-y-auto max-h-[calc(100vh-220px)] p-1">
        {filteredProducts.map((product) => {
          const hasDiscount =
            product.discountPrice &&
            product.discountQuantity &&
            product.discountQuantity > 0;

          return (
            <div
              key={product.id}
              onClick={() =>
                product.stockQuantity > 0 && onSelectProduct(product)
              }
              className={`flex flex-col justify-between p-3 border rounded-xl bg-(--bg-card) shadow-sm transition-all cursor-pointer select-none border-(--border-color) ${
                product.stockQuantity === 0
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:border-(--color-primary) hover:shadow-md"
              }`}
            >
              <div>
                <h4 className="font-semibold text-(--text-main) text-sm line-clamp-2">
                  {product.name}
                </h4>
                <p className="text-xs text-(--text-muted) mt-0.5">
                  {product.barcode}
                </p>
              </div>

              <div className="mt-3 flex items-center justify-between border-t border-(--border-color) pt-2">
                <div className="flex flex-col">
                  {hasDiscount ? (
                    <>
                      <span className="text-(--color-primary) font-bold text-sm">
                        {formatCurrency(product.discountPrice!)}
                      </span>
                      <span className="text-xs text-(--text-muted) line-through">
                        {formatCurrency(product.salePrice)}
                      </span>
                    </>
                  ) : (
                    <span className="text-(--text-main) font-bold text-sm">
                      {formatCurrency(product.salePrice)}
                    </span>
                  )}
                </div>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    product.stockQuantity > 10
                      ? "bg-(--bg-subtle) text-(--text-muted)"
                      : product.stockQuantity > 0
                        ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                        : "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300"
                  }`}
                >
                  {product.stockQuantity} متوفر
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
