"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  Video,
  Mic,
  MicOff,
  VideoOff,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Truck,
  Activity,
  Maximize2,
  Clock,
  Radio,
  FileCheck,
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
  videoCallRoomId?: string;
  isVerified?: boolean;
  onVerifySuccess?: () => void;
}

export default function LiveVideoVerificationModal({
  open,
  onOpenChange,
  bookingId,
  equipmentName,
  videoCallRoomId = "equiplink-live-session-101",
  isVerified = false,
  onVerifySuccess,
}: LiveVideoVerificationModalProps) {
  const [micOn, setMicOn] = useState(true);
  const [videoOn, setVideoOn] = useState(true);
  const [activeCam, setActiveCam] = useState<"engine" | "cabin" | "hourmeter">("engine");
  const [verifying, setVerifying] = useState(false);
  const [checklist, setChecklist] = useState({
    engineStart: true,
    hourMeterMatch: true,
    hydraulicFluidCheck: true,
    chassisNoDamage: true,
  });

  const handleCompleteVerification = async () => {
    setVerifying(true);
    try {
      // Simulate verification API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Live Machinery Video Inspection verified successfully!");
      if (onVerifySuccess) onVerifySuccess();
      onOpenChange(false);
    } catch {
      toast.error("Failed to complete video verification.");
    } finally {
      setVerifying(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl bg-slate-950 text-slate-100 border-slate-800 p-6 font-sans">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-extrabold flex items-center gap-2 font-heading text-white">
              <Video className="w-5 h-5 text-amber-500" />
              Live Machinery Inspection Room
            </DialogTitle>
            <Badge
              variant="outline"
              className="border-emerald-500/40 text-emerald-400 bg-emerald-950/40 text-xs px-2.5 py-0.5"
            >
              <Radio className="w-3 h-3 mr-1 inline animate-pulse" /> Live Stream Active
            </Badge>
          </div>
          <DialogDescription className="text-xs text-slate-400">
            Live video verification feed for <strong>{equipmentName}</strong> (Session ID: {videoCallRoomId})
          </DialogDescription>
        </DialogHeader>

        {/* Video Player Display Screen */}
        <div className="relative aspect-video w-full rounded-2xl bg-slate-900 overflow-hidden border border-slate-800 flex items-center justify-center">
          {videoOn ? (
            <div className="relative w-full h-full bg-slate-950 flex flex-col justify-between p-4">
              {/* Overlay Top Bar */}
              <div className="flex items-center justify-between text-xs z-10">
                <div className="flex items-center space-x-2 bg-slate-900/80 px-3 py-1 rounded-full border border-slate-700">
                  <Activity className="w-3.5 h-3.5 text-amber-400" />
                  <span className="font-bold uppercase text-[10px] text-amber-300">
                    Cam: {activeCam === "engine" ? "Engine Bay Run Test" : activeCam === "cabin" ? "Operator Cabin" : "Digital Hour Meter Telematics"}
                  </span>
                </div>
                <div className="flex items-center space-x-2 bg-slate-900/80 px-3 py-1 rounded-full border border-slate-700 text-[10px]">
                  <Clock className="w-3 h-3 text-emerald-400" />
                  <span>08:42 Live HD 1080p</span>
                </div>
              </div>

              {/* Simulated Camera Video Stream Content */}
              <div className="my-auto text-center space-y-3 z-10">
                <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto shadow-xl glow-amber">
                  <Truck className="w-8 h-8 animate-bounce" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-extrabold text-white">
                    {equipmentName} – Live Machine Demonstration
                  </p>
                  <p className="text-xs text-slate-400">
                    Owner is demonstrating cold engine start, hydraulic pump pressure, and hour meter telemetry.
                  </p>
                </div>
              </div>

              {/* Overlay Bottom Controls */}
              <div className="flex items-center justify-between z-10">
                <div className="flex items-center space-x-2">
                  <Button
                    size="sm"
                    variant={activeCam === "engine" ? "default" : "outline"}
                    onClick={() => setActiveCam("engine")}
                    className="text-[11px] h-7 px-2.5 bg-amber-500 text-slate-950 font-bold hover:bg-amber-400"
                  >
                    Engine Cam
                  </Button>
                  <Button
                    size="sm"
                    variant={activeCam === "hourmeter" ? "default" : "outline"}
                    onClick={() => setActiveCam("hourmeter")}
                    className="text-[11px] h-7 px-2.5 border-slate-700 text-slate-200"
                  >
                    Hour Meter Cam
                  </Button>
                  <Button
                    size="sm"
                    variant={activeCam === "cabin" ? "default" : "outline"}
                    onClick={() => setActiveCam("cabin")}
                    className="text-[11px] h-7 px-2.5 border-slate-700 text-slate-200"
                  >
                    Cabin Cam
                  </Button>
                </div>

                <div className="flex items-center space-x-2">
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => setMicOn(!micOn)}
                    className="h-8 w-8 rounded-full border-slate-700 bg-slate-900"
                  >
                    {micOn ? <Mic className="w-4 h-4 text-emerald-400" /> : <MicOff className="w-4 h-4 text-rose-400" />}
                  </Button>
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => setVideoOn(!videoOn)}
                    className="h-8 w-8 rounded-full border-slate-700 bg-slate-900"
                  >
                    {videoOn ? <Video className="w-4 h-4 text-emerald-400" /> : <VideoOff className="w-4 h-4 text-rose-400" />}
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center p-8 space-y-2">
              <VideoOff className="w-10 h-10 text-slate-600 mx-auto" />
              <p className="text-xs text-slate-400">Video Feed Muted</p>
            </div>
          )}
        </div>

        {/* Machine Technical Verification Checklist */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3 text-xs">
          <h4 className="font-bold text-slate-200 uppercase tracking-wider text-[11px] flex items-center">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 mr-1.5" /> Technical Inspection Checklist
          </h4>
          <div className="grid grid-cols-2 gap-2 text-slate-300">
            <div className="flex items-center space-x-2 bg-slate-950/60 p-2 rounded-lg border border-slate-800">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Cold Engine Start & RPM Test</span>
            </div>
            <div className="flex items-center space-x-2 bg-slate-950/60 p-2 rounded-lg border border-slate-800">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Digital Hour Meter Telematics Match</span>
            </div>
            <div className="flex items-center space-x-2 bg-slate-950/60 p-2 rounded-lg border border-slate-800">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Hydraulic Cylinder & Oil Fluid Test</span>
            </div>
            <div className="flex items-center space-x-2 bg-slate-950/60 p-2 rounded-lg border border-slate-800">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Track / Tire & Chassis Structural Check</span>
            </div>
          </div>
        </div>

        {/* Verification Action Buttons */}
        <div className="flex items-center justify-between pt-2">
          <p className="text-[11px] text-slate-400 flex items-center">
            <ShieldCheck className="w-4 h-4 text-amber-500 mr-1" /> Verified calls are cryptographically logged for audit compliance.
          </p>
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="border-slate-700 text-slate-300 hover:bg-slate-900 text-xs"
            >
              Close
            </Button>
            <Button
              size="sm"
              disabled={verifying || isVerified}
              onClick={handleCompleteVerification}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-lg"
            >
              {isVerified ? (
                <>
                  <CheckCircle2 className="w-4 h-4 mr-1.5" /> Machine Video Verified
                </>
              ) : (
                <>
                  <FileCheck className="w-4 h-4 mr-1.5" /> Sign-Off Video Inspection
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
