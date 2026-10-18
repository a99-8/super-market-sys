"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { NavLink } from "@/types";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import {
  DoorOpen,
  Receipt,
  Banknote,
  Package,
  Users,
  BarChart3,
  Settings,
  User,
  ShoppingCart,
  ChevronLeft,
  ChevronRight,
  LucideIcon,
} from "lucide-react";

interface NavigationLink extends Omit<NavLink, "icon"> {
  icon: LucideIcon;
}

const NAV_LINKS: NavigationLink[] = [
  { href: "/invoices", label: "الفواتير ونقطة البيع", icon: Receipt },
  {
    href: "/drawer",
    label: "إدارة الدرج",
    icon: Banknote,
    roles: ["ADMIN", "CASHIER"],
  },
  {
    href: "/inventory",
    label: "المخزون والمنتجات",
    icon: Package,
    roles: ["ADMIN", "STORE_KEEPER", "INVENTORY_MANAGER"],
  },
  {
    href: "/users",
    label: "المستخدمين والموظفين",
    icon: Users,
    roles: ["ADMIN", "USERS_SUPERVISOR", "USER_SUPERVISOR"],
  },
  {
    href: "/reports",
    label: "التقارير والإحصائيات",
    icon: BarChart3,
    roles: ["ADMIN", "REPORTS_SUPERVISOR", "REPORTS_VIEWER"],
  },
  { href: "/settings", label: "الإعدادات", icon: Settings, roles: ["ADMIN"] },
  {
    href: "/profile",
    label: "الملف الشخصي",
    icon: User,
    roles: [
      "ADMIN",
      "CASHIER",
      "STORE_KEEPER",
      "REPORTS_SUPERVISOR",
      "USERS_SUPERVISOR",
      "INVENTORY_MANAGER",
      "USER_SUPERVISOR",
      "REPORTS_VIEWER",
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const filteredLinks = NAV_LINKS.filter((link) => {
    if (!link.roles) return true;
    return user?.role && link.roles.includes(user.role);
  });

  return (
    <aside
      className={`${
        isCollapsed ? "w-20" : "w-64"
      } bg-(--bg-sidebar) text-(--text-sidebar) flex flex-col justify-between p-4 shadow-xl transition-all duration-300 print:hidden shrink-0 border-r border-(--border-color)`}
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between px-1 py-1">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-(--color-primary) flex items-center justify-center font-bold text-white shadow-md shrink-0">
              <ShoppingCart className="w-5 h-5" />
            </div>
            {!isCollapsed && (
              <div className="truncate">
                <h1 className="font-bold text-sm truncate">
                  نظام إدارة البقالة
                </h1>
                <p className="text-[11px] text-(--text-muted)">
                  POS & Inventory
                </p>
              </div>
            )}
          </div>

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 rounded-lg text-(--text-muted) hover:text-(--text-sidebar) hover:bg-(--bg-subtle) transition-colors"
            title={isCollapsed ? "توسيع القائمة" : "إخفاء القائمة"}
          >
            {isCollapsed ? (
              <ChevronLeft className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </button>
        </div>

        <nav className="space-y-1">
          {filteredLinks.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                title={isCollapsed ? link.label : undefined}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-(--color-primary) text-white shadow-md"
                    : "text-(--text-sidebar) hover:bg-(--bg-subtle)"
                } ${isCollapsed ? "justify-center" : ""}`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {!isCollapsed && <span className="truncate">{link.label}</span>}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="pt-4 border-t border-(--border-color) space-y-3">
        {!isCollapsed && (
          <div className="flex items-center justify-between px-2">
            <div className="truncate">
              <p className="text-xs font-bold truncate">{user?.username}</p>
              <p className="text-[10px] text-(--text-muted)">{user?.role}</p>
            </div>
            <span className="w-2.5 h-2.5 rounded-full bg-(--color-primary) animate-pulse"></span>
          </div>
        )}

        <div
          className={`flex items-center ${isCollapsed ? "justify-center" : "w-full"}`}
        >
          <ThemeToggle />
        </div>

        <button
          onClick={() => {
            logout();
            router.push("/login");
          }}
          title={isCollapsed ? "تسجيل الخروج" : undefined}
          className={`w-full flex items-center justify-center gap-2 px-3 py-2 bg-rose-500/10 text-(--color-danger) hover:bg-rose-600 hover:text-white rounded-lg text-xs font-semibold transition-colors ${
            isCollapsed ? "px-0" : ""
          }`}
        >
          <DoorOpen className="w-4 h-4 shrink-0" />
          {!isCollapsed && <span>تسجيل الخروج</span>}
        </button>
      </div>
    </aside>
  );
}
