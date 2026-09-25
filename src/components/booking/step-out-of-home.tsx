import { Home, UserX, AlertCircle, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

interface StepOutOfHomeProps {
  isOutOfHome: boolean;
  onIsOutOfHomeChange: (isOut: boolean) => void;
  bagConfirmed: boolean;
  onBagConfirmedChange: (confirmed: boolean) => void;
  address: string;
  onAddressChange: (addr: string) => void;
  notes: string;
  onNotesChange: (notes: string) => void;
}

export function StepOutOfHome({
  isOutOfHome,
  onIsOutOfHomeChange,
  bagConfirmed,
  onBagConfirmedChange,
  address,
  onAddressChange,
  notes,
  onNotesChange,
}: StepOutOfHomeProps) {
  return (
    <div className="space-y-4 p-5 rounded-2xl bg-white border border-slate-200">
      {/* Pickup Address */}
      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
          <MapPin className="h-3.5 w-3.5 text-rose-500" />
          Pickup &amp; Delivery Address
        </label>
        <input
          type="text"
          placeholder="e.g. 742 Evergreen Terrace, Apt 4B, Springfield"
          value={address}
          onChange={(e) => onAddressChange(e.target.value)}
          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
          required
        />
      </div>

      {/* Presence Radio: Home vs Away */}
      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
          Will you be home during the pickup window?
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => onIsOutOfHomeChange(false)}
            className={cn(
              "p-3 rounded-xl border-2 text-left flex items-center gap-3 transition-colors",
              !isOutOfHome
                ? "border-sky-600 bg-sky-50/60 ring-2 ring-sky-500/20"
                : "border-slate-200 bg-white hover:bg-slate-50"
            )}
          >
            <div className="p-2 rounded-lg bg-sky-100 text-sky-700">
              <Home className="h-4 w-4" />
            </div>
            <div>
              <span className="font-bold text-sm text-slate-900 block">Yes, I will be Home</span>
              <span className="text-[11px] text-slate-500">Driver rings bell upon arrival</span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => onIsOutOfHomeChange(true)}
            className={cn(
              "p-3 rounded-xl border-2 text-left flex items-center gap-3 transition-colors",
              isOutOfHome
                ? "border-sky-600 bg-sky-50/60 ring-2 ring-sky-500/20"
                : "border-slate-200 bg-white hover:bg-slate-50"
            )}
          >
            <div className="p-2 rounded-lg bg-amber-100 text-amber-700">
              <UserX className="h-4 w-4" />
            </div>
            <div>
              <span className="font-bold text-sm text-slate-900 block">No, I will be Away</span>
              <span className="text-[11px] text-slate-500">Contactless doorstep pickup</span>
            </div>
          </button>
        </div>
      </div>

      {/* Mandatory Doorstep Confirmation if Away */}
      {isOutOfHome && (
        <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 animate-in fade-in">
          <label className="flex items-start gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={bagConfirmed}
              onChange={(e) => onBagConfirmedChange(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded text-sky-600 focus:ring-sky-500 border-slate-300"
            />
            <div className="text-xs text-amber-900 leading-relaxed">
              <span className="font-bold flex items-center gap-1">
                <AlertCircle className="h-3.5 w-3.5 text-amber-600 shrink-0" />
                Required Doorstep Confirmation:
              </span>
              I confirm that my laundry bag(s) are placed securely outside my front door / porch for pickup.
            </div>
          </label>
        </div>
      )}

      {/* Special Instructions */}
      <div>
        <label className="block text-xs font-semibold text-slate-600 mb-1">
          Special Pickup Instructions (Optional)
        </label>
        <textarea
          rows={2}
          placeholder="e.g. Gate code #1234, leave clean bags behind the planter."
          value={notes}
          onChange={(e) => onNotesChange(e.target.value)}
          className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
        />
      </div>
    </div>
  );
}
