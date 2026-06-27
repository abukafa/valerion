import { getAdminListings } from "@/modules/admin/actions";
import { ListingActions } from "./ListingActions";
import { ShoppingBag } from "lucide-react";

export default async function AdminListingsPage() {
  const listings = await getAdminListings();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div>
      <h1 className="text-3xl font-black text-white tracking-tight mb-2">Moderasi Akun Game</h1>
      <p className="text-foreground/60 mb-8">Awasi dan kelola semua postingan akun game yang dijual.</p>

      <div className="bg-card border border-card-border rounded-2xl overflow-hidden shadow-lg">
        <div className="p-4 border-b border-card-border flex items-center gap-3">
          <ShoppingBag className="w-5 h-5 text-green-500" />
          <h2 className="font-bold text-white">Daftar Akun ({listings.length})</h2>
        </div>
        
        {listings.length === 0 ? (
          <div className="p-10 text-center text-foreground/50">
            Belum ada akun yang dijual di Valerion.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-foreground/80">
              <thead className="bg-secondary/50 text-foreground uppercase border-b border-card-border text-[10px] tracking-wider">
                <tr>
                  <th className="px-6 py-4 font-bold">Game & Judul</th>
                  <th className="px-6 py-4 font-bold">Harga</th>
                  <th className="px-6 py-4 font-bold">Penjual</th>
                  <th className="px-6 py-4 font-bold">Status</th>
                  <th className="px-6 py-4 font-bold text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-card-border">
                {listings.map((listing) => (
                  <tr key={listing.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-white truncate max-w-[200px]">{listing.title}</div>
                      <div className="text-xs text-primary font-medium mt-1">{listing.gameName}</div>
                    </td>
                    <td className="px-6 py-4 font-medium text-white">{formatCurrency(listing.price)}</td>
                    <td className="px-6 py-4">
                      <div className="text-white font-medium">{listing.seller.name || "Anonim"}</div>
                      <div className="text-xs text-foreground/50">{listing.seller.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        listing.status === 'AVAILABLE' ? 'bg-green-500/20 text-green-500 border border-green-500/30' :
                        listing.status === 'REMOVED_BY_ADMIN' ? 'bg-red-500/20 text-red-500 border border-red-500/30' :
                        'bg-secondary text-foreground/60'
                      }`}>
                        {listing.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {listing.status !== 'REMOVED_BY_ADMIN' && (
                        <ListingActions listingId={listing.id} />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
