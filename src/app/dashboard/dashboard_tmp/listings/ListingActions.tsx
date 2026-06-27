"use client";

import { useTransition } from "react";
import { deleteListingByAdmin } from "@/modules/admin/actions";
import { Trash2, Loader2 } from "lucide-react";

export function ListingActions({ listingId }: { listingId: string }) {
  const [isPending, startTransition] = useTransition();

  const handleRemove = () => {
    if (confirm("Apakah Anda yakin ingin menghapus/men-takedown akun ini? Ini tidak bisa dikembalikan.")) {
      startTransition(async () => {
        await deleteListingByAdmin(listingId);
      });
    }
  };

  return (
    <button
      onClick={handleRemove}
      disabled={isPending}
      className="text-xs font-bold text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 px-3 py-1.5 rounded-lg transition-colors inline-flex items-center gap-1.5 disabled:opacity-50"
    >
      {isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
      Takedown
    </button>
  );
}
