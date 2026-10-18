import { CashDenomination, UserRole } from "@/types";

export const DEFAULT_DENOMINATIONS: CashDenomination[] = [
  { value: 200, count: 0, denomination: 200 },
  { value: 100, count: 0, denomination: 100 },
  { value: 50, count: 0, denomination: 50 },
  { value: 20, count: 0, denomination: 20 },
  { value: 10, count: 0, denomination: 10 },
  { value: 5, count: 0, denomination: 5 },
  { value: 1, count: 0, denomination: 1 },
  { value: 0.5, count: 0, denomination: 0.5 },
];

export const ROLE_LABELS: Record<UserRole, string> = {
  ADMIN: "مدير النظام",
  CASHIER: "كاشير / محاسب",
  STORE_KEEPER: "أمين مخزن",
  INVENTORY_MANAGER: "مدير المخزون",
  REPORTS_SUPERVISOR: "مشرف التقارير",
  REPORTS_VIEWER: "مستعرض التقارير",
  USERS_SUPERVISOR: "مشرف المستخدمين",
  USER_SUPERVISOR: "مشرف حسابات",
};
