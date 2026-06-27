import { getListingById } from "@/modules/listing/actions";
import { notFound, redirect } from "next/navigation";
import { ShieldCheck, ArrowLeft, CreditCard } from "lucide-react";
import Link from "next/link";
import { CheckoutForm } from "@/modules/transaction/components/CheckoutForm";
import { auth } from "@/auth";

export default async function CheckoutPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const { id } = await params;
  const listing = await getListingById(id);

  if (!listing) return notFound();

  if (listing.status === "SOLD") {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold text-red-500 mb-4">
          Maaf, Akun Sudah Terjual
        </h1>
        <p className="text-foreground/60 mb-8">
          Anda sedikit terlambat, akun ini baru saja dibeli oleh pengguna lain.
        </p>
        <Link
          href="/"
          className="bg-primary text-primary-foreground px-8 py-3 rounded-full font-bold hover:bg-primary/90 transition-colors"
        >
          Kembali ke Beranda
        </Link>
      </div>
    );
  }

  let images: string[] = [];
  try {
    images = Array.isArray(listing.images)
      ? listing.images
      : JSON.parse(listing.images as string);
  } catch (e) {
    images = typeof listing.images === "string" ? [listing.images] : [];
  }
  const image = images[0] || "/img/no-photo.jpg";

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 pb-24 md:pb-8">
      <Link
        href={`/listing/${id}`}
        className="inline-flex items-center text-primary hover:underline mb-8 text-sm font-medium transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Kembali ke Produk
      </Link>

      <h1 className="text-2xl md:text-3xl font-black text-white mb-8 border-b border-card-border pb-4">
        Checkout Pesanan
      </h1>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Order Summary */}
        <div className="flex flex-col gap-6">
          <div className="bg-card border border-card-border p-5 rounded-2xl shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-[100px] pointer-events-none"></div>
            <h3 className="text-lg font-bold text-white mb-4">
              Ringkasan Produk
            </h3>

            <div className="flex gap-4 items-center">
              <div className="w-20 h-20 rounded-lg overflow-hidden border border-card-border shrink-0">
                <img
                  src={image}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <div className="font-bold text-white leading-tight mb-1">
                  {listing.title}
                </div>
                <div className="text-xs text-foreground/60 mb-2">
                  Game: {listing.gameName}
                </div>
                <div className="font-bold text-primary text-lg">
                  Rp {listing.price.toLocaleString("id-ID")}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-card border border-card-border p-5 rounded-2xl shadow-lg">
            <h3 className="text-lg font-bold text-white mb-4">
              Informasi Penjual
            </h3>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center font-bold text-foreground text-xl overflow-hidden border-2 border-card-border">
                {listing.seller.image ? (
                  <img
                    src={listing.seller.image}
                    alt={listing.seller.name || "Seller"}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  listing.seller.name?.charAt(0).toUpperCase() || "U"
                )}
              </div>
              <div>
                <div className="font-bold text-white flex items-center gap-1 text-sm">
                  {listing.seller.name || "Unknown"}
                  {listing.seller.isVerified && (
                    <ShieldCheck className="w-4 h-4 text-green-500" />
                  )}
                </div>
                <div className="text-xs text-foreground/50">
                  {listing.seller.reputation} Poin Reputasi
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Summary */}
        <div className="bg-card border border-card-border p-6 rounded-2xl shadow-lg h-fit relative overflow-hidden">
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>

          <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-primary" />
            Rincian Pembayaran
          </h3>

          <div className="flex flex-col gap-3 text-sm mb-6 pb-6 border-b border-card-border/50">
            <div className="flex justify-between">
              <span className="text-foreground/70">Harga Akun</span>
              <span className="text-white font-semibold">
                Rp {listing.price.toLocaleString("id-ID")}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-foreground/70">Biaya Layanan (Escrow)</span>
              <span className="text-white font-semibold">Rp 5.000</span>
            </div>
          </div>

          <div className="flex justify-between items-center mb-8">
            <span className="text-foreground font-bold">Total Pembayaran</span>
            <span className="text-2xl font-black text-primary drop-shadow-[0_0_8px_rgba(255,77,0,0.4)]">
              Rp {(listing.price + 5000).toLocaleString("id-ID")}
            </span>
          </div>

          <CheckoutForm listingId={listing.id} />
        </div>
      </div>
    </div>
  );
}
