import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { DialogProvider } from "@/components/ui/DialogProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Valerion - Premium Game Account Marketplace",
  description: "Tempat transaksi akun game premium yang kokoh dan aman.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className={`${inter.className} bg-background text-foreground antialiased min-h-screen`} suppressHydrationWarning>
        <DialogProvider>
          {children}
        </DialogProvider>
      </body>
    </html>
  );
}
