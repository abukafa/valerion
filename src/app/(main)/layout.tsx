import { Home, Zap, ShoppingBag, LogIn, UserPlus } from "lucide-react";
import { auth } from "@/auth";
import { logoutUser } from "@/modules/auth/actions";
import Link from "next/link";
import { ProfileDropdown } from "@/modules/auth/components/ProfileDropdown";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let session = null;
  try {
    session = await auth();
  } catch (error) {
    console.error("Ignored Auth error");
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Desktop Navbar */}
      <header className="border-b border-card-border bg-background sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="text-2xl font-black italic tracking-tighter flex items-center gap-2">
            <span className="text-primary">VALERION</span>
          </div>

          {/* Desktop Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link
              href="/"
              className="text-foreground hover:text-primary transition-colors"
            >
              Home
            </Link>
            <a href="#" className="text-foreground/80 hover:text-primary transition-colors">
              Cek Pesanan
            </a>
            <a href="#" className="text-foreground/80 hover:text-primary transition-colors">
              Daftar Harga
            </a>
            <a href="#" className="text-foreground/80 hover:text-primary transition-colors">
              Top 10
            </a>
            <a href="#" className="text-foreground/80 hover:text-primary transition-colors">
              Calculator ML
            </a>
            <div className="h-4 w-px bg-card-border mx-2"></div>
            
            {session?.user ? (
              <ProfileDropdown user={session.user} />
            ) : (
              <Link href="/login" className="hover:text-primary transition-colors font-bold">
                Masuk / Daftar
              </Link>
            )}
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
        <Link href="/" className="flex flex-col items-center gap-1 text-foreground/60 hover:text-primary transition-colors">
          <Home className="w-5 h-5" />
          <span className="text-[10px] font-medium">Beranda</span>
        </Link>
        <a href="#" className="flex flex-col items-center gap-1 text-foreground/60 hover:text-primary transition-colors">
          <Zap className="w-5 h-5" />
          <span className="text-[10px] font-medium">Topup</span>
        </a>
        <a href="#" className="flex flex-col items-center gap-1 text-primary">
          <ShoppingBag className="w-5 h-5" />
          <span className="text-[10px] font-medium">Toko Akun</span>
        </a>
        {session?.user ? (
          <>
            <a href="#" className="flex flex-col items-center gap-1 text-foreground/60 hover:text-primary transition-colors">
              <div className="w-5 h-5 rounded-full overflow-hidden bg-secondary flex items-center justify-center text-[10px] font-bold text-white">
                {session.user.image ? (
                  <img src={session.user.image} alt="User" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                ) : (
                  session.user.name?.charAt(0).toUpperCase() || "U"
                )}
              </div>
              <span className="text-[10px] font-medium text-primary">Profil</span>
            </a>
            <form action={logoutUser}>
              <button type="submit" className="flex flex-col items-center gap-1 text-foreground/60 hover:text-red-400 transition-colors">
                <LogIn className="w-5 h-5 rotate-180" />
                <span className="text-[10px] font-medium">Logout</span>
              </button>
            </form>
          </>
        ) : (
          <>
            <Link href="/login" className="flex flex-col items-center gap-1 text-foreground/60 hover:text-primary transition-colors">
              <LogIn className="w-5 h-5" />
              <span className="text-[10px] font-medium">Login</span>
            </Link>
            <Link href="/register" className="flex flex-col items-center gap-1 text-foreground/60 hover:text-primary transition-colors">
              <UserPlus className="w-5 h-5" />
              <span className="text-[10px] font-medium">Daftar</span>
            </Link>
          </>
        )}
      </nav>
    </div>
  );
}
