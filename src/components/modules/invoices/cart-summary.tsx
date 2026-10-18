import React from "react";
import { CartSummaryProps } from "@/types";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/utils/currencyFormatter";
import { X } from "lucide-react";

export const CartSummary: React.FC<CartSummaryProps> = ({
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onCheckout,
}) => {
  const totalAmount = cart.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0,
  );

  return (
    <div className="flex flex-col h-full bg-(--bg-card) border border-(--border-color) rounded-xl p-4 shadow-sm text-(--text-main)">
      <div className="flex items-center justify-between pb-3 border-b border-(--border-color)">
        <h3 className="font-bold text-(--text-main) text-base">
          محتويات السلة
        </h3>
        {cart.length > 0 && (
          <button
            onClick={onClearCart}
            className="text-xs text-(--color-danger) hover:underline font-medium"
          >
            تفريغ السلة
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto py-3 space-y-3 max-h-[calc(100vh-360px)]">
        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-(--text-muted) text-sm">
            السلة فارغة حالياً
          </div>
        ) : (
          cart.map((item) => (
            <div
              key={item.productId}
              className="flex items-center justify-between bg-(--bg-subtle) p-2.5 rounded-lg border border-(--border-color)"
            >
              <div className="flex-1 min-w-0 ml-2">
                <p className="text-xs font-semibold text-(--text-main) truncate">
                  {item.productName}
                </p>
                <p className="text-xs text-(--text-muted) mt-0.5">
                  {formatCurrency(item.unitPrice)} × {item.quantity}
                </p>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() =>
                    onUpdateQuantity(item.productId, item.quantity - 1)
                  }
                  className="w-6 h-6 flex items-center justify-center bg-(--bg-card) border border-(--border-color) rounded text-(--text-main) hover:bg-(--bg-subtle) text-xs font-bold"
                >
                  -
                </button>
                <span className="text-xs font-bold w-6 text-center text-(--text-main)">
                  {item.quantity}
                </span>
                <button
                  onClick={() =>
                    onUpdateQuantity(item.productId, item.quantity + 1)
                  }
                  className="w-6 h-6 flex items-center justify-center bg-(--bg-card) border border-(--border-color) rounded text-(--text-main) hover:bg-(--bg-subtle) text-xs font-bold"
                >
                  +
                </button>
                <button
                  onClick={() => onRemoveItem(item.productId)}
                  className="mr-2 text-(--color-danger) hover:opacity-80 text-xs p-1"
                >
                  <X />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="pt-3 border-t border-(--border-color) space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-(--text-muted)">
            المبلغ الإجمالي:
          </span>
          <span className="text-lg font-extrabold text-(--color-primary)">
            {formatCurrency(totalAmount)}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <Button
            variant="primary"
            size="sm"
            disabled={cart.length === 0}
            onClick={() => onCheckout("CASH")}
          >
            نقداً
          </Button>
          <Button
            variant="secondary"
            size="sm"
            disabled={cart.length === 0}
            onClick={() => onCheckout("CARD")}
          >
            شبكة
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={cart.length === 0}
            onClick={() => onCheckout("CREDIT")}
          >
            آجل (دَين)
          </Button>
        </div>
      </div>
    </div>
  );
};
