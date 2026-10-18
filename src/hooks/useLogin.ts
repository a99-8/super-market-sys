import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { UserService } from "@/services/userService";
import { ProductService } from "@/services/productService";
import { INITIAL_USERS, INITIAL_PRODUCTS } from "@/db/initial-data";

export function useLogin() {
  const router = useRouter();
  const { login } = useAuthStore();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const initData = async () => {
      try {
        const users = await UserService.getAllUsers();
        if (users.length === 0) {
          for (const u of INITIAL_USERS) {
            await UserService.createUser({
              username: u.username,
              phone: u.phone,
              role: u.role,
              creditLimit: u.creditLimit,
              password: u.passwordHash,
            });
          }
        }

        const products = await ProductService.getAllProducts();
        if (products.length === 0) {
          for (const p of INITIAL_PRODUCTS) {
            await ProductService.createProduct(p);
          }
        }
      } catch (err) {
        console.error("خطأ في استيراد البيانات الأولية:", err);
      }
    };

    initData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!username || !password) {
      setError("يرجى كتابة اسم المستخدم وكلمة المرور");
      return;
    }

    try {
      setLoading(true);
      const user = await UserService.authenticate(username, password);

      if (!user) {
        setError("اسم المستخدم أو كلمة المرور غير صحيحة");
        return;
      }

      login(user);
      router.push("/invoices");
    } catch (err: any) {
      setError("حدث خطأ أثناء محاولة تسجيل الدخول");
    } finally {
      setLoading(false);
    }
  };

  return {
    username,
    setUsername,
    password,
    setPassword,
    error,
    loading,
    handleSubmit,
  };
}
