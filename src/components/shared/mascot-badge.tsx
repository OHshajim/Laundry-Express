import Image from "next/image";
import { Sparkles, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface MascotBadgeProps {
  size?: "sm" | "md" | "lg";
  withSpeech?: boolean;
  speechText?: string;
  className?: string;
}

export function MascotBadge({
  size = "md",
  withSpeech = false,
  speechText = "⚡ 2+ Bags = Free Superhero Delivery!",
  className,
}: MascotBadgeProps) {
  const dimensions = {
    sm: { width: 44, height: 44, container: "w-11 h-11" },
    md: { width: 72, height: 72, container: "w-18 h-18" },
    lg: { width: 120, height: 120, container: "w-30 h-30" },
  };

  return (
    <div className={cn("inline-flex items-center gap-3", className)}>
      <div className="relative group">
        {/* Glowing halo behind mascot */}
        <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-sky-400 to-rose-400 opacity-30 blur-md group-hover:opacity-60 transition duration-300" />

        <div
          className={cn(
            "relative rounded-full overflow-hidden border-2 border-white shadow-md bg-white flex items-center justify-center",
            dimensions[size].container
          )}
        >
          <Image
            src="/brand/mascot-bubble-hero.jpg"
            alt="Laundry Express Bubble Superhero Mascot"
            width={dimensions[size].width}
            height={dimensions[size].height}
            className="object-cover transform group-hover:scale-105 transition duration-300"
            priority
          />
        </div>
      </div>

      {withSpeech && (
        <div className="relative bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-2xl rounded-tl-sm border border-sky-100 shadow-sm text-xs font-semibold text-slate-800 flex items-center gap-1.5 animate-in fade-in duration-300">
          <Zap className="h-3.5 w-3.5 text-rose-500 fill-rose-500 shrink-0" />
          <span>{speechText}</span>
          <Sparkles className="h-3 w-3 text-amber-500 shrink-0" />
        </div>
      )}
    </div>
  );
}
