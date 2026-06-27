"use client";

import { useState, useTransition } from "react";
import { deleteListingByAdmin } from "@/modules/admin/actions";
import { Trash2, Loader2 } from "lucide-react";
import { useDialog } from "@/components/ui/DialogProvider";

export function ListingActions({ listingId }: { listingId: string }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const { showConfirm, showAlert } = useDialog();

  const [isPending, startTransition] = useTransition();

  const handleDelete = async () => {
    const confirmed = await showConfirm({
      title: "Take-down Akun",
      message: "Apakah Anda yakin ingin menghapus/men-takedown akun ini? Ini tidak bisa dikembalikan.",
      type: "danger",
      confirmText: "Take-down"
    });
    
    if (confirmed) {
      setIsDeleting(true);
      startTransition(async () => {
        const res = await deleteListingByAdmin(listingId);
        if (!res.success) {
          await showAlert({
            title: "Gagal Menghapus",
            message: "Gagal menghapus postingan",
            type: "danger"
          });
        }
        setIsDeleting(false);
      });
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="text-xs font-bold text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 px-3 py-1.5 rounded-lg transition-colors inline-flex items-center gap-1.5 disabled:opacity-50"
    >
      {isDeleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
      Takedown
    </button>
  );
}
