import { EquipmentStatus } from "@/types";
import { Badge } from "@/components/ui/badge";

interface StatusBadgeProps {
  status: EquipmentStatus;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const getColors = () => {
    switch (status) {
      case "AVAILABLE":
        return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 border-emerald-500/20";
      case "BOOKED":
        return "bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-500/20 border-blue-500/20";
      case "MAINTENANCE":
        return "bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20 border-amber-500/20";
      case "UNAVAILABLE":
        return "bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-500/20 border-rose-500/20";
      default:
        return "bg-slate-500/10 text-slate-600 dark:text-slate-400 hover:bg-slate-500/20 border-slate-500/20";
    }
  };

  const getLabel = () => {
    switch (status) {
      case "AVAILABLE":
        return "Available";
      case "BOOKED":
        return "Booked";
      case "MAINTENANCE":
        return "Maintenance";
      case "UNAVAILABLE":
        return "Unavailable";
      default:
        return status;
    }
  };

  return (
    <Badge variant="outline" className={`font-semibold border text-xs capitalize ${getColors()}`}>
      {getLabel()}
    </Badge>
  );
}
