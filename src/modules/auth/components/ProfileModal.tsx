"use client";

import { X, ShieldCheck, Mail, ShieldAlert, BadgeInfo } from "lucide-react";

export function ProfileModal({
  user,
  isOpen,
  onClose,
}: {
  user: any;
  isOpen: boolean;
  onClose: () => void;
}) {
  if (!isOpen) return null;

  const joinDate = new Date().toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }); // Dummy for now since we don't pass createdAt in session, but good enough for UI

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div 
        className="bg-card border border-card-border rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header / Cover */}
        <div className="h-24 bg-gradient-to-r from-primary/40 to-purple-600/40 relative">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 bg-black/50 hover:bg-black rounded-full flex items-center justify-center text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Profile Info */}
        <div className="px-6 pb-6 relative">
          <div className="flex justify-between items-end mb-4">
            <div className="w-20 h-20 rounded-full border-4 border-card bg-secondary overflow-hidden -mt-10 relative z-10 shadow-[0_0_15px_rgba(255,77,0,0.5)]">
              {user.image ? (
                <img src={user.image} alt={user.name || "User"} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-2xl font-black text-white">
                  {user.name?.charAt(0).toUpperCase() || "U"}
                </div>
              )}
            </div>
            
            <div className="mb-1">
              <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                user.role === 'ADMIN' ? 'bg-primary/20 text-primary border-primary/30' : 'bg-secondary text-foreground/60 border-card-border'
              }`}>
                {user.role}
              </span>
            </div>
          </div>

          <h2 className="text-2xl font-black text-white mb-1">{user.name}</h2>
          <p className="text-foreground/60 flex items-center gap-1.5 text-sm mb-6">
            <Mail className="w-4 h-4" /> {user.email}
          </p>

          <div className="space-y-3">
            <div className="bg-background rounded-xl p-3 border border-card-border flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center shrink-0">
                {user.isVerified ? <ShieldCheck className="w-5 h-5 text-green-500" /> : <ShieldAlert className="w-5 h-5 text-yellow-500" />}
              </div>
              <div>
                <p className="text-xs text-foreground/50 font-medium">Status KYC</p>
                <p className={`text-sm font-bold ${user.isVerified ? 'text-green-500' : 'text-yellow-500'}`}>
                  {user.isVerified ? "Terverifikasi KTP" : "Belum Terverifikasi"}
                </p>
              </div>
            </div>

            <div className="bg-background rounded-xl p-3 border border-card-border flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0">
                <BadgeInfo className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <p className="text-xs text-foreground/50 font-medium">Bergabung Sejak</p>
                <p className="text-sm font-bold text-white">{joinDate}</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
