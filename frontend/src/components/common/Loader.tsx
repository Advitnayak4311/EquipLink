import { Loader2 } from "lucide-react";

interface LoaderProps {
  className?: string;
  size?: number;
  label?: string;
}

export default function Loader({ className, size = 32, label = "Loading..." }: LoaderProps) {
  return (
    <div className={`flex flex-col items-center justify-center p-8 space-y-2 ${className || ""}`}>
      <Loader2 className="animate-spin text-primary" style={{ width: size, height: size }} />
      {label && <p className="text-sm text-muted-foreground font-medium">{label}</p>}
    </div>
  );
}
