"use client";

import * as React from "react";

interface BubbleConfig {
  id: number;
  size: number;
  top: string;
  left: string;
  animClass: string;
  dur: string;
  delay: string;
  type: "soap" | "foam" | "sky" | "micro";
}

interface FloatingBubblesProps {
  variant?: "hero" | "banner" | "subtle" | "footer";
  count?: number;
  className?: string;
}

// 70% Bubble Pink / Foam tones + 30% Bubble Sky Blue, with micro-bubbles (6px-14px)
const ALL_BUBBLES: BubbleConfig[] = [
  // Micro depth bubbles (layered behind)
  { id: 101, size: 8, top: "12%", left: "18%", animClass: "animate-bubble-slow", dur: "9s", delay: "0.2s", type: "micro" },
  { id: 102, size: 12, top: "42%", left: "28%", animClass: "animate-bubble-fast", dur: "8.5s", delay: "1.5s", type: "micro" },
  { id: 103, size: 10, top: "68%", left: "84%", animClass: "animate-bubble-slow", dur: "9.2s", delay: "0.8s", type: "micro" },
  { id: 104, size: 14, top: "28%", left: "62%", animClass: "animate-bubble-fast", dur: "8s", delay: "2.1s", type: "micro" },
  { id: 105, size: 7, top: "82%", left: "42%", animClass: "animate-bubble-slow", dur: "9.5s", delay: "1.1s", type: "micro" },

  // Medium & large foreground bubbles (Parallax: larger rise faster = shorter duration)
  { id: 1, size: 84, top: "10%", left: "6%", animClass: "animate-bubble-wobble", dur: "4.5s", delay: "0s", type: "soap" },
  { id: 2, size: 44, top: "32%", left: "12%", animClass: "animate-bubble-fast", dur: "6.8s", delay: "1.2s", type: "foam" },
  { id: 3, size: 96, top: "15%", left: "82%", animClass: "animate-bubble-wobble", dur: "4.0s", delay: "0.5s", type: "soap" },
  { id: 4, size: 48, top: "62%", left: "88%", animClass: "animate-bubble-slow", dur: "6.5s", delay: "2.1s", type: "sky" },
  { id: 5, size: 36, top: "76%", left: "8%", animClass: "animate-bubble-fast", dur: "7.2s", delay: "1.8s", type: "foam" },
  { id: 6, size: 68, top: "68%", left: "70%", animClass: "animate-bubble-wobble", dur: "5.2s", delay: "2.8s", type: "soap" },
  { id: 7, size: 28, top: "24%", left: "46%", animClass: "animate-bubble-fast", dur: "7.8s", delay: "0.9s", type: "sky" },
  { id: 8, size: 54, top: "45%", left: "92%", animClass: "animate-bubble-slow", dur: "5.8s", delay: "1.4s", type: "foam" },
];

const FOOTER_BUBBLES: BubbleConfig[] = [
  { id: 201, size: 10, top: "20%", left: "15%", animClass: "animate-bubble-slow", dur: "9s", delay: "0.4s", type: "micro" },
  { id: 202, size: 12, top: "60%", left: "75%", animClass: "animate-bubble-fast", dur: "8.5s", delay: "1.1s", type: "micro" },
  { id: 203, size: 48, top: "25%", left: "8%", animClass: "animate-bubble-slow", dur: "6.5s", delay: "0s", type: "soap" },
  { id: 204, size: 32, top: "50%", left: "25%", animClass: "animate-bubble-fast", dur: "7.5s", delay: "1.5s", type: "foam" },
  { id: 205, size: 60, top: "18%", left: "85%", animClass: "animate-bubble-wobble", dur: "5.5s", delay: "0.8s", type: "sky" },
  { id: 206, size: 36, top: "65%", left: "90%", animClass: "animate-bubble-slow", dur: "7.2s", delay: "2.2s", type: "soap" },
  { id: 207, size: 26, top: "40%", left: "55%", animClass: "animate-bubble-fast", dur: "8.0s", delay: "1.7s", type: "foam" },
  { id: 208, size: 52, top: "70%", left: "40%", animClass: "animate-bubble-wobble", dur: "6.0s", delay: "2.9s", type: "soap" },
];

const BANNER_BUBBLES: BubbleConfig[] = [
  { id: 301, size: 10, top: "25%", left: "30%", animClass: "animate-bubble-slow", dur: "9s", delay: "0.5s", type: "micro" },
  { id: 302, size: 42, top: "15%", left: "5%", animClass: "animate-bubble-slow", dur: "6.8s", delay: "0s", type: "soap" },
  { id: 303, size: 30, top: "62%", left: "20%", animClass: "animate-bubble-fast", dur: "7.5s", delay: "1.4s", type: "sky" },
  { id: 304, size: 56, top: "22%", left: "80%", animClass: "animate-bubble-wobble", dur: "5.6s", delay: "0.7s", type: "foam" },
  { id: 305, size: 36, top: "58%", left: "92%", animClass: "animate-bubble-slow", dur: "7.2s", delay: "2.0s", type: "soap" },
];

/**
 * FloatingBubbles Component
 *
 * Pink-primary theme ambient soap bubble background.
 * - 70% Bubble Pink / Foam, 30% Bubble Sky Blue.
 * - .bubble-micro layered behind larger foreground bubbles.
 * - Inverse size-to-duration parallax motion (larger bubbles rise faster).
 * - Honors prefers-reduced-motion and mobile bubble count caps.
 */
export function FloatingBubbles({ variant = "hero", count, className = "" }: FloatingBubblesProps) {
  let source = ALL_BUBBLES;
  if (variant === "footer") source = FOOTER_BUBBLES;
  else if (variant === "banner") source = BANNER_BUBBLES;

  const displayBubbles = typeof count === "number" ? source.slice(0, count) : source;

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden select-none z-0 bubble-container ${className}`}
    >
      {displayBubbles.map((b) => {
        let typeClass = "bubble-soap";
        if (b.type === "foam") typeClass = "bubble-foam";
        else if (b.type === "sky") typeClass = "bubble-sky";
        else if (b.type === "micro") typeClass = "bubble-micro";

        return (
          <div
            key={b.id}
            className={`absolute rounded-full shadow-xs ${typeClass} ${b.animClass}`}
            style={{
              width: `${b.size}px`,
              height: `${b.size}px`,
              top: b.top,
              left: b.left,
              animationDuration: b.dur,
              animationDelay: b.delay,
            }}
          >
            {b.type !== "micro" && (
              <>
                {/* Specular curved glint highlight */}
                <div className="absolute top-[18%] left-[22%] w-[26%] h-[20%] rounded-full bg-white/80 -rotate-45" />
                {/* Secondary micro-reflection */}
                <div className="absolute bottom-[20%] right-[22%] w-[16%] h-[12%] rounded-full bg-white/40" />
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default FloatingBubbles;
