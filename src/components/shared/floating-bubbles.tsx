"use client";

import * as React from "react";

interface BubbleConfig {
  id: number;
  size: number;
  top: string;
  left: string;
  animClass: string;
  delay: string;
  opacity: string;
  colorClass: string;
}

interface FloatingBubblesProps {
  variant?: "hero" | "banner" | "subtle";
  className?: string;
}

const HERO_BUBBLES: BubbleConfig[] = [
  {
    id: 1,
    size: 72,
    top: "10%",
    left: "6%",
    animClass: "animate-bubble-slow",
    delay: "0s",
    opacity: "opacity-60",
    colorClass: "from-[#B9E1F5]/50 to-[#1E88C7]/20 border-white/60",
  },
  {
    id: 2,
    size: 40,
    top: "35%",
    left: "14%",
    animClass: "animate-bubble-fast",
    delay: "1.2s",
    opacity: "opacity-50",
    colorClass: "from-[#FFFFFF]/70 to-[#B9E1F5]/40 border-white/80",
  },
  {
    id: 3,
    size: 96,
    top: "18%",
    left: "82%",
    animClass: "animate-bubble-wobble",
    delay: "0.5s",
    opacity: "opacity-45",
    colorClass: "from-[#B9E1F5]/60 to-[#1E88C7]/30 border-white/70",
  },
  {
    id: 4,
    size: 48,
    top: "65%",
    left: "88%",
    animClass: "animate-bubble-slow",
    delay: "2.1s",
    opacity: "opacity-55",
    colorClass: "from-[#FFFFFF]/80 to-[#B9E1F5]/30 border-white/60",
  },
  {
    id: 5,
    size: 32,
    top: "78%",
    left: "8%",
    animClass: "animate-bubble-fast",
    delay: "1.8s",
    opacity: "opacity-40",
    colorClass: "from-[#F5A623]/20 to-[#B9E1F5]/40 border-white/50",
  },
  {
    id: 6,
    size: 56,
    top: "70%",
    left: "72%",
    animClass: "animate-bubble-wobble",
    delay: "3s",
    opacity: "opacity-50",
    colorClass: "from-[#E91E63]/15 to-[#B9E1F5]/40 border-white/60",
  },
  {
    id: 7,
    size: 24,
    top: "22%",
    left: "48%",
    animClass: "animate-bubble-fast",
    delay: "0.8s",
    opacity: "opacity-35",
    colorClass: "from-white/90 to-[#B9E1F5]/40 border-white/80",
  },
];

const BANNER_BUBBLES: BubbleConfig[] = [
  {
    id: 1,
    size: 44,
    top: "15%",
    left: "4%",
    animClass: "animate-bubble-slow",
    delay: "0s",
    opacity: "opacity-45",
    colorClass: "from-[#B9E1F5]/50 to-[#1E88C7]/20 border-white/50",
  },
  {
    id: 2,
    size: 28,
    top: "60%",
    left: "22%",
    animClass: "animate-bubble-fast",
    delay: "1.5s",
    opacity: "opacity-40",
    colorClass: "from-white/70 to-[#B9E1F5]/30 border-white/60",
  },
  {
    id: 3,
    size: 52,
    top: "25%",
    left: "78%",
    animClass: "animate-bubble-wobble",
    delay: "0.7s",
    opacity: "opacity-45",
    colorClass: "from-[#B9E1F5]/50 to-[#E91E63]/15 border-white/50",
  },
  {
    id: 4,
    size: 34,
    top: "55%",
    left: "92%",
    animClass: "animate-bubble-slow",
    delay: "2.3s",
    opacity: "opacity-40",
    colorClass: "from-white/80 to-[#B9E1F5]/40 border-white/60",
  },
];

/**
 * FloatingBubbles Component
 *
 * Lightweight, GPU-accelerated ambient floating soap bubbles.
 * Inspired by the "Bubble Hero" brand mascot with glistening highlights.
 * Pure CSS animations ensuring zero impact on SEO and Core Web Vitals.
 */
export function FloatingBubbles({ variant = "hero", className = "" }: FloatingBubblesProps) {
  const bubbles = variant === "banner" ? BANNER_BUBBLES : HERO_BUBBLES;

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden select-none z-0 ${className}`}
    >
      {bubbles.map((b) => (
        <div
          key={b.id}
          className={`absolute rounded-full bg-gradient-to-br border shadow-xs backdrop-blur-[1px] ${b.animClass} ${b.opacity} ${b.colorClass}`}
          style={{
            width: `${b.size}px`,
            height: `${b.size}px`,
            top: b.top,
            left: b.left,
            animationDelay: b.delay,
          }}
        >
          {/* Glossy Top-Left Specular Light Highlight */}
          <div className="absolute top-[18%] left-[22%] w-[25%] h-[20%] rounded-full bg-white/70 -rotate-45" />
          {/* Secondary micro-sheen */}
          <div className="absolute bottom-[20%] right-[22%] w-[15%] h-[12%] rounded-full bg-white/30" />
        </div>
      ))}
    </div>
  );
}

export default FloatingBubbles;
