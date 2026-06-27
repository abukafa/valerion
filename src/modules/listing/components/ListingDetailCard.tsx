import { ShieldCheck, Star } from "lucide-react";
import { ImageGallery } from "@/components/ImageGallery";

interface ListingDetailCardProps {
  listing: any;
  actionButtons?: React.ReactNode;
}

export function ListingDetailCard({ listing, actionButtons }: ListingDetailCardProps) {
  const images = listing.images || ["https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&q=80"];

  return (
    <div className="grid md:grid-cols-2 gap-8">
      {/* Left: Interactive Image Gallery */}
      <ImageGallery images={images} isPremium={listing.isPremium} />

      {/* Right: Details */}
      <div className="flex flex-col">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">{listing.title}</h1>
          {listing.originalPrice && (
            <div className="text-sm md:text-base text-foreground/50 line-through mb-1 font-bold">
              Rp {listing.originalPrice.toLocaleString("id-ID")}
            </div>
          )}
          <div className="text-3xl font-black text-primary drop-shadow-[0_0_8px_rgba(255,77,0,0.5)]">
            Rp {listing.price.toLocaleString("id-ID")}
          </div>
        </div>

        <div className="bg-card border border-card-border rounded-xl p-4 mb-6 shadow-md hover:border-primary/30 transition-colors">
          <h3 className="text-sm font-bold text-white mb-3">Informasi Penjual</h3>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center text-xl font-bold text-foreground overflow-hidden border-2 border-card-border relative">
                {listing.seller?.image ? (
                  <img 
                    src={listing.seller.image} 
                    alt={listing.seller.name || "Seller"} 
                    className="w-full h-full object-cover" 
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  listing.seller?.name?.charAt(0) || "U"
                )}
              </div>
              <div>
                <div className="font-bold text-white flex items-center gap-1">
                  {listing.seller?.name || "Unknown Seller"}
                  {listing.seller?.isVerified && (
                    <ShieldCheck className="w-4 h-4 text-green-500" />
                  )}
                </div>
                <div className="flex items-center text-xs text-foreground/70 mt-1">
                  <Star className="w-3 h-3 text-yellow-500 fill-current mr-1" />
                  {listing.seller?.reputation || 0} Poin Reputasi
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-8 flex-1">
          <h3 className="text-lg font-bold text-white mb-2">Deskripsi Akun</h3>
          <div className="bg-secondary/50 rounded-xl p-4 border border-card-border text-sm text-foreground/80 leading-relaxed shadow-inner whitespace-pre-wrap">
            {listing.description}
            
            <div className="mt-4 pt-4 border-t border-card-border/50 flex flex-col gap-2 text-xs">
              <div className="flex justify-between items-center p-2 hover:bg-card rounded-md transition-colors">
                <span className="text-foreground/50">Game</span>
                <span className="font-semibold text-white">{listing.gameName}</span>
              </div>
              <div className="flex justify-between items-center p-2 hover:bg-card rounded-md transition-colors">
                <span className="text-foreground/50">Status</span>
                <span className="font-semibold text-green-400">{listing.status}</span>
              </div>
              <div className="flex justify-between items-center p-2 hover:bg-card rounded-md transition-colors">
                <span className="text-foreground/50">Diposting pada</span>
                <span className="font-semibold text-white">{new Date(listing.createdAt).toLocaleDateString("id-ID")}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        {actionButtons && (
          <div className="flex gap-3 mt-auto">
            {actionButtons}
          </div>
        )}
      </div>
    </div>
  );
}
