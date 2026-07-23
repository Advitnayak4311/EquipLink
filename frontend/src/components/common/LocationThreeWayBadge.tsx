"use client";

import { MapPin, Building2, HardHat, ArrowRight, Navigation, Truck } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface LocationThreeWayBadgeProps {
  machineLocation?: string;
  customerLocation?: string;
  siteAddress?: string;
  estimatedDistanceKm?: number;
  mobilizationCost?: number;
  className?: string;
}

export default function LocationThreeWayBadge({
  machineLocation = "Regional Machine Yard",
  customerLocation = "Customer Corporate HQ",
  siteAddress = "Project Deployment Site",
  estimatedDistanceKm = 48,
  mobilizationCost = 5760,
  className = "",
}: LocationThreeWayBadgeProps) {
  return (
    <div className={`p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3 font-sans text-xs ${className}`}>
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <span className="font-extrabold text-[11px] uppercase tracking-wider text-amber-400 flex items-center gap-1.5 font-heading">
          <Navigation className="w-3.5 h-3.5" /> 3-Way Transit & Jobsite Location Route
        </span>
        <div className="flex items-center space-x-2 text-[10px] text-slate-300">
          <span className="font-semibold text-emerald-400">{estimatedDistanceKm} km Transit</span>
          <span>•</span>
          <span className="font-bold text-amber-400">Est. Freight: ₹{mobilizationCost.toLocaleString("en-IN")}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 relative">
        {/* Step 1: Machine Origin */}
        <div className="p-2.5 rounded-lg bg-slate-950/80 border border-amber-500/20 space-y-1">
          <div className="flex items-center text-[10px] font-bold text-amber-400 uppercase tracking-wider">
            <Truck className="w-3 h-3 mr-1" /> 1. Machine Depot / Origin
          </div>
          <p className="font-semibold text-slate-200 truncate" title={machineLocation}>
            {machineLocation}
          </p>
        </div>

        {/* Step 2: Customer Registered HQ */}
        <div className="p-2.5 rounded-lg bg-slate-950/80 border border-blue-500/20 space-y-1">
          <div className="flex items-center text-[10px] font-bold text-blue-400 uppercase tracking-wider">
            <Building2 className="w-3 h-3 mr-1" /> 2. Lessee Corporate Location
          </div>
          <p className="font-semibold text-slate-200 truncate" title={customerLocation}>
            {customerLocation}
          </p>
        </div>

        {/* Step 3: Target Jobsite */}
        <div className="p-2.5 rounded-lg bg-slate-950/80 border border-emerald-500/20 space-y-1">
          <div className="flex items-center text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
            <HardHat className="w-3 h-3 mr-1" /> 3. Target Work Site Deployment
          </div>
          <p className="font-semibold text-slate-200 truncate" title={siteAddress}>
            {siteAddress}
          </p>
        </div>
      </div>
    </div>
  );
}
