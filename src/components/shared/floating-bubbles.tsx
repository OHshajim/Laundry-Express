"use client";

import * as React from "react";

interface BubbleConfig {
  size: number;
  left: string;
  dur: string;
  del: string;
  drift: string;
  cls: string;
}

interface FloatingBubblesProps {
  variant?: "hero" | "banner" | "subtle" | "footer";
  count?: number;
  className?: string;
}

/**
 * Bubble Presets:
 * 70% Bubble Pink / Foam tones + 30% Bubble Sky Blue
 * Micro depth bubbles (layered behind) + medium and large foreground soap bubbles
 */
const HERO_BUBBLES: BubbleConfig[] = [
  { size: 52, left: "4%", dur: "14s", del: "0s", drift: "30px", cls: "bubble-soap bubble-drift" },
  { size: 22, left: "16%", dur: "9s", del: "2.2s", drift: "-20px", cls: "bubble-micro" },
  { size: 38, left: "30%", dur: "12s", del: "0.8s", drift: "26px", cls: "bubble-foam" },
  { size: 16, left: "52%", dur: "8s", del: "3.5s", drift: "-14px", cls: "bubble-micro" },
  { size: 46, left: "68%", dur: "13s", del: "1.5s", drift: "34px", cls: "bubble-soap" },
  { size: 28, left: "82%", dur: "10s", del: "0.3s", drift: "-24px", cls: "bubble-foam bubble-drift" },
  { size: 14, left: "93%", dur: "7s", del: "4.2s", drift: "12px", cls: "bubble-micro" },
  { size: 60, left: "88%", dur: "15s", del: "1.0s", drift: "-30px", cls: "bubble-soap" },
  { size: 20, left: "38%", dur: "8.5s", del: "2.8s", drift: "18px", cls: "bubble-micro" },
  { size: 32, left: "74%", dur: "11s", del: "0.5s", drift: "-22px", cls: "bubble-foam" },
];

const BANNER_BUBBLES: BubbleConfig[] = [
  { size: 42, left: "6%", dur: "12s", del: "0s", drift: "28px", cls: "bubble-soap bubble-drift" },
  { size: 18, left: "24%", dur: "8.5s", del: "1.8s", drift: "-16px", cls: "bubble-micro" },
  { size: 50, left: "76%", dur: "14s", del: "0.8s", drift: "32px", cls: "bubble-soap" },
  { size: 26, left: "88%", dur: "9.5s", del: "2.5s", drift: "-22px", cls: "bubble-foam bubble-drift" },
  { size: 14, left: "50%", dur: "7.5s", del: "3.2s", drift: "14px", cls: "bubble-micro" },
];

const FOOTER_BUBBLES: BubbleConfig[] = [
  { size: 40, left: "8%", dur: "13s", del: "0s", drift: "26px", cls: "bubble-soap" },
  { size: 18, left: "22%", dur: "9s", del: "2.1s", drift: "-18px", cls: "bubble-micro" },
  { size: 34, left: "45%", dur: "11s", del: "1.2s", drift: "20px", cls: "bubble-foam bubble-drift" },
  { size: 52, left: "72%", dur: "14s", del: "0.4s", drift: "-28px", cls: "bubble-soap" },
  { size: 22, left: "86%", dur: "9.5s", del: "2.8s", drift: "18px", cls: "bubble-micro" },
  { size: 30, left: "94%", dur: "10s", del: "1.5s", drift: "-16px", cls: "bubble-foam" },
];

/**
 * FloatingBubbles Component
 *
 * Ambient bubble physics with rise, drift, wobble, and depth parallax.
 * Strictly adheres to 100-250 lines rule.
 */
export function FloatingBubbles({
  variant = "hero",
  count,
  className = "",
}: FloatingBubblesProps) {
  let bubbles = HERO_BUBBLES;
  if (variant === "banner") bubbles = BANNER_BUBBLES;
  else if (variant === "footer") bubbles = FOOTER_BUBBLES;

  const displayList = typeof count === "number" ? bubbles.slice(0, count) : bubbles;

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden select-none z-0 bubble-container ${className}`}
    >
      {displayList.map((b, i) => (
        <div
          key={i}
          className={`bubble ${b.cls}`}
          style={
            {
              width: `${b.size}px`,
              height: `${b.size}px`,
              left: b.left,
              bottom: "-40px",
              "--dur": b.dur,
              "--del": b.del,
              "--drift": b.drift,
            } as React.CSSProperties
          }
        >
          {/* Specular curved highlights for larger soap bubbles */}
          {!b.cls.includes("bubble-micro") && (
            <>
              <div
                aria-hidden="true"
                className="absolute top-[16%] left-[20%] w-[28%] h-[20%] rounded-full bg-white/75 -rotate-45"
              />
              <div
                aria-hidden="true"
                className="absolute bottom-[18%] right-[22%] w-[15%] h-[12%] rounded-full bg-white/35"
              />
            </>
          )}
        </div>
      ))}
    </div>
  );
}

export default FloatingBubbles;
