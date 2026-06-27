"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useState } from "react";

export function HeroBanner() {
  const [isHovered, setIsHovered] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 150 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);

  // Background moves slightly opposite to mouse
  const bgX = useTransform(smoothMouseX, [-0.5, 0.5], ["-3%", "3%"]);
  const bgY = useTransform(smoothMouseY, [-0.5, 0.5], ["-3%", "3%"]);

  // Text moves slightly with mouse (creating parallax depth)
  const textX = useTransform(smoothMouseX, [-0.5, 0.5], ["3%", "-3%"]);
  const textY = useTransform(smoothMouseY, [-0.5, 0.5], ["3%", "-3%"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <section className="w-full md:pt-6 px-4 md:px-0">
      <div
        className="w-full h-48 md:h-[300px] rounded-2xl overflow-hidden relative cursor-pointer mt-4 md:mt-0 shadow-lg shadow-black/80 border border-card-border"
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
      >
        {/* Brick Background with Parallax Slide */}
        <motion.div
          className="absolute -inset-6 bg-[url('https://images.unsplash.com/photo-1511556820780-d912e42b4980?q=80&w=1200')] bg-cover bg-center"
          style={{ x: bgX, y: bgY }}
          animate={{ scale: isHovered ? 1.05 : 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />

        {/* Dark Purple/Blue Tint Overlay to match image */}
        <div className="absolute inset-0 bg-[#0f0426]/90 mix-blend-multiply pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/80 pointer-events-none" />

        {/* Neon Text Container with Parallax and Hover Zoom */}
        <motion.div
          className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
          style={{ x: textX, y: textY }}
          animate={{ scale: isHovered ? 1.05 : 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="relative flex flex-col items-center">
            {/* VALERION Neon Text (Outline Orange/Red) */}
            <h1
              className="text-5xl md:text-8xl font-black tracking-widest text-transparent"
              style={{
                WebkitTextStroke: "2px #ff4d00",
                textShadow:
                  "0 0 5px #ffffffbb, 0 0 15px #ff4d00, 0 0 30px #ff4d00, 0 0 60px #ff0000, 0 0 100px #ff0000, 0 0 150px #ff0000",
              }}
            >
              VALERION
            </h1>

            {/* marketplace Neon Text (Solid Cyan Cursive) */}
            <h2
              className="text-3xl md:text-5xl absolute -bottom-4 md:-bottom-8 right-0 md:right-8 text-[#00e5ff] z-10"
              style={{
                fontFamily: "'Brush Script MT', 'Dancing Script', cursive",
                textShadow:
                  "0 0 5px #fff, 0 0 15px #00e5ff, 0 0 30px #00e5ff, 0 0 60px #0099ff, 0 0 100px #0055ff, 0 0 150px #0055ff",
                transform: "rotate(-5deg)",
              }}
            >
              Marketplace
            </h2>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
