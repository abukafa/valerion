import { getAdminStats } from "@/modules/admin/actions";
import { Users, ShoppingBag, CreditCard, ShieldAlert } from "lucide-react";
import Link from "next/link";

export default async function AdminOverviewPage() {
  const stats = await getAdminStats();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div>
      <h1 className="text-3xl font-black text-white tracking-tight mb-2">
        Dashboard
      </h1>
      <p className="text-foreground/60 mb-8">
        Pusat kendali aktivitas Valerion.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Metric Cards */}
        <div className="bg-card border border-card-border p-6 rounded-2xl shadow-lg relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Users className="w-16 h-16 text-blue-500" />
          </div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-500" />
            </div>
            <h3 className="font-bold text-foreground/80">Total Pengguna</h3>
          </div>
          <p className="text-3xl font-black text-white">{stats.totalUsers}</p>
        </div>

        <div className="bg-card border border-card-border p-6 rounded-2xl shadow-lg relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <ShoppingBag className="w-16 h-16 text-green-500" />
          </div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-green-500" />
            </div>
            <h3 className="font-bold text-foreground/80">Listing Aktif</h3>
          </div>
          <p className="text-3xl font-black text-white">
            {stats.totalListings}
          </p>
        </div>

        <div className="bg-card border border-card-border p-6 rounded-2xl shadow-lg relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <CreditCard className="w-16 h-16 text-primary" />
          </div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-primary" />
            </div>
            <h3 className="font-bold text-foreground/80">Volume Transaksi</h3>
          </div>
          <p className="text-2xl font-black text-white">
            {formatCurrency(stats.totalVolume)}
          </p>
          <p className="text-xs text-primary font-medium mt-1">
            Dari {stats.totalTransactions} transaksi
          </p>
        </div>

        <div className="bg-card border border-red-500/20 p-6 rounded-2xl shadow-[0_0_15px_rgba(239,68,68,0.1)] relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <ShieldAlert className="w-16 h-16 text-red-500" />
          </div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
              <ShieldAlert className="w-5 h-5 text-red-500" />
            </div>
            <h3 className="font-bold text-red-500">Antrean KYC</h3>
          </div>
          <p className="text-3xl font-black text-white">{stats.pendingKYC}</p>
          {stats.pendingKYC > 0 && (
            <Link
              href="/admin/users"
              className="text-xs text-red-400 hover:text-red-300 font-medium mt-2 inline-block underline"
            >
              Tinjau sekarang &rarr;
            </Link>
          )}
        </div>
      </div>

      {/* Warning/Alert if pending actions */}
      {stats.pendingKYC > 0 && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-red-400 mb-1 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5" />
              Perhatian: Ada {stats.pendingKYC} dokumen KTP menunggu verifikasi
            </h3>
            <p className="text-sm text-foreground/70">
              Pengguna tidak dapat mencairkan dana sebelum KTP diverifikasi.
            </p>
          </div>
          <Link
            href="/dashboard/admin/users"
            className="bg-red-500 hover:bg-red-600 text-white px-5 py-2.5 rounded-xl font-bold transition-colors whitespace-nowrap shadow-[0_0_15px_rgba(239,68,68,0.3)]"
          >
            Verifikasi KTP
          </Link>
        </div>
      )}
    </div>
  );
}
