import type { Metadata } from "next";
import "./globals.css";
import { SiteNav } from "@/components/layout/SiteNav";

export const metadata: Metadata = {
  title: "AI Fashion — AI Продавец",
  description: "Персональный помощник для выбора одежды.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru">
      <body>
        <SiteNav />
        {children}
      </body>
    </html>
  );
}
