import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Home, Zap, ShoppingBag, LogIn, UserPlus } from "lucide-react";

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
    <html lang="id">
      <body
        className={`${inter.className} bg-background text-foreground antialiased min-h-screen flex flex-col pb-16 md:pb-0`}
      >
        {/* Desktop Navbar */}
        <header className="border-b border-card-border bg-background sticky top-0 z-50">
          <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            <div className="text-2xl font-black italic tracking-tighter flex items-center gap-2">
              <span className="text-primary">VALERION</span>
            </div>

            {/* Desktop Links */}
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
              <a
                href="#"
                className="text-foreground hover:text-primary transition-colors"
              >
                Home
              </a>
              <a
                href="#"
                className="text-foreground/80 hover:text-primary transition-colors"
              >
                Cek Pesanan
              </a>
              <a
                href="#"
                className="text-foreground/80 hover:text-primary transition-colors"
              >
                Daftar Harga
              </a>
              <a
                href="#"
                className="text-foreground/80 hover:text-primary transition-colors"
              >
                Top 10
              </a>
              <a
                href="#"
                className="text-foreground/80 hover:text-primary transition-colors"
              >
                Calculator ML
              </a>
              <div className="h-4 w-px bg-card-border mx-2"></div>
              <a
                href="#"
                className="hover:text-primary transition-colors font-bold"
              >
                Masuk / Daftar
              </a>
            </nav>
          </div>
        </header>

        <main className="flex-1 container mx-auto md:px-4 max-w-7xl">
          {children}
        </main>

        <footer className="border-t border-card-border py-8 mt-12 text-center text-sm text-foreground/40 hidden md:block">
          <p>&copy; 2026 Valerion. The Safe Trade Foundation.</p>
        </footer>

        {/* Mobile Bottom Navigation */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-background border-t border-card-border flex justify-around items-center h-16 z-50 pb-safe shadow-[0_-5px_20px_rgba(0,0,0,0.5)]">
          <a
            href="#"
            className="flex flex-col items-center gap-1 text-foreground/60 hover:text-primary transition-colors"
          >
            <Home className="w-5 h-5" />
            <span className="text-[10px] font-medium">Beranda</span>
          </a>
          <a
            href="#"
            className="flex flex-col items-center gap-1 text-foreground/60 hover:text-primary transition-colors"
          >
            <Zap className="w-5 h-5" />
            <span className="text-[10px] font-medium">Topup</span>
          </a>
          <a href="#" className="flex flex-col items-center gap-1 text-primary">
            <ShoppingBag className="w-5 h-5" />
            <span className="text-[10px] font-medium">Toko Akun</span>
          </a>
          <a
            href="#"
            className="flex flex-col items-center gap-1 text-foreground/60 hover:text-primary transition-colors"
          >
            <LogIn className="w-5 h-5" />
            <span className="text-[10px] font-medium">Login</span>
          </a>
          <a
            href="#"
            className="flex flex-col items-center gap-1 text-foreground/60 hover:text-primary transition-colors"
          >
            <UserPlus className="w-5 h-5" />
            <span className="text-[10px] font-medium">Daftar</span>
          </a>
        </nav>
      </body>
    </html>
  );
}
