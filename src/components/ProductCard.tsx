import { Heart, Eye } from "lucide-react";
import Link from "next/link";

interface ProductCardProps {
  id: string;
  code: string;
  originalPrice: number;
  discountPrice: number;
  views: number;
  likes: number;
  image: string;
  isFlashSale?: boolean;
  status?: string;
  isBooked?: boolean;
}

export function ProductCard({ id, code, originalPrice, discountPrice, views, likes, image, isFlashSale, status = "AVAILABLE", isBooked = false }: ProductCardProps) {
  const isSold = status === "SOLD" || status === "SUSPENDED";
  const isUnavailable = isSold || isBooked;

  return (
    <Link 
      href={isUnavailable ? "#" : `/listing/${id}`}
      className={`bg-card border border-card-border rounded-xl overflow-hidden block group relative shadow-md min-w-[160px] md:min-w-[200px] w-full ${isUnavailable ? 'opacity-60 cursor-not-allowed' : 'hover:border-primary/50 transition-all'}`}
      onClick={(e) => isUnavailable && e.preventDefault()}
    >
      {/* Flash Sale Badge */}
      {isFlashSale && (
        <div className="absolute top-2 left-2 z-10 bg-primary text-primary-foreground text-[10px] md:text-xs font-bold px-2 py-1 rounded-full shadow-md">
          Flash Sale
        </div>
      )}
      
      {/* Like Button */}
      <button className="absolute top-2 right-2 z-10 bg-background/60 backdrop-blur-md p-1.5 rounded-full text-foreground/70 hover:text-red-500 transition-colors shadow-sm">
        <Heart className="w-3.5 h-3.5" />
      </button>

      {/* Image */}
      <div className="relative aspect-square w-full bg-secondary overflow-hidden">
        <img 
          src={image} 
          alt={code} 
          className={`object-cover w-full h-full transition-transform duration-300 ${!isUnavailable && 'group-hover:scale-105'} ${isUnavailable && 'grayscale'}`}
        />
        
        {/* Overlays */}
        {isSold && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-20">
            <span className="bg-red-600 text-white font-black px-4 py-2 text-xl md:text-2xl -rotate-12 border-2 border-white rounded shadow-xl uppercase tracking-widest">
              SOLD OUT
            </span>
          </div>
        )}
        {!isSold && isBooked && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-20">
            <span className="bg-orange-500 text-white font-black px-3 py-1.5 text-lg md:text-xl -rotate-12 border-2 border-white rounded shadow-xl uppercase tracking-widest">
              BOOKED
            </span>
          </div>
        )}
      </div>

      {/* Details */}
      <div className="p-3 flex flex-col flex-1">
        <h4 className="font-bold text-sm mb-2">{code}</h4>
        
        <div className="mt-auto">
          <div className="text-[10px] md:text-xs text-foreground/50 line-through mb-0.5">
            Rp {originalPrice.toLocaleString('id-ID')}
          </div>
          <div className="text-primary font-bold text-sm md:text-lg mb-3">
            Rp {discountPrice.toLocaleString('id-ID')}
          </div>
          
          <div className="flex items-center gap-2 md:gap-3 text-[10px] text-foreground/60 mb-3">
            <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> {views}x dilihat</span>
            <span className="flex items-center gap-1"><Heart className="w-3 h-3" /> {likes}x disukai</span>
          </div>
          
          <button 
            disabled={isUnavailable}
            className="w-full bg-primary text-primary-foreground font-bold py-2 rounded-lg text-xs md:text-sm hover:bg-primary/90 transition-colors shadow-[0_0_15px_rgba(255,77,0,0.5)] hover:shadow-[0_0_25px_rgba(255,77,0,0.8)] disabled:opacity-50 disabled:shadow-none"
          >
            {isSold ? "Terjual" : isBooked ? "Dipesan" : "Lihat Detail"}
          </button>
        </div>
      </div>
    </Link>
  );
}
