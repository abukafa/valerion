"use client";

import { useState, useRef, useEffect } from "react";
import { LogOut, User, ShieldAlert, LayoutDashboard } from "lucide-react";
import { logoutUser } from "@/modules/auth/actions";
import Link from "next/link";
import { ProfileModal } from "./ProfileModal";

export function ProfileDropdown({
  user,
}: {
  user: { id?: string; name?: string | null; email?: string | null; image?: string | null; role?: string; isVerified?: boolean; };
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 rounded-full overflow-hidden bg-secondary flex items-center justify-center font-bold text-white border-2 border-transparent hover:border-primary transition-all shadow-[0_0_10px_rgba(255,77,0,0.3)] focus:outline-none focus:border-primary"
      >
        {user.image ? (
          <img
            src={user.image}
            alt={user.name || "User"}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        ) : (
          user.name?.charAt(0).toUpperCase() || "U"
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-64 bg-card border border-card-border rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="p-4 border-b border-card-border/50 bg-background/50">
            <p className="font-bold text-white truncate">
              {user.name || "Pengguna"}
            </p>
            <p className="text-xs text-foreground/60 truncate mt-1">
              {user.email || "No Email"}
            </p>
          </div>

          <div className="p-2">
            <Link
              href="/dashboard"
              className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-foreground hover:bg-white/5 hover:text-white rounded-xl transition-colors text-left"
              onClick={() => setIsOpen(false)}
            >
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </Link>
            <button
              className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-foreground hover:bg-white/5 hover:text-white rounded-xl transition-colors text-left"
              onClick={() => {
                setIsOpen(false);
                setIsModalOpen(true);
              }}
            >
              <User className="w-4 h-4" />
              Profil Saya
            </button>
            <form action={logoutUser}>
              <button
                type="submit"
                className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-xl transition-colors text-left"
              >
                <LogOut className="w-4 h-4" />
                Keluar
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal Profile Lengkap */}
      <ProfileModal 
        user={user} 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
}
