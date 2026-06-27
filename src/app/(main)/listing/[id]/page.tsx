import { getListingById } from "@/modules/listing/actions";
import { notFound } from "next/navigation";
import { ShoppingCart, MessageCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { ListingDetailCard } from "@/modules/listing/components/ListingDetailCard";

export default async function ListingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const listing = await getListingById(id);

  if (!listing) {
    return notFound();
  }

  const image = listing.images?.[0] || "/img/no-photo.jpg";

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 pb-24 md:pb-6">
      <Link
        href="/"
        className="inline-flex items-center text-primary hover:underline mb-6 text-sm font-medium"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Kembali ke Beranda
      </Link>

      <ListingDetailCard
        listing={listing}
        actionButtons={
          <>
            <button className="flex-1 bg-secondary hover:bg-secondary/80 text-white font-bold py-3 md:py-4 rounded-xl flex items-center justify-center gap-2 transition-colors border border-card-border shadow-md">
              <MessageCircle className="w-5 h-5" />
              Tanya
            </button>
            {listing.status === "SOLD" || listing.status === "SUSPENDED" ? (
              <button
                disabled
                className="flex-[2] bg-red-500/20 text-red-500 font-bold py-3 md:py-4 rounded-xl flex items-center justify-center gap-2 border border-red-500/30 cursor-not-allowed"
              >
                TERJUAL
              </button>
            ) : listing.isBooked ? (
              <button
                disabled
                className="flex-[2] bg-orange-500/20 text-orange-500 font-bold py-3 md:py-4 rounded-xl flex items-center justify-center gap-2 border border-orange-500/30 cursor-not-allowed"
              >
                DIPESAN (MENUNGGU PEMBAYARAN)
              </button>
            ) : (
              <Link
                href={`/checkout/${listing.id}`}
                className="flex-[2] bg-primary text-primary-foreground font-bold py-3 md:py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-primary/90 transition-all shadow-[0_0_15px_rgba(255,77,0,0.4)] hover:shadow-[0_0_25px_rgba(255,77,0,0.6)]"
              >
                <ShoppingCart className="w-5 h-5" />
                Beli Sekarang
              </Link>
            )}
          </>
        }
      />
    </div>
  );
}
