import * as React from "react";
import Link from "next/link";
import { Sparkles, Leaf, Shield, ThermometerSnowflake, Wind, Check, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const DETERGENTS = [
  {
    name: "Tide Original Power Pods",
    badge: "Most Popular",
    type: "Deep Stain Defense",
    icon: Sparkles,
    desc: "Targeted 3-in-1 stain removal, brightener, and fabric protector for gym clothes, denim, and daily cottons.",
    idealFor: "Activewear, work clothes, tough stains",
  },
  {
    name: "Seventh Generation Eco-Plant",
    badge: "100% Eco-Friendly",
    type: "Plant-Based Formula",
    icon: Leaf,
    desc: "Bio-based botanical enzymes that clean effectively without phosphates, chlorine, or artificial dyes.",
    idealFor: "Organic cottons, eco-conscious households",
  },
  {
    name: "All Free & Clear Fragrance-Free",
    badge: "Dermatologist Tested",
    type: "Hypoallergenic",
    icon: Shield,
    desc: "#1 brand recommended by pediatricians and allergists. Completely odorless, zero irritants, safe for newborns.",
    idealFor: "Baby clothes, eczema, sensitive skin",
  },
];

const FABRIC_PILLARS = [
  {
    icon: ThermometerSnowflake,
    title: "Temperature Customized",
    desc: "Cold wash cycles protect garment colors and elasticity, while warm sanitize cycles eliminate bacteria.",
  },
  {
    icon: Wind,
    title: "Low-Heat Tumble Drying",
    desc: "Controlled heat cycles preserve delicate fibers, preventing shrinking, pilling, or thermal damage.",
  },
];

export function FabricCareSection() {
  return (
    <section className="py-16 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <Badge variant="outline" className="mb-3 text-sky-700 bg-sky-50 border-sky-200">
            Fabric Science &amp; Detergent Choice
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            You Pick Your Wash. We Perfect the Result.
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-600">
            Never settle for generic commercial laundry powders. You choose the exact detergent formula for your clothes at checkout.
          </p>
        </div>

        {/* 3 Detergents Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {DETERGENTS.map((det) => {
            const Icon = det.icon;
            return (
              <div
                key={det.name}
                className="bg-slate-50/70 rounded-2xl p-6 border border-slate-200 hover:border-sky-300 hover:bg-sky-50/20 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="h-10 w-10 rounded-xl bg-white border border-sky-100 flex items-center justify-center text-sky-600 shadow-xs">
                      <Icon className="h-5 w-5" />
                    </div>
                    <Badge variant="secondary" className="text-[10px]">
                      {det.badge}
                    </Badge>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 mb-1">{det.name}</h3>
                  <p className="text-xs font-semibold text-sky-600 mb-2">{det.type}</p>
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">{det.desc}</p>
                </div>

                <div className="pt-3 border-t border-slate-200/60">
                  <p className="text-[11px] text-slate-500 font-medium">
                    <span className="font-bold text-slate-700">Ideal for: </span>
                    {det.idealFor}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Pillars Strip & Action */}
        <div className="bg-gradient-to-r from-sky-500 to-blue-600 rounded-3xl p-6 sm:p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl shadow-sky-500/15">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl">
            {FABRIC_PILLARS.map((p) => {
              const Icon = p.icon;
              return (
                <div key={p.title} className="flex items-start gap-3">
                  <div className="h-9 w-9 rounded-lg bg-white/20 backdrop-blur-xs flex items-center justify-center text-white shrink-0">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold">{p.title}</h4>
                    <p className="text-xs text-white/85 mt-0.5">{p.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <Link href="/order" className="shrink-0 w-full sm:w-auto">
            <Button size="lg" className="w-full sm:w-auto bg-white text-sky-700 hover:bg-sky-50 font-bold shadow-md">
              <span>Choose Your Detergent</span>
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
