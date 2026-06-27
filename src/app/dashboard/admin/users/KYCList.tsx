"use client";

import { useState, useTransition, useEffect } from "react";
import { createPortal } from "react-dom";
import { approveUserKYC, rejectUserKYC } from "@/modules/admin/actions";
import { CheckCircle2, XCircle, FileImage, Loader2 } from "lucide-react";
import { useDialog } from "@/components/ui/DialogProvider";

export function KYCList({ users }: { users: any[] }) {
  const [isPending, startTransition] = useTransition();
  const { showConfirm, showAlert, showPrompt } = useDialog();
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleApprove = async (id: string) => {
    const confirmed = await showConfirm({
      title: "Setujui KYC",
      message:
        "Setujui dokumen KTP ini? User akan mendapatkan status Verified.",
      confirmText: "Setujui",
    });
    if (confirmed) {
      startTransition(async () => {
        await approveUserKYC(id);
        await showAlert("Dokumen KTP berhasil disetujui.");
      });
    }
  };

  const handleReject = async (id: string) => {
    const reason = await showPrompt({
      title: "Tolak KYC",
      message:
        "Berikan alasan mengapa dokumen KTP ini ditolak agar user dapat memperbaikinya.",
      type: "danger",
      confirmText: "Tolak & Kirim Alasan",
      placeholder: "Contoh: Foto blur, nama KTP tidak sesuai dengan profil...",
    });

    if (reason !== null && reason.trim() !== "") {
      startTransition(async () => {
        await rejectUserKYC(id, reason);
        await showAlert("Dokumen KTP ditolak dan alasan terkirim.");
      });
    } else if (reason !== null && reason.trim() === "") {
      await showAlert({
        title: "Gagal",
        message: "Alasan penolakan tidak boleh kosong.",
        type: "danger",
      });
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {users.map((user) => (
          <div
            key={user.id}
            className="bg-card border border-card-border p-5 rounded-2xl shadow-lg relative overflow-hidden group"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-bold text-white text-lg leading-tight">
                  {user.name}
                </h3>
                <p className="text-xs text-foreground/60">{user.email}</p>
              </div>
              <div className="bg-primary/20 text-primary text-[10px] font-bold px-2 py-1 rounded-md border border-primary/30">
                PENDING
              </div>
            </div>

            <div className="bg-secondary rounded-xl p-3 mb-5 border border-card-border">
              <p className="text-xs text-foreground/60 mb-2 font-medium">
                Dokumen KTP:
              </p>
              <button
                onClick={() => setSelectedUser(user)}
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
                {isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <XCircle className="w-4 h-4" />
                )}
                Tolak
              </button>
              <button
                onClick={() => handleApprove(user.id)}
                disabled={isPending}
                className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2.5 rounded-xl text-sm font-bold transition-all shadow-[0_0_15px_rgba(34,197,94,0.3)] hover:shadow-[0_0_25px_rgba(34,197,94,0.5)] disabled:opacity-50 flex items-center justify-center gap-1.5"
              >
                {isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <CheckCircle2 className="w-4 h-4" />
                )}
                Setujui
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Image Preview Modal (Rendered via Portal to escape stacking context) */}
      {selectedUser &&
        mounted &&
        createPortal(
          <div
            className="fixed inset-0 z-[9999] p-4 bg-black/80 backdrop-blur-sm overflow-y-auto"
            onClick={() => setSelectedUser(null)}
          >
            <div className="min-h-full flex items-center justify-center py-8">
              <div
                className="relative max-w-5xl w-full flex flex-col md:flex-row gap-4"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setSelectedUser(null)}
                  className="absolute -top-12 right-0 md:-top-4 md:-right-12 w-10 h-10 bg-card rounded-full flex items-center justify-center text-white hover:bg-primary transition-colors border border-card-border z-10"
                >
                  <XCircle className="w-6 h-6" />
                </button>

                {/* KTP Document */}
                <div className="flex-1 bg-card border border-card-border p-2 rounded-2xl overflow-hidden flex items-center justify-center shadow-2xl relative min-h-[300px]">
                  <img
                    src={selectedUser.kycDocumentUrl}
                    alt="KTP Preview"
                    className="w-full h-auto max-h-[70vh] md:max-h-[85vh] object-contain rounded-xl"
                  />
                </div>

                {/* User Info Panel */}
                <div className="w-full md:w-80 shrink-0 bg-card border border-card-border p-6 rounded-2xl flex flex-col shadow-2xl h-fit">
                  <h3 className="font-bold text-white text-lg mb-6 border-b border-card-border pb-4">
                    Info Akun (Google)
                  </h3>

                  <div className="flex flex-col items-center mb-6">
                    <div className="w-24 h-24 rounded-xl border-4 border-secondary overflow-hidden bg-background mb-4 flex items-center justify-center relative">
                      {selectedUser.image ? (
                        <img
                          src={selectedUser.image}
                          alt={selectedUser.name}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <span className="text-4xl font-bold text-foreground/20">
                          {selectedUser.name?.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <h4 className="font-bold text-white text-xl text-center">
                      {selectedUser.name}
                    </h4>
                    <p className="text-sm text-foreground/60 text-center">
                      {selectedUser.email}
                    </p>
                    <div className="mt-2 bg-secondary text-foreground/60 text-xs px-3 py-1 rounded-full font-medium">
                      Bergabung:{" "}
                      {new Date(selectedUser.createdAt).toLocaleDateString(
                        "id-ID",
                      )}
                    </div>
                  </div>

                  <div className="mt-auto space-y-3 pt-6 border-t border-card-border">
                    <button
                      onClick={() => {
                        setSelectedUser(null);
                        handleReject(selectedUser.id);
                      }}
                      className="w-full bg-background border border-red-500/50 hover:bg-red-500/10 text-red-500 py-3 rounded-xl text-sm font-bold transition-colors flex items-center justify-center gap-2"
                    >
                      <XCircle className="w-4 h-4" /> Tolak KYC
                    </button>
                    <button
                      onClick={() => {
                        setSelectedUser(null);
                        handleApprove(selectedUser.id);
                      }}
                      className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl text-sm font-bold transition-all shadow-[0_0_15px_rgba(34,197,94,0.3)] flex items-center justify-center gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4" /> Setujui KTP
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
