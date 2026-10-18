"use client";

import { RoleGuardProps } from "@/types";
import { useAuthStore } from "@/store/useAuthStore";

export function RoleGuard({
  allowedRoles,
  children,
  fallback = null,
}: RoleGuardProps) {
  const { user } = useAuthStore();

  if (!user) return null;

  const hasAccess = user.role === "ADMIN" || allowedRoles.includes(user.role);

  if (!hasAccess) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
