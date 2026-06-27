"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, ShoppingBag, ShieldAlert, ArrowLeft, Menu, X, PackageOpen, CreditCard, ShieldCheck, ShoppingCart, DollarSign } from "lucide-react";

export function DashboardSidebar({ user }: { user: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const userNavItems = [
    { href: "/dashboard", icon: LayoutDashboard, label: "Ringkasan", color: "text-primary" },
    { href: "/dashboard/my-orders", icon: ShoppingCart, label: "Pesanan Saya", color: "text-orange-500" },
    { href: "/dashboard/my-sales", icon: DollarSign, label: "Penjualan Saya", color: "text-emerald-500" },
    { href: "/dashboard/my-listings", icon: PackageOpen, label: "Stok Dagangan", color: "text-blue-500" },
    { href: "/dashboard/kyc", icon: ShieldCheck, label: "Verifikasi KTP", color: "text-green-500" },
  ];

  const adminNavItems = [
    { href: "/dashboard/admin/overview", icon: ShieldAlert, label: "Admin Overview", color: "text-red-500" },
    { href: "/dashboard/admin/users", icon: Users, label: "Moderasi KYC", color: "text-blue-500" },
    { href: "/dashboard/admin/listings", icon: ShoppingBag, label: "Moderasi Akun", color: "text-green-500" },
  ];

  return (
    <>
      {/* Mobile Menu Button (Hamburger) */}
      <button 
        onClick={() => setIsOpen(true)}
        className="md:hidden fixed top-3 left-4 z-50 p-2 bg-card border border-card-border rounded-lg text-white"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside className={`fixed md:static inset-y-0 left-0 z-[70] w-64 bg-card border-r border-card-border flex flex-col h-full transform transition-transform duration-300 ease-in-out ${
        isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      }`}>
        <div className="h-16 flex items-center justify-between px-6 border-b border-card-border shrink-0">
          <Link href="/" className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span className="font-black italic tracking-tight">VALERION</span>
          </Link>
          <button 
            onClick={() => setIsOpen(false)}
            className="md:hidden p-1 text-foreground/50 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 flex-1 overflow-y-auto">
          <div className="text-xs font-bold text-foreground/40 mb-4 uppercase tracking-wider px-2">
            Menu Personal
          </div>
          <nav className="flex flex-col gap-2 mb-8">
            {userNavItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link 
                  key={item.href}
                  href={item.href} 
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    isActive ? "bg-white/10 text-white" : "text-foreground hover:bg-white/5"
                  }`}
                >
                  <item.icon className={`w-4 h-4 ${item.color}`} />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {user.role === "ADMIN" && (
            <>
              <div className="text-xs font-bold text-red-500/70 mb-4 uppercase tracking-wider px-2">
                Administrasi
              </div>
              <nav className="flex flex-col gap-2">
                {adminNavItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link 
                      key={item.href}
                      href={item.href} 
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                        isActive ? "bg-red-500/10 text-red-400" : "text-foreground hover:bg-white/5"
                      }`}
                    >
                      <item.icon className={`w-4 h-4 ${item.color}`} />
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            </>
          )}
        </div>
        
        <div className="p-4 border-t border-card-border mt-auto shrink-0">
          <div className="bg-primary/10 border border-primary/20 rounded-xl p-3 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full overflow-hidden bg-secondary flex items-center justify-center font-bold text-white shadow-[0_0_10px_rgba(255,77,0,0.5)]">
              {user.image ? (
                <img src={user.image} alt="Profile" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              ) : (
                <span className="text-xs">{user.name?.charAt(0).toUpperCase() || "A"}</span>
              )}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-white leading-tight truncate">{user.name || "Admin Area"}</p>
              <p className="text-[10px] text-foreground/60 truncate">{user.email}</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
