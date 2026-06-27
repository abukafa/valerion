"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, ShoppingBag, ShieldAlert, ArrowLeft, Menu, X } from "lucide-react";

export function AdminSidebar({ user }: { user: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { href: "/admin", icon: LayoutDashboard, label: "Overview", color: "text-primary" },
    { href: "/admin/users", icon: Users, label: "Pengguna & KYC", color: "text-blue-500" },
    { href: "/admin/listings", icon: ShoppingBag, label: "Moderasi Akun", color: "text-green-500" },
    { href: "/admin/transactions", icon: ShieldAlert, label: "Sengketa (Dispute)", color: "text-purple-500" },
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
            Admin Menu
          </div>
          <nav className="flex flex-col gap-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link 
                  key={item.href}
                  href={item.href} 
                  onClick={() => setIsOpen(false)} // Close on click for mobile
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
