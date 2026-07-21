import { useState } from "react";
import Link from "next/link";
import { Shield, MapPin, Truck } from "lucide-react";
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

  // Use relative image path served from backend or fallback placeholder
  const imageUrl =
    equipment.images && equipment.images.length > 0
      ? resolveImageUrl(equipment.images[0].imageUrl)
      : null;

  return (
    <Card className="overflow-hidden border bg-card text-card-foreground shadow-sm flex flex-col h-full hover:shadow-md transition-shadow">
      {/* Listing Cover Image */}
      <div className="relative aspect-video w-full bg-muted flex items-center justify-center overflow-hidden">
        {imageUrl && !imageError ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageUrl}
            alt={equipment.name}
            referrerPolicy="no-referrer"
            onError={() => setImageError(true)}
            className="object-cover w-full h-full hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="flex flex-col items-center justify-center space-y-1.5 p-4 text-center bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 w-full h-full">
            <Truck className="h-10 w-10 text-primary/70 animate-pulse" />
            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
              {equipment.categoryName || equipment.brand}
            </span>
          </div>
        )}
        <div className="absolute top-3 right-3">
          <StatusBadge status={equipment.availabilityStatus} />
        </div>
      </div>

      <CardHeader className="p-4 pb-2">
        <div className="flex items-center justify-between mb-1">
          <Badge variant="secondary" className="text-xs px-2 py-0.5 font-medium">
            {equipment.categoryName}
          </Badge>
          <span className="text-xs text-muted-foreground font-medium">
            Mfr. Year: {equipment.manufactureYear}
          </span>
        </div>
        <CardTitle className="text-lg font-bold leading-tight line-clamp-1">
          <Link href={`/equipment/${equipment.id}`} className="hover:text-primary transition-colors">
            {equipment.name}
          </Link>
        </CardTitle>
        <p className="text-xs text-muted-foreground font-semibold">
          {equipment.brand} • {equipment.model}
        </p>
      </CardHeader>

      <CardContent className="p-4 pt-0 pb-3 flex-1 flex flex-col justify-between">
        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed mb-3">
          {equipment.description}
        </p>
        <div className="space-y-2">
          <div className="flex items-center text-xs text-muted-foreground">
            <MapPin className="mr-1 h-3.5 w-3.5 text-primary/60 shrink-0" />
            <span className="truncate">{equipment.location}</span>
          </div>
          <div className="flex items-center text-xs text-muted-foreground">
            <Shield className="mr-1 h-3.5 w-3.5 text-primary/60 shrink-0" />
            <span className="truncate">Lessor: {equipment.ownerName}</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 border-t flex items-center justify-between mt-auto bg-muted/20">
        <div>
          <span className="text-lg font-bold text-primary">
            ₹{equipment.dailyRentalPrice.toLocaleString("en-IN")}
          </span>
          <span className="text-xs text-muted-foreground"> / day</span>
        </div>

        {showActions ? (
          <div className="flex space-x-2">
            {onEdit && (
              <Button size="sm" variant="outline" onClick={() => onEdit(equipment.id)}>
                Edit
              </Button>
            )}
            {onDelete && (
              <Button size="sm" variant="destructive" onClick={() => onDelete(equipment.id)}>
                Delete
              </Button>
            )}
          </div>
        ) : (
          <Button size="sm" asChild>
            <Link href={`/equipment/${equipment.id}`}>Details</Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
