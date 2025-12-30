import type { Metadata } from "next";
import "./globals.css";
import ClientLayout from "./ClientLayout";

export const metadata: Metadata = {
  title: "SmartClass",
  description: "Projeto feito para a fase 3 da Pós tech Fiap",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt">
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}