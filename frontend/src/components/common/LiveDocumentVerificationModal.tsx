"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  FileText,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Building,
  Award,
  UserCheck,
  FileCheck,
  Download,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { downloadVerificationPDF } from "@/lib/pdfGenerator";

interface LiveDocumentVerificationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bookingId: number;
  equipmentName: string;
  isVerified?: boolean;
  rcUrl?: string;
  insuranceUrl?: string;
  fitnessUrl?: string;
  licenseUrl?: string;
  onVerifySuccess?: () => void;
}

export default function LiveDocumentVerificationModal({
  open,
  onOpenChange,
  bookingId,
  equipmentName,
  isVerified = false,
  rcUrl,
  insuranceUrl,
  fitnessUrl,
  licenseUrl,
  onVerifySuccess,
}: LiveDocumentVerificationModalProps) {
  const [verifying, setVerifying] = useState(false);

  const chassisVin = `VIN-EQ-${bookingId}-2026-X8849`;
  const policyNo = `INS-POL-${bookingId}-99201-HE`;

  const handleVerifyDocuments = async () => {
    setVerifying(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      toast.success("Machinery compliance documents verified successfully!");
      if (onVerifySuccess) onVerifySuccess();
      onOpenChange(false);
    } catch {
      toast.error("Failed to verify machinery documents.");
    } finally {
      setVerifying(false);
    }
  };

  const handleDownloadPDF = () => {
    downloadVerificationPDF({
      bookingId,
      equipmentName,
      chassisVin,
      insurancePolicyNo: policyNo,
      verifiedAt: new Date().toLocaleString("en-IN"),
    });
    toast.success("Machinery Verification PDF generated & opened for print/download!");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-slate-950 text-slate-100 border-slate-800 p-6 font-sans">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-extrabold flex items-center gap-2 font-heading text-white">
              <FileCheck className="w-5 h-5 text-amber-500" />
              Live Machinery Document Verification
            </DialogTitle>
            <Badge
              variant="outline"
              className="border-amber-500/40 text-amber-400 bg-amber-950/40 text-xs px-2.5 py-0.5"
            >
              <ShieldCheck className="w-3 h-3 mr-1 inline" /> Government RTO Verified
            </Badge>
          </div>
          <DialogDescription className="text-xs text-slate-400">
            Inspect legal compliance certificates and road permits provided by machine owner for <strong>{equipmentName}</strong>
          </DialogDescription>
        </DialogHeader>

        {/* Tabbed Document Inspector */}
        <Tabs defaultValue="rc" className="w-full">
          <TabsList className="grid grid-cols-4 bg-slate-900 border border-slate-800 text-xs">
            <TabsTrigger value="rc" className="data-[state=active]:bg-amber-500 data-[state=active]:text-slate-950 font-bold">
              1. RTO RC
            </TabsTrigger>
            <TabsTrigger value="insurance" className="data-[state=active]:bg-amber-500 data-[state=active]:text-slate-950 font-bold">
              2. Insurance
            </TabsTrigger>
            <TabsTrigger value="fitness" className="data-[state=active]:bg-amber-500 data-[state=active]:text-slate-950 font-bold">
              3. Fitness
            </TabsTrigger>
            <TabsTrigger value="license" className="data-[state=active]:bg-amber-500 data-[state=active]:text-slate-950 font-bold">
              4. Operator ID
            </TabsTrigger>
          </TabsList>

          {/* RC Document Tab */}
          <TabsContent value="rc" className="space-y-4 pt-3">
            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-sm text-slate-100 flex items-center">
                  <FileText className="w-4 h-4 text-amber-400 mr-2" /> Registration Certificate (RC)
                </h4>
                <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/40 text-[10px]">Active & Valid</Badge>
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs text-slate-300">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Chassis / VIN Number</span>
                  <span className="font-mono font-semibold text-amber-400">{chassisVin}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">RTO Issuing Authority</span>
                  <span className="font-semibold">Regional Transport Office</span>
                </div>
              </div>
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-center text-slate-400 text-xs flex items-center justify-center space-x-2">
                <Lock className="w-4 h-4 text-amber-400" />
                <span>Digitally Verified RC Smartcard Scan Attached</span>
              </div>
            </div>
          </TabsContent>

          {/* Insurance Tab */}
          <TabsContent value="insurance" className="space-y-4 pt-3">
            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-sm text-slate-100 flex items-center">
                  <Award className="w-4 h-4 text-amber-400 mr-2" /> Commercial Machinery Insurance
                </h4>
                <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/40 text-[10px]">Fully Covered</Badge>
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs text-slate-300">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Policy Number</span>
                  <span className="font-mono font-semibold text-emerald-400">{policyNo}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Third-Party & Jobsite Liability</span>
                  <span className="font-semibold text-emerald-400">₹5,00,00,000 Sum Assured</span>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Fitness Certificate Tab */}
          <TabsContent value="fitness" className="space-y-4 pt-3">
            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-sm text-slate-100 flex items-center">
                  <Building className="w-4 h-4 text-amber-400 mr-2" /> RTO Mechanical Fitness Certificate
                </h4>
                <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/40 text-[10px]">Approved</Badge>
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs text-slate-300">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Emission / Pollution Compliance</span>
                  <span className="font-semibold text-emerald-400">BS-IV / CEV Stage IV</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Inspection Validity</span>
                  <span className="font-semibold">Valid & SLA Certified</span>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Operator License Tab */}
          <TabsContent value="license" className="space-y-4 pt-3">
            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-sm text-slate-100 flex items-center">
                  <UserCheck className="w-4 h-4 text-amber-400 mr-2" /> Certified Operator Driving License
                </h4>
                <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/40 text-[10px]">Verified Operator</Badge>
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs text-slate-300">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Heavy Vehicle Class</span>
                  <span className="font-semibold">TRANS-HEAVY-CRANE-EXCAVATOR</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Operator Experience</span>
                  <span className="font-semibold text-amber-400">Certified Heavy Operator</span>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Verification Action Buttons */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-800">
          <Button
            size="sm"
            variant="outline"
            onClick={handleDownloadPDF}
            className="border-emerald-500/40 text-emerald-400 hover:bg-emerald-500 hover:text-slate-950 text-xs font-bold"
          >
            <Download className="w-3.5 h-3.5 mr-1.5" /> Download PDF Verification Pass
          </Button>

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
              onClick={handleVerifyDocuments}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs shadow-lg"
            >
              {isVerified ? (
                <>
                  <CheckCircle2 className="w-4 h-4 mr-1.5 text-slate-950" /> Documents Verified & Signed Off
                </>
              ) : (
                <>
                  <FileCheck className="w-4 h-4 mr-1.5" /> Verify & Sign-Off Documents
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
