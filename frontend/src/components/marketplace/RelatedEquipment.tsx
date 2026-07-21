import Link from "next/link";
import { MapPin, Truck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import StatusBadge from "../common/StatusBadge";
import { useRelatedEquipment } from "@/lib/api/marketplaceService";
import { resolveImageUrl } from "@/lib/utils";

interface RelatedEquipmentProps {
  equipmentId: number;
}

export default function RelatedEquipment({ equipmentId }: RelatedEquipmentProps) {
  const { data: related = [], isLoading } = useRelatedEquipment(equipmentId);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h3 className="text-xl font-bold tracking-tight">Similar Machinery</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 animate-pulse">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="border rounded-lg p-3 space-y-3">
              <div className="aspect-video bg-muted rounded" />
              <div className="h-4 bg-muted rounded w-2/3" />
              <div className="h-3 bg-muted rounded w-1/2" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (related.length === 0) {
    return null; // Don't show section if no related items found
  }

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold tracking-tight">Similar Machinery</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {related.map((item) => {
          const imageUrl =
            item.images && item.images.length > 0
              ? resolveImageUrl(item.images[0].imageUrl)
              : null;

          return (
            <Card key={item.id} className="overflow-hidden border shadow-sm flex flex-col h-full hover:shadow transition-shadow">
              {/* Cover Photo */}
              <div className="relative aspect-video w-full bg-muted flex items-center justify-center overflow-hidden">
                {imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={imageUrl}
                    alt={item.name}
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      // Remove broken image src and show fallback icon
                      e.currentTarget.style.display = "none";
                    }}
                    className="object-cover w-full h-full"
                  />
                ) : null}
                <Truck className="h-8 w-8 text-muted-foreground/60 absolute -z-0" />
                <div className="absolute top-2 right-2">
                  <StatusBadge status={item.availabilityStatus} />
                </div>
              </div>

              <CardHeader className="p-3 pb-1">
                <Badge variant="outline" className="text-[10px] w-fit font-medium">
                  {item.categoryName}
                </Badge>
                <CardTitle className="text-sm font-bold truncate mt-1">
                  <Link href={`/equipment/${item.id}`} className="hover:text-primary transition-colors">
                    {item.name}
                  </Link>
                </CardTitle>
              </CardHeader>

              <CardContent className="p-3 pt-0 pb-2 flex-1 flex flex-col justify-between">
                <div className="flex items-center text-[10px] text-muted-foreground mb-3">
                  <MapPin className="mr-0.5 h-3 w-3 text-primary/60 shrink-0" />
                  <span className="truncate">{item.location}</span>
                </div>
                
                <div className="flex items-center justify-between mt-auto border-t pt-2">
                  <div>
                    <span className="text-sm font-bold text-primary">
                      ₹{item.dailyRentalPrice.toLocaleString("en-IN")}
                    </span>
                    <span className="text-[10px] text-muted-foreground"> / day</span>
                  </div>
                  <Button size="xs" variant="outline" asChild className="h-7 text-xs">
                    <Link href={`/equipment/${item.id}`}>View</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
