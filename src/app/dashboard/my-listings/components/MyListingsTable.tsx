"use client";

import { useState } from "react";
import Link from "next/link";
import { Edit, Trash2, Eye, Plus } from "lucide-react";
import { deleteListing } from "@/modules/listing/actions";
import { useDialog } from "@/components/ui/DialogProvider";

export function MyListingsTable({ listings }: { listings: any[] }) {
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const { showConfirm, showAlert } = useDialog();

  async function handleDelete(id: string) {
    const confirmed = await showConfirm({
      title: "Hapus Dagangan",
      message: "Apakah Anda yakin ingin menghapus dagangan ini? Data tidak bisa dikembalikan.",
      type: "danger",
      confirmText: "Hapus"
    });
    
    if (!confirmed) return;
    
    setIsDeleting(id);
    const result = await deleteListing(id);
    if (!result.success) {
      await showAlert({
        title: "Gagal Menghapus",
        message: result.error || "Terjadi kesalahan",
        type: "danger"
      });
    }
    setIsDeleting(null);
  }

  if (listings.length === 0) {
    return (
      <div className="bg-card border border-card-border p-8 rounded-2xl text-center shadow-lg relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-background to-background pointer-events-none" />
        <h2 className="text-xl font-bold text-white mb-2 relative z-10">Belum Ada Dagangan</h2>
        <p className="text-foreground/60 relative z-10 mb-6">
          Anda belum mengunggah akun game untuk dijual. Segera unggah dan mulai hasilkan uang!
        </p>
        <Link 
          href="/dashboard/my-listings/create" 
          className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-bold hover:bg-primary/90 transition-colors relative z-10"
        >
          <Plus className="w-5 h-5" />
          Tambah Dagangan Baru
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-card border border-card-border rounded-2xl shadow-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white/5 border-b border-card-border">
              <th className="p-4 text-xs font-bold text-foreground/50 uppercase tracking-wider">Gambar</th>
              <th className="p-4 text-xs font-bold text-foreground/50 uppercase tracking-wider">Info Akun</th>
              <th className="p-4 text-xs font-bold text-foreground/50 uppercase tracking-wider">Harga</th>
              <th className="p-4 text-xs font-bold text-foreground/50 uppercase tracking-wider">Status</th>
              <th className="p-4 text-xs font-bold text-foreground/50 uppercase tracking-wider text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-card-border">
            {listings.map((item) => (
              <tr key={item.id} className="hover:bg-white/[0.02] transition-colors">
                <td className="p-4">
                  <div className="w-16 h-12 bg-secondary rounded-lg overflow-hidden relative">
                    <img src={item.images?.[0]} alt={item.title} className="w-full h-full object-cover" />
                  </div>
                </td>
                <td className="p-4">
                  <p className="font-bold text-white text-sm line-clamp-1">{item.title}</p>
                  <p className="text-xs text-foreground/50">{item.gameName}</p>
                </td>
                <td className="p-4">
                  <p className="text-sm font-bold text-primary">Rp {item.price.toLocaleString('id-ID')}</p>
                </td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                    item.status === 'AVAILABLE' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-secondary text-foreground/50'
                  }`}>
                    {item.status}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <div className="flex justify-end gap-2">
                    <Link 
                      href={`/dashboard/my-listings/${item.id}`} 
                      className="p-2 bg-blue-500/10 text-blue-500 rounded-lg hover:bg-blue-500 hover:text-white transition-colors"
                      title="Lihat"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                    <Link 
                      href={`/dashboard/my-listings/${item.id}/edit`} 
                      className="p-2 bg-yellow-500/10 text-yellow-500 rounded-lg hover:bg-yellow-500 hover:text-white transition-colors"
                      title="Edit"
                    >
                      <Edit className="w-4 h-4" />
                    </Link>
                    <button 
                      onClick={() => handleDelete(item.id)}
                      disabled={isDeleting === item.id}
                      className="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-colors disabled:opacity-50"
                      title="Hapus"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
