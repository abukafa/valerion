"use client";

import { useState, useTransition } from "react";
import { approveUserKYC, rejectUserKYC } from "@/modules/admin/actions";
import { CheckCircle2, XCircle, FileImage, Loader2 } from "lucide-react";

export function KYCList({ users }: { users: any[] }) {
  const [isPending, startTransition] = useTransition();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleApprove = (id: string) => {
    if (confirm("Setujui dokumen KTP ini?")) {
      startTransition(async () => {
        await approveUserKYC(id);
      });
    }
  };

  const handleReject = (id: string) => {
    if (confirm("Tolak dokumen KTP ini? (User harus upload ulang)")) {
      startTransition(async () => {
        await rejectUserKYC(id);
      });
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {users.map((user) => (
          <div key={user.id} className="bg-card border border-card-border p-5 rounded-2xl shadow-lg relative overflow-hidden group">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-bold text-white text-lg leading-tight">{user.name}</h3>
                <p className="text-xs text-foreground/60">{user.email}</p>
              </div>
              <div className="bg-primary/20 text-primary text-[10px] font-bold px-2 py-1 rounded-md border border-primary/30">
                PENDING
              </div>
            </div>

            <div className="bg-secondary rounded-xl p-3 mb-5 border border-card-border">
              <p className="text-xs text-foreground/60 mb-2 font-medium">Dokumen KTP:</p>
              <button 
                onClick={() => setSelectedImage(user.kycDocumentUrl)}
                className="w-full h-24 bg-background border border-dashed border-card-border hover:border-primary/50 transition-colors rounded-lg flex flex-col items-center justify-center text-foreground/50 hover:text-primary group-hover:border-primary/30"
              >
                <FileImage className="w-6 h-6 mb-1" />
                <span className="text-[10px] font-bold">Lihat Dokumen</span>
              </button>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => handleReject(user.id)}
                disabled={isPending}
                className="flex-1 bg-background border border-red-500/50 hover:bg-red-500/10 text-red-500 py-2.5 rounded-xl text-sm font-bold transition-colors disabled:opacity-50 flex items-center justify-center gap-1.5"
              >
                {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
                Tolak
              </button>
              <button
                onClick={() => handleApprove(user.id)}
                disabled={isPending}
                className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2.5 rounded-xl text-sm font-bold transition-all shadow-[0_0_15px_rgba(34,197,94,0.3)] hover:shadow-[0_0_25px_rgba(34,197,94,0.5)] disabled:opacity-50 flex items-center justify-center gap-1.5"
              >
                {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                Setujui
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Image Preview Modal */}
      {selectedImage && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedImage(null)}>
          <div className="relative max-w-4xl max-h-[90vh] w-full" onClick={(e) => e.stopPropagation()}>
            <button 
              onClick={() => setSelectedImage(null)}
              className="absolute -top-12 right-0 w-10 h-10 bg-card rounded-full flex items-center justify-center text-white hover:bg-primary transition-colors border border-card-border"
            >
              <XCircle className="w-6 h-6" />
            </button>
            <div className="bg-card border border-card-border p-2 rounded-2xl overflow-hidden w-full h-full flex items-center justify-center shadow-2xl">
              <img 
                src={selectedImage} 
                alt="KTP Preview" 
                className="max-w-full max-h-[85vh] object-contain rounded-xl"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
