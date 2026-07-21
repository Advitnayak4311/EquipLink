import { EquipmentSummary } from "@/lib/api/equipmentService";
import EquipmentCard from "./EquipmentCard";
import { Truck } from "lucide-react";

interface EquipmentGridProps {
  items?: EquipmentSummary[];
  isLoading: boolean;
  emptyMessage?: string;
  showActions?: boolean;
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
}

export default function EquipmentGrid({
  items = [],
  isLoading,
  emptyMessage = "No equipment listings found.",
  showActions = false,
  onEdit,
  onDelete,
}: EquipmentGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="border rounded-xl p-4 space-y-4 animate-pulse">
            <div className="aspect-video bg-muted rounded-lg" />
            <div className="space-y-2">
              <div className="h-4 bg-muted rounded w-2/3" />
              <div className="h-3 bg-muted rounded w-1/2" />
            </div>
            <div className="pt-4 flex items-center justify-between border-t">
              <div className="h-6 bg-muted rounded w-1/3" />
              <div className="h-8 bg-muted rounded w-1/4" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-card rounded-xl border border-dashed text-center">
        <Truck className="h-12 w-12 text-muted-foreground/60 mb-3 animate-bounce" />
        <h3 className="text-lg font-bold tracking-tight mb-1">No machinery listed</h3>
        <p className="text-sm text-muted-foreground max-w-sm mb-4">
          {emptyMessage}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((equipment) => (
        <EquipmentCard
          key={equipment.id}
          equipment={equipment}
          showActions={showActions}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
