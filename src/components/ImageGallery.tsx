"use client";

import { useState, useRef, MouseEvent } from "react";

interface ImageGalleryProps {
  images: string[];
  isPremium?: boolean;
}

export function ImageGallery({ images, isPremium }: ImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [zoomStyle, setZoomStyle] = useState({});
  const [isZooming, setIsZooming] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!imgRef.current) return;

    // Get bounding box of the container
    const { left, top, width, height } =
      e.currentTarget.getBoundingClientRect();

    // Calculate cursor position as a percentage (0 to 100)
    // We use e.clientX and e.clientY which represent viewport coordinates, just like getBoundingClientRect
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;

    setZoomStyle({
      transformOrigin: `${x}% ${y}%`,
      transform: "scale(2)", // Zoom level
    });
  };

  const mainImage = images[currentIndex] || "/img/no-photo.jpg";

  return (
    <div className="flex flex-col gap-4">
      {/* Main Image Cover */}
      <div
        className="rounded-2xl overflow-hidden border border-card-border bg-card shadow-lg aspect-square relative cursor-crosshair group"
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsZooming(true)}
        onMouseLeave={() => {
          setIsZooming(false);
          setZoomStyle({
            transformOrigin: "center center",
            transform: "scale(1)",
          });
        }}
      >
        <img
          ref={imgRef}
          src={mainImage}
          alt="Preview"
          className="w-full h-full object-contain bg-black/40 transition-transform duration-200 ease-out"
          style={
            isZooming
              ? zoomStyle
              : { transformOrigin: "center center", transform: "scale(1)" }
          }
        />

        {/* Premium Badge */}
        {isPremium && !isZooming && (
          <div className="absolute top-4 left-4 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full shadow-[0_0_10px_rgba(255,77,0,0.8)] pointer-events-none transition-opacity">
            PREMIUM
          </div>
        )}
      </div>

      {/* Thumbnails Picker */}
      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 m-1 transition-all shrink-0 ${
                currentIndex === idx
                  ? "border-primary shadow-[0_0_10px_rgba(255,77,0,0.5)] opacity-100 scale-105"
                  : "border-transparent opacity-50 hover:opacity-100 hover:scale-100"
              }`}
            >
              <img
                src={img}
                alt={`Thumbnail ${idx}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
