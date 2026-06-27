"use client";

import { Package, Clock, ShieldCheck, CheckCircle2 } from "lucide-react";

export function SalesList({ sales }: { sales: any[] }) {
  if (sales.length === 0) {
    return (
      <div className="bg-card border border-card-border p-12 rounded-2xl text-center flex flex-col items-center">
        <Package className="w-16 h-16 text-foreground/20 mb-4" />
        <h3 className="text-xl font-bold text-white mb-2">Belum ada penjualan</h3>
        <p className="text-foreground/60 max-w-md mx-auto">
          Akun Anda belum ada yang terjual. Pastikan harga kompetitif dan deskripsi jelas untuk menarik pembeli!
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {sales.map((sale) => (
        <div key={sale.id} className="bg-card border border-card-border p-5 rounded-2xl flex flex-col md:flex-row gap-6 shadow-sm hover:border-primary/30 transition-colors">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                sale.status === "COMPLETED" ? "bg-green-500/10 text-green-500 border border-green-500/20" :
                sale.status === "PAID" ? "bg-blue-500/10 text-blue-500 border border-blue-500/20" :
                sale.status === "FAILED" ? "bg-red-500/10 text-red-500 border border-red-500/20" :
                "bg-orange-500/10 text-orange-500 border border-orange-500/20"
              }`}>
                {sale.status}
              </span>
              <span className="text-xs text-foreground/50">
                {new Date(sale.createdAt).toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric' })}
              </span>
            </div>

            <h3 className="text-lg font-bold text-white mb-1">{sale.listing.title}</h3>
            <p className="text-sm text-foreground/60 mb-4">Harga: Rp {sale.listing.price.toLocaleString("id-ID")}</p>

            <div className="bg-background rounded-xl p-3 flex items-center gap-3 w-max max-w-full">
              <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center font-bold text-foreground overflow-hidden">
                {sale.buyer?.image ? (
                  <img src={sale.buyer.image} alt={sale.buyer.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                ) : (
                  sale.buyer?.name?.charAt(0) || "U"
                )}
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-foreground/50">Pembeli:</span>
                <span className="text-sm font-bold text-white">{sale.buyer?.name || "Unknown"}</span>
                <span className="text-xs text-foreground/60">{sale.buyer?.email}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-center gap-3 min-w-[200px] border-t md:border-t-0 md:border-l border-card-border pt-4 md:pt-0 md:pl-6">
            {sale.status === "PENDING" && (
              <div className="flex flex-col items-center text-center p-3 bg-orange-500/5 rounded-xl border border-orange-500/10">
                <Clock className="w-6 h-6 text-orange-500 mb-2" />
                <span className="text-sm font-bold text-white">Menunggu Pembayaran</span>
                <span className="text-xs text-foreground/60">Pembeli sedang memproses</span>
              </div>
            )}

            {sale.status === "PAID" && (
              <div className="flex flex-col items-center text-center p-3 bg-blue-500/5 rounded-xl border border-blue-500/10">
                <ShieldCheck className="w-6 h-6 text-blue-500 mb-2" />
                <span className="text-sm font-bold text-white">Dana Diamankan Escrow</span>
                <span className="text-xs text-foreground/60 mt-1">
                  Hubungi pembeli di <span className="font-semibold text-white">{sale.buyer?.email}</span> untuk menyerahkan data akun.
                </span>
              </div>
            )}

            {sale.status === "COMPLETED" && (
              <div className="flex flex-col items-center text-center p-3 bg-green-500/5 rounded-xl border border-green-500/10">
                <CheckCircle2 className="w-6 h-6 text-green-500 mb-2" />
                <span className="text-sm font-bold text-white">Transaksi Selesai</span>
                <span className="text-xs text-green-400 font-bold mt-1">+10 Reputasi Ditambahkan!</span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
