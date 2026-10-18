import type { Metadata } from "next";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: "نظام إدارة البقالة - POS",
  description: "نظام نقاط بيع وإدارة مخزون متكامل للبقالة",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body className="antialiased min-h-screen">{children}</body>
    </html>
  );
}
