"use client";

import { Building2, HardHat, Navigation, Truck } from "lucide-react";

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
    <div className={`p-3.5 rounded-xl bg-card border shadow-xs space-y-3 font-sans text-xs ${className}`}>
      <div className="flex items-center justify-between border-b border-border pb-2">
        <span className="font-extrabold text-[11px] uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center gap-1.5 font-heading">
          <Navigation className="w-3.5 h-3.5" /> 3-Way Transit & Jobsite Location Route
        </span>
        <div className="flex items-center space-x-2 text-[10px] text-muted-foreground">
          <span className="font-semibold text-emerald-600 dark:text-emerald-400">{estimatedDistanceKm} km Transit</span>
          <span>•</span>
          <span className="font-bold text-amber-600 dark:text-amber-400">Est. Freight: ₹{mobilizationCost.toLocaleString("en-IN")}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 relative">
        {/* Step 1: Machine Origin */}
        <div className="p-2.5 rounded-lg bg-muted/40 border border-amber-500/30 space-y-1">
          <div className="flex items-center text-[10px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider">
            <Truck className="w-3.5 h-3.5 mr-1" /> 1. Machine Depot / Origin
          </div>
          <p className="font-semibold text-foreground truncate text-xs" title={machineLocation}>
            {machineLocation}
          </p>
        </div>

        {/* Step 2: Customer Registered HQ */}
        <div className="p-2.5 rounded-lg bg-muted/40 border border-blue-500/30 space-y-1">
          <div className="flex items-center text-[10px] font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wider">
            <Building2 className="w-3.5 h-3.5 mr-1" /> 2. Lessee Corporate Location
          </div>
          <p className="font-semibold text-foreground truncate text-xs" title={customerLocation}>
            {customerLocation}
          </p>
        </div>

        {/* Step 3: Target Jobsite */}
        <div className="p-2.5 rounded-lg bg-muted/40 border border-emerald-500/30 space-y-1">
          <div className="flex items-center text-[10px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
            <HardHat className="w-3.5 h-3.5 mr-1" /> 3. Target Work Site Deployment
          </div>
          <p className="font-semibold text-foreground truncate text-xs" title={siteAddress}>
            {siteAddress}
          </p>
        </div>
      </div>
    </div>
  );
}
