import { useState, useEffect } from "react";
import { ProductService } from "@/services/productService";
import { Product } from "@/types";

export function useInventory() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const loadProducts = async () => {
    const data = await ProductService.getAllProducts();
    setProducts(data);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleSaveProduct = async (productData: any) => {
    if (productData.id) {
      await ProductService.updateProduct(productData.id, productData);
    } else {
      await ProductService.createProduct(productData);
    }
    await loadProducts();
  };

  const handleDeleteProduct = async (id: string) => {
    if (confirm("هل أنت تأكد من حذف هذا المنتج؟")) {
      await ProductService.deleteProduct(id);
      await loadProducts();
    }
  };

  const openCreateModal = () => {
    setSelectedProduct(null);
    setIsModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  return {
    products,
    isModalOpen,
    setIsModalOpen,
    selectedProduct,
    loadProducts,
    handleSaveProduct,
    handleDeleteProduct,
    openCreateModal,
    openEditModal,
  };
}
