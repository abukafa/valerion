"use client";

import { motion } from "framer-motion";
import { ProductCard } from "@/components/ProductCard";
import { HeroBanner } from "@/components/HeroBanner";
import { Zap, Store, ShoppingCart, UploadCloud, Home } from "lucide-react";
import { useState, useEffect, useRef } from "react";

export default function HomePage() {
  const carouselRef = useRef<HTMLDivElement>(null);

  // Auto Slide Carousel Effect
  useEffect(() => {
    const interval = setInterval(() => {
      if (carouselRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
        if (scrollLeft + clientWidth >= scrollWidth - 10) {
          carouselRef.current.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          carouselRef.current.scrollBy({ left: 216, behavior: "smooth" });
        }
      }
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Countdown Timer Effect
  const [timeLeft, setTimeLeft] = useState({
    days: 4,
    hours: 23,
    minutes: 32,
    seconds: 33,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        let { days, hours, minutes, seconds } = prev;
        if (seconds > 0) {
          seconds--;
        } else {
          seconds = 59;
          if (minutes > 0) {
            minutes--;
          } else {
            minutes = 59;
            if (hours > 0) {
              hours--;
            } else {
              hours = 23;
              if (days > 0) {
                days--;
              }
            }
          }
        }
        return { days, hours, minutes, seconds };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Dummy data
  const flashSaleItems = [
    {
      id: "1",
      code: "Code-2562",
      originalPrice: 580000,
      discountPrice: 380000,
      views: 24,
      likes: 3,
      image:
        "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=500&q=80",
    },
    {
      id: "2",
      code: "Code-2573",
      originalPrice: 550000,
      discountPrice: 350000,
      views: 56,
      likes: 0,
      image:
        "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=500&q=80",
    },
    {
      id: "3",
      code: "Code-2580",
      originalPrice: 750000,
      discountPrice: 450000,
      views: 12,
      likes: 1,
      image:
        "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=500&q=80",
    },
    {
      id: "4",
      code: "Code-2562",
      originalPrice: 580000,
      discountPrice: 380000,
      views: 24,
      likes: 3,
      image:
        "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=500&q=80",
    },
    {
      id: "5",
      code: "Code-2573",
      originalPrice: 550000,
      discountPrice: 350000,
      views: 56,
      likes: 0,
      image:
        "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=500&q=80",
    },
    {
      id: "6",
      code: "Code-2580",
      originalPrice: 750000,
      discountPrice: 450000,
      views: 12,
      likes: 1,
      image:
        "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=500&q=80",
    },
  ];

  const allProducts = [
    {
      id: "101",
      code: "Code-2350",
      originalPrice: 437000,
      discountPrice: 350000,
      views: 261,
      likes: 0,
      image:
        "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=500&q=80",
    },
    {
      id: "102",
      code: "Code-2510",
      originalPrice: 2062000,
      discountPrice: 1650000,
      views: 152,
      likes: 0,
      image:
        "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=500&q=80",
    },
    {
      id: "103",
      code: "Code-2516",
      originalPrice: 2401000,
      discountPrice: 1985000,
      views: 137,
      likes: 0,
      image:
        "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=500&q=80",
    },
    {
      id: "105",
      code: "Code-2142",
      originalPrice: 1200000,
      discountPrice: 900000,
      views: 88,
      likes: 2,
      image:
        "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=500&q=80",
    },
    {
      id: "106",
      code: "Code-2597",
      originalPrice: 3200000,
      discountPrice: 2800000,
      views: 412,
      likes: 15,
      image:
        "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=500&q=80",
    },
    {
      id: "107",
      code: "Code-2601",
      originalPrice: 850000,
      discountPrice: 700000,
      views: 19,
      likes: 1,
      image:
        "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=500&q=80",
    },
    {
      id: "108",
      code: "Code-2142",
      originalPrice: 1200000,
      discountPrice: 900000,
      views: 88,
      likes: 2,
      image:
        "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=500&q=80",
    },
    {
      id: "109",
      code: "Code-2597",
      originalPrice: 3200000,
      discountPrice: 2800000,
      views: 412,
      likes: 15,
      image:
        "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=500&q=80",
    },
    {
      id: "110",
      code: "Code-2601",
      originalPrice: 850000,
      discountPrice: 700000,
      views: 19,
      likes: 1,
      image:
        "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=500&q=80",
    },
  ];

  return (
    <div className="flex flex-col pb-10 max-w-5xl mx-auto">
      {/* Banner Section */}
      <HeroBanner />

      {/* 4 Action Cards */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 px-4 md:px-0 mt-6">
        <button className="bg-card border border-card-border hover:border-primary/50 transition-all p-3 md:p-4 rounded-xl flex items-center gap-3 text-left shadow-md group">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-primary/20 group-hover:bg-primary/30 flex items-center justify-center text-primary shrink-0 transition-colors">
            <Home className="w-5 h-5 md:w-6 md:h-6" />
          </div>
          <div>
            <div className="font-bold text-sm md:text-base text-white">
              Beranda Akun
            </div>
            <div className="text-[10px] md:text-xs text-foreground/50">
              Lihat semua akun yang tersedia
            </div>
          </div>
        </button>

        <button className="bg-card border border-card-border hover:border-primary/50 transition-all p-3 md:p-4 rounded-xl flex items-center gap-3 text-left shadow-md group">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-primary/20 group-hover:bg-primary/30 flex items-center justify-center text-primary shrink-0 transition-colors">
            <ShoppingCart className="w-5 h-5 md:w-6 md:h-6" />
          </div>
          <div>
            <div className="font-bold text-sm md:text-base text-white">
              Keranjang
            </div>
            <div className="text-[10px] md:text-xs text-foreground/50">
              Cek akun yang sudah dipilih
            </div>
          </div>
        </button>

        <button className="bg-card border border-card-border hover:border-primary/50 transition-all p-3 md:p-4 rounded-xl flex items-center gap-3 text-left shadow-md group">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-primary/20 group-hover:bg-primary/30 flex items-center justify-center text-primary shrink-0 transition-colors">
            <UploadCloud className="w-5 h-5 md:w-6 md:h-6" />
          </div>
          <div>
            <div className="font-bold text-sm md:text-base text-white">
              Post Akun
            </div>
            <div className="text-[10px] md:text-xs text-foreground/50">
              Jual akun kamu di sini
            </div>
          </div>
        </button>

        <button className="bg-card border border-card-border hover:border-primary/50 transition-all p-3 md:p-4 rounded-xl flex items-center gap-3 text-left shadow-md group">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-primary/20 group-hover:bg-primary/30 flex items-center justify-center text-primary shrink-0 transition-colors">
            <Zap className="w-5 h-5 md:w-6 md:h-6" />
          </div>
          <div>
            <div className="font-bold text-sm md:text-base text-white">
              Top Up
            </div>
            <div className="text-[10px] md:text-xs text-foreground/50">
              Kembali ke layanan top up
            </div>
          </div>
        </button>
      </section>

      {/* Flash Sale Section */}
      <section className="mt-8 px-4 md:px-6 py-4 md:py-6 bg-card border border-card-border rounded-2xl mx-4 md:mx-0 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary text-primary-foreground flex items-center justify-center">
              <Zap className="w-6 h-6 fill-current" />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white">
                Flash Sale
              </h2>
              <p className="text-xs text-foreground/60 mt-0.5">
                Harga spesial, stok terbatas, jangan sampai kehabisan.
              </p>
            </div>
          </div>

          {/* Countdown */}
          <div className="flex gap-2">
            <div className="bg-background border border-card-border px-3 py-2 rounded-lg text-center min-w-[60px] shadow-inner">
              <div className="text-lg font-bold text-white">{String(timeLeft.days).padStart(2, '0')}</div>
              <div className="text-[9px] text-foreground/50 font-medium">
                DAYS
              </div>
            </div>
            <div className="bg-background border border-card-border px-3 py-2 rounded-lg text-center min-w-[60px] shadow-inner">
              <div className="text-lg font-bold text-white">{String(timeLeft.hours).padStart(2, '0')}</div>
              <div className="text-[9px] text-foreground/50 font-medium">
                HOURS
              </div>
            </div>
            <div className="bg-background border border-card-border px-3 py-2 rounded-lg text-center min-w-[60px] shadow-inner">
              <div className="text-lg font-bold text-white">{String(timeLeft.minutes).padStart(2, '0')}</div>
              <div className="text-[9px] text-foreground/50 font-medium">
                MINUTES
              </div>
            </div>
            <div className="bg-background border border-card-border px-3 py-2 rounded-lg text-center min-w-[60px] shadow-inner">
              <div className="text-lg font-bold text-white">{String(timeLeft.seconds).padStart(2, '0')}</div>
              <div className="text-[9px] text-foreground/50 font-medium">
                SECONDS
              </div>
            </div>
          </div>
        </div>

        {/* Carousel */}
        <div 
          ref={carouselRef}
          className="flex overflow-x-auto gap-4 pb-4 no-scrollbar -mx-4 px-4 md:mx-0 md:px-0 snap-x scroll-smooth"
        >
          {flashSaleItems.map((item) => (
            <div
              key={item.id}
              className="w-[160px] md:w-[200px] shrink-0 snap-start"
            >
              <ProductCard {...item} isFlashSale={true} />
            </div>
          ))}
        </div>
      </section>

      {/* All Products Grid */}
      <section className="mt-8 px-4 md:px-6 py-4 md:py-6 bg-card border border-card-border rounded-2xl mx-4 md:mx-0 shadow-lg">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-md bg-accent text-accent-foreground flex items-center justify-center">
              <Store className="w-4 h-4 fill-current" />
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-white">
              Akun Populer
            </h2>
          </div>
          <button className="text-sm text-primary hover:underline font-medium">
            Lihat Semua
          </button>
        </div>

        <p className="text-sm text-foreground/60 mb-6">
          Daftar akun paling populer dan banyak diminati!
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {allProducts.map((item) => (
            <ProductCard key={item.id} {...item} />
          ))}
        </div>
      </section>
    </div>
  );
}
