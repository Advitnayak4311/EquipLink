import { useState } from "react";
import Link from "next/link";
import { ShieldCheck, MapPin, Truck, ArrowRight, Zap, Fuel, Sparkles } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import StatusBadge from "./StatusBadge";
import { EquipmentSummary } from "@/lib/api/equipmentService";
import { resolveImageUrl } from "@/lib/utils";

interface EquipmentCardProps {
  equipment: EquipmentSummary;
  showActions?: boolean;
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
}

export default function EquipmentCard({
  equipment,
  showActions = false,
  onEdit,
  onDelete,
}: EquipmentCardProps) {
  const [imageError, setImageError] = useState(false);

  // Determine power drive system (Electric vs Diesel vs Hybrid)
  const isElectric =
    equipment.powerType === "ELECTRIC" ||
    equipment.name.toLowerCase().includes("electric") ||
    equipment.description?.toLowerCase().includes("electric") ||
    equipment.description?.toLowerCase().includes("ev ");

  const isHybrid = equipment.powerType === "HYBRID" || equipment.name.toLowerCase().includes("hybrid");

  const imageUrl =
    equipment.images && equipment.images.length > 0
      ? resolveImageUrl(equipment.images[0].imageUrl)
      : null;

  return (
    <Card className="overflow-hidden border border-slate-200 dark:border-slate-800 bg-card text-card-foreground shadow-sm flex flex-col h-full hover:shadow-xl hover:border-amber-500/40 transition-all duration-300 group font-sans">
      {/* Listing Cover Image */}
      <div className="relative aspect-video w-full bg-slate-900 flex items-center justify-center overflow-hidden">
        {imageUrl && !imageError ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageUrl}
            alt={equipment.name}
            referrerPolicy="no-referrer"
            onError={() => setImageError(true)}
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="flex flex-col items-center justify-center space-y-2 p-4 text-center bg-gradient-to-br from-slate-900 to-slate-950 text-slate-100 w-full h-full relative">
            <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 group-hover:scale-110 transition-transform">
              <Truck className="h-8 w-8" />
            </div>
            <span className="text-[11px] font-black text-amber-400 uppercase tracking-widest font-heading">
              {equipment.categoryName || equipment.brand}
            </span>
          </div>
        )}

        {/* Top Floating Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1">
          {isElectric ? (
            <Badge className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-[10px] uppercase tracking-wider shadow-md">
              <Zap className="w-3 h-3 mr-1 inline" /> 100% Zero-Emission EV
            </Badge>
          ) : isHybrid ? (
            <Badge className="bg-purple-600 text-white font-bold text-[10px] uppercase tracking-wider shadow-md">
              <Sparkles className="w-3 h-3 mr-1 inline" /> Hybrid Eco-Drive
            </Badge>
          ) : (
            <Badge className="bg-slate-800/90 text-slate-200 border-slate-700 font-semibold text-[10px]">
              <Fuel className="w-3 h-3 mr-1 inline text-amber-400" /> Diesel Drive
            </Badge>
          )}
        </div>

        <div className="absolute top-3 right-3 shadow-md">
          <StatusBadge status={equipment.availabilityStatus} />
        </div>
      </div>

      <CardHeader className="p-4 pb-2">
        <div className="flex items-center justify-between mb-1.5">
          <Badge variant="outline" className="text-[11px] px-2 py-0.5 font-bold border-amber-500/30 text-amber-600 dark:text-amber-400 bg-amber-500/5">
            {equipment.categoryName}
          </Badge>
          <span className="text-[11px] text-muted-foreground font-semibold">
            Mfr: {equipment.manufactureYear}
          </span>
        </div>
        <CardTitle className="text-base font-extrabold leading-snug line-clamp-1 font-heading group-hover:text-amber-500 transition-colors">
          <Link href={`/equipment/${equipment.id}`}>
            {equipment.name}
          </Link>
        </CardTitle>
        <p className="text-xs text-muted-foreground font-semibold">
          {equipment.brand} • {equipment.model}
        </p>
      </CardHeader>

      <CardContent className="p-4 pt-0 pb-3 flex-1 flex flex-col justify-between">
        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed mb-3">
          {equipment.description}
        </p>
        <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center text-xs text-muted-foreground font-medium">
            <MapPin className="mr-1.5 h-3.5 w-3.5 text-amber-500 shrink-0" />
            <span className="truncate">{equipment.location}</span>
          </div>
          <div className="flex items-center text-xs text-muted-foreground font-medium">
            <ShieldCheck className="mr-1.5 h-3.5 w-3.5 text-emerald-500 shrink-0" />
            <span className="truncate">Lessor: {equipment.ownerName}</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-3 border-t flex items-center justify-between mt-auto bg-muted/20">
        <div>
          <span className="text-lg font-black text-amber-600 dark:text-amber-400 font-heading">
            ₹{equipment.dailyRentalPrice.toLocaleString("en-IN")}
          </span>
          <span className="text-xs text-muted-foreground font-medium"> / day</span>
        </div>

        {showActions ? (
          <div className="flex space-x-2">
            {onEdit && (
              <Button size="sm" variant="outline" onClick={() => onEdit(equipment.id)} className="font-bold text-xs">
                Edit
              </Button>
            )}
            {onDelete && (
              <Button size="sm" variant="destructive" onClick={() => onDelete(equipment.id)} className="font-bold text-xs">
                Delete
              </Button>
            )}
          </div>
        ) : (
          <Button size="sm" className="font-extrabold bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs shadow-md" asChild>
            <Link href={`/equipment/${equipment.id}`} className="flex items-center">
              Inspect <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
