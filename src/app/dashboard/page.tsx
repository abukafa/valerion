import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { CreditCard, PackageOpen, ShoppingBag } from "lucide-react";

import { getUserDashboardStats } from "@/modules/users/actions";

export default async function DashboardOverview() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const userStats = await getUserDashboardStats();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Halo, {session.user.name?.split(" ")[0] || "User"}!</h1>
          <p className="text-foreground/60 text-sm">Berikut adalah ringkasan aktivitas akun Anda.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1 */}
        <div className="bg-card border border-card-border p-5 rounded-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-2xl -mr-10 -mt-10 transition-colors group-hover:bg-primary/10" />
          <div className="flex justify-between items-start relative z-10">
            <div>
              <p className="text-xs font-bold text-foreground/50 uppercase tracking-wider mb-1">Total Penjualan</p>
              <h3 className="text-2xl font-black text-white">Rp {userStats.totalPenjualan.toLocaleString('id-ID')}</h3>
            </div>
            <div className="p-2.5 bg-primary/10 rounded-xl border border-primary/20 text-primary">
              <CreditCard className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-card border border-card-border p-5 rounded-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl -mr-10 -mt-10 transition-colors group-hover:bg-blue-500/10" />
          <div className="flex justify-between items-start relative z-10">
            <div>
              <p className="text-xs font-bold text-foreground/50 uppercase tracking-wider mb-1">Total Pembelian</p>
              <h3 className="text-2xl font-black text-white">Rp {userStats.totalPembelian.toLocaleString('id-ID')}</h3>
            </div>
            <div className="p-2.5 bg-blue-500/10 rounded-xl border border-blue-500/20 text-blue-500">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-card border border-card-border p-5 rounded-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-green-500/5 rounded-full blur-2xl -mr-10 -mt-10 transition-colors group-hover:bg-green-500/10" />
          <div className="flex justify-between items-start relative z-10">
            <div>
              <p className="text-xs font-bold text-foreground/50 uppercase tracking-wider mb-1">Stok Aktif</p>
              <h3 className="text-2xl font-black text-white">{userStats.aktifListings} Akun</h3>
            </div>
            <div className="p-2.5 bg-green-500/10 rounded-xl border border-green-500/20 text-green-500">
              <PackageOpen className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>

      {/* Info Notice */}
      <div className="bg-secondary/30 border border-card-border rounded-2xl p-6">
        <h3 className="text-lg font-bold text-white mb-2">Pusat Aktivitas Anda</h3>
        <p className="text-sm text-foreground/70 mb-4">
          Kelola stok dagangan Anda atau unggah KTP untuk mendapatkan status *Verified Seller* agar pembeli lebih percaya.
        </p>
      </div>
    </div>
  );
}
