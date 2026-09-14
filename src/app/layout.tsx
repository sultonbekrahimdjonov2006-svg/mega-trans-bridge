import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Fashion — AI Продавец",
  description: "Персональный помощник для выбора одежды.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
