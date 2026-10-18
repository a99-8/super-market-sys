"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { Sidebar } from "@/components/layout/sidebar";
import "@/app/globals.css";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isMounted, router]);

  if (!isMounted || !isAuthenticated) return null;

  return (
    <div className="min-h-screen flex bg-(--bg-main) text-(--text-main)">
      <Sidebar />

      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto print:overflow-visible">
        <div className="p-6 print:p-0">{children}</div>
      </main>
    </div>
  );
}
