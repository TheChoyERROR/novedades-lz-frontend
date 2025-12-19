import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { MainLayout } from "@/components/layout";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Novedades LZ - Tu tienda de confianza",
  description: "Encuentra los mejores productos con calidad garantizada y envío rápido a todo el país.",
  keywords: ["tienda", "ecommerce", "productos", "novedades", "compras online"],
  authors: [{ name: "Novedades LZ" }],
  openGraph: {
    title: "Novedades LZ - Tu tienda de confianza",
    description: "Encuentra los mejores productos con calidad garantizada y envío rápido a todo el país.",
    type: "website",
    locale: "es_PE",
    siteName: "Novedades LZ",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${inter.variable} antialiased`}>
        <MainLayout>{children}</MainLayout>
      </body>
    </html>
  );
}
