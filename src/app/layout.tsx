import type { Metadata } from "next";
import { QueryProvider } from "@/lib/query/QueryProvider";
import { MockProvider } from "@/lib/api/mocks/MockProvider";
import { StoreProvider } from "@/lib/store/StoreProvider";
import { Navigation } from "@/shared/components/Navigation";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "OVGS - Sistema de Gestão de Ordens de Venda",
  description: "Sistema de gestão do ciclo de vida de Ordens de Venda",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <MockProvider>
          <StoreProvider>
            <QueryProvider>
              <Navigation />
              {children}
            </QueryProvider>
          </StoreProvider>
        </MockProvider>
      </body>
    </html>
  );
}
