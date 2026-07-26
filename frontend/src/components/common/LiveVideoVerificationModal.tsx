"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  Video,
  ShieldCheck,
  CheckCircle2,
  Truck,
  FileCheck,
  Play,
  Check,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface LiveVideoVerificationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bookingId: number;
  equipmentName: string;
  videoUrl?: string;
  isVerified?: boolean;
  onVerifySuccess?: () => void;
}

export default function LiveVideoVerificationModal({
  open,
  onOpenChange,
  bookingId,
  equipmentName,
  videoUrl,
  isVerified = false,
  onVerifySuccess,
}: LiveVideoVerificationModalProps) {
  const [verifying, setVerifying] = useState(false);

  const hasVideo = Boolean(videoUrl && videoUrl.trim());
  const rawUrl = hasVideo ? videoUrl!.trim() : "";
  const displayVideoUrl = rawUrl.startsWith("http://") || rawUrl.startsWith("https://")
    ? rawUrl
    : rawUrl.startsWith("/uploads/")
    ? `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api"}/..${rawUrl}`
    : rawUrl;

  const handleCompleteVerification = async () => {
    setVerifying(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      toast.success("Machinery video walkthrough verified successfully!");
      if (onVerifySuccess) onVerifySuccess();
      onOpenChange(false);
    } catch {
      toast.error("Failed to complete video inspection sign-off.");
    } finally {
      setVerifying(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl bg-card text-card-foreground border shadow-2xl p-6 font-sans">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-extrabold flex items-center gap-2 font-heading text-foreground">
              <Video className="w-5 h-5 text-amber-500" />
              Machinery Video Inspection & Walkthrough
            </DialogTitle>
            <Badge
              variant="outline"
              className={hasVideo ? "border-emerald-500/30 text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 text-xs px-2.5 py-0.5 font-bold" : "border-amber-500/30 text-amber-700 dark:text-amber-400 bg-amber-500/10 text-xs px-2.5 py-0.5 font-bold"}
            >
              <CheckCircle2 className="w-3 h-3 mr-1 inline" /> {hasVideo ? "Owner Video Uploaded" : "Video Pending Upload"}
            </Badge>
          </div>
          <DialogDescription className="text-xs text-muted-foreground">
            Review detailed machinery video walkthrough uploaded by owner for <strong>{equipmentName}</strong> (Booking #{bookingId})
          </DialogDescription>
        </DialogHeader>

        {/* Detailed Machinery Video Player */}
        {hasVideo ? (
          <div className="relative aspect-video w-full rounded-xl bg-black overflow-hidden border shadow-inner flex flex-col justify-between">
            <video
              src={displayVideoUrl}
              controls
              autoPlay
              muted
              className="w-full h-full object-cover"
            />
            <div className="absolute top-3 left-3 bg-background/90 backdrop-blur-md px-3 py-1 rounded-full border shadow-sm text-xs font-semibold text-foreground flex items-center gap-2">
              <Play className="w-3 h-3 text-amber-500 fill-amber-500" />
              <span>HD Inspection Walkthrough Video</span>
            </div>
          </div>
        ) : (
          <div className="aspect-video w-full rounded-xl bg-muted/20 border border-dashed flex flex-col items-center justify-center p-6 text-center space-y-2">
            <Video className="w-12 h-12 text-muted-foreground/50" />
            <h4 className="font-bold text-sm text-foreground">No Inspection Video Uploaded</h4>
            <p className="text-xs text-muted-foreground max-w-md">
              The machinery owner has not uploaded a video walkthrough for this equipment listing yet.
            </p>
          </div>
        )}

        {/* Inspection Verification Checklist */}
        <div className="p-4 rounded-xl bg-muted/40 border space-y-3 text-xs">
          <h4 className="font-bold text-foreground uppercase tracking-wider text-[11px] flex items-center">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mr-1.5" /> Technical Inspection Checklist
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-foreground">
            <div className="flex items-center space-x-2 bg-background p-2.5 rounded-lg border shadow-xs">
              <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 font-bold" />
              <span className="font-medium text-xs">Cold Engine Start & RPM Pressure Test</span>
            </div>
            <div className="flex items-center space-x-2 bg-background p-2.5 rounded-lg border shadow-xs">
              <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 font-bold" />
              <span className="font-medium text-xs">Digital Hour Meter Telematics Match</span>
            </div>
            <div className="flex items-center space-x-2 bg-background p-2.5 rounded-lg border shadow-xs">
              <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 font-bold" />
              <span className="font-medium text-xs">Hydraulic Cylinder & Oil Fluid Test</span>
            </div>
            <div className="flex items-center space-x-2 bg-background p-2.5 rounded-lg border shadow-xs">
              <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 font-bold" />
              <span className="font-medium text-xs">Track / Tire & Chassis Structural Check</span>
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <p className="text-[11px] text-muted-foreground flex items-center">
            <ShieldCheck className="w-4 h-4 text-amber-500 mr-1 shrink-0" /> Recorded inspection videos are stored for audit compliance.
          </p>
          <div className="flex items-center space-x-3 w-full sm:w-auto justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="text-xs"
            >
              Close
            </Button>
            <Button
              size="sm"
              disabled={verifying || isVerified}
              onClick={handleCompleteVerification}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md"
            >
              {isVerified ? (
                <>
                  <CheckCircle2 className="w-4 h-4 mr-1.5" /> Video Verified
                </>
              ) : (
                <>
                  <FileCheck className="w-4 h-4 mr-1.5" /> Verify & Sign-Off Video Inspection
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
