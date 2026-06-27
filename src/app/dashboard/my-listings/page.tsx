import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { PackageOpen, Plus } from "lucide-react";
import Link from "next/link";
import { getMyListings } from "@/modules/listing/actions";
import { MyListingsTable } from "./components/MyListingsTable";

export const metadata = {
  title: "Stok Dagangan - Valerion",
};

export default async function MyListingsPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const listings = await getMyListings();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <PackageOpen className="w-6 h-6 text-primary" />
            Stok Dagangan Saya
          </h1>
          <p className="text-foreground/60 text-sm">Kelola akun game yang Anda jual di Valerion.</p>
        </div>
        
        {listings.length > 0 && (
          <Link 
            href="/dashboard/my-listings/create" 
            className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-primary/90 transition-colors shadow-[0_0_15px_rgba(255,77,0,0.3)]"
          >
            <Plus className="w-4 h-4" />
            Tambah Baru
          </Link>
        )}
      </div>

      <MyListingsTable listings={listings} />
    </div>
  );
}
