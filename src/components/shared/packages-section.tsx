import Link from "next/link";
import { Package, Check, Zap, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";

export function PackagesSection() {
  const packages = [
    {
      id: "pkg-1",
      title: "Superhero 5-Bag Saver Bundle",
      tagline: "Best value for individuals & couples",
      price: 65.0,
      originalPrice: 85.0,
      bags: 5,
      delivery: "FREE Delivery on all 5 pickups",
      features: [
        "5 Pre-paid standard wash & fold bags",
        "100% FREE pickup & delivery on every bag",
        "Choice of premium or hypoallergenic detergent",
        "Pickup & drop-off photo proof included",
        "Valid for 60 days from purchase",
      ],
      isFeatured: true,
    },
    {
      id: "pkg-2",
      title: "Monthly Family 25KG Plan",
      tagline: "Heavy-duty monthly household solution",
      price: 55.0,
      originalPrice: 70.0,
      bags: 0,
      delivery: "FREE Delivery on all monthly batches",
      features: [
        "25KG monthly laundry allowance",
        "Precision scale weight verification",
        "Bedding, towels, and clothing included",
        "Flexible 8am-12pm or 1pm-6pm scheduling",
        "Unused KG rolls over for 30 days",
      ],
      isFeatured: false,
    },
  ];

  return (
    <section id="packages" className="py-20 bg-white scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-100 text-sky-800 text-xs font-bold mb-3">
            <Package className="h-3.5 w-3.5 text-sky-600" />
            <span>Pre-Paid Bundles &amp; Saver Tiers</span>
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl">
            Save Up to 25% with Superhero Packages
          </h2>
          <p className="text-sm text-slate-600 mt-3 leading-relaxed">
            Eliminate laundry day stress. Pre-pay for laundry bags or monthly bulk kilograms at discounted rates with guaranteed zero delivery fees.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className={`rounded-3xl p-8 border-2 flex flex-col justify-between transition-all duration-200 relative ${
                pkg.isFeatured
                  ? "border-sky-500 bg-sky-50/40 shadow-xl ring-2 ring-sky-500/20"
                  : "border-slate-200 bg-white shadow-sm hover:border-slate-300"
              }`}
            >
              {pkg.isFeatured && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-sky-600 to-rose-500 text-white text-xs font-bold shadow-md flex items-center gap-1.5">
                  <Zap className="h-3.5 w-3.5 fill-current" />
                  Most Popular Saver
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">{pkg.title}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">{pkg.tagline}</p>
                  </div>
                  <div className="p-3 rounded-2xl bg-white border border-slate-200 shadow-xs">
                    <Package className="h-6 w-6 text-sky-600" />
                  </div>
                </div>

                <div className="flex items-baseline gap-2 mb-6">
                  <span className="text-4xl font-black text-slate-900">{formatCurrency(pkg.price)}</span>
                  <span className="text-sm text-slate-400 line-through">
                    {formatCurrency(pkg.originalPrice)}
                  </span>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    Save {formatCurrency(pkg.originalPrice - pkg.price)}
                  </span>
                </div>

                <ul className="space-y-3 text-xs text-slate-700 border-t border-slate-100 pt-6">
                  {pkg.features.map((feat, idx) => (
                    <li key={idx} className="flex items-center gap-2.5">
                      <span className="h-4 w-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                        <Check className="h-3 w-3 stroke-[3]" />
                      </span>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-100">
                <Link href="#book-now" className="block w-full">
                  <Button
                    variant={pkg.isFeatured ? "hero" : "primary"}
                    size="lg"
                    className="w-full"
                  >
                    Select {pkg.title.split(" ")[0]} Package
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
