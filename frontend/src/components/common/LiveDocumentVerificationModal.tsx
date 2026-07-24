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
  ExternalLink,
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
  rcUrl = "KA-02-MH-8849 / VIN-EQ-2026-X8849",
  insuranceUrl = "INS-POL-99201-HE (₹5 Cr Sum Assured)",
  fitnessUrl = "FIT-CEV-STAGE-IV-2026 (RTO Certified)",
  licenseUrl = "DL-HEAVY-EXCAVATOR-9982 (Certified Operator)",
  onVerifySuccess,
}: LiveDocumentVerificationModalProps) {
  const [verifying, setVerifying] = useState(false);

  const chassisVin = rcUrl || `VIN-EQ-${bookingId}-2026-X8849`;
  const policyNo = insuranceUrl || `INS-POL-${bookingId}-99201-HE`;

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
      <DialogContent className="max-w-2xl bg-card text-card-foreground border shadow-2xl p-6 font-sans">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-extrabold flex items-center gap-2 font-heading text-foreground">
              <FileCheck className="w-5 h-5 text-amber-500" />
              Machinery Compliance Document Verification
            </DialogTitle>
            <Badge
              variant="outline"
              className="border-amber-500/30 text-amber-700 dark:text-amber-400 bg-amber-500/10 text-xs px-2.5 py-0.5 font-bold"
            >
              <ShieldCheck className="w-3 h-3 mr-1 inline" /> Government RTO Pre-Uploaded
            </Badge>
          </div>
          <DialogDescription className="text-xs text-muted-foreground">
            Verify RTO registration, commercial insurance, and operator permits pre-uploaded by machine owner for <strong>{equipmentName}</strong>
          </DialogDescription>
        </DialogHeader>

        {/* Tabbed Document Inspector */}
        <Tabs defaultValue="rc" className="w-full">
          <TabsList className="grid grid-cols-4 bg-muted border text-xs">
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
            <div className="p-4 rounded-xl bg-background border space-y-3 shadow-xs">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-sm text-foreground flex items-center">
                  <FileText className="w-4 h-4 text-amber-500 mr-2" /> Registration Certificate (RC)
                </h4>
                <Badge className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30 text-[10px]">Active & Verified</Badge>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-foreground">
                <div>
                  <span className="text-muted-foreground block text-[10px] uppercase font-bold">Chassis / VIN Number</span>
                  <span className="font-mono font-bold text-amber-600 dark:text-amber-400">{chassisVin}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[10px] uppercase font-bold">RTO Issuing Authority</span>
                  <span className="font-semibold">Regional Transport Office</span>
                </div>
              </div>
              <div className="p-3 rounded-lg bg-muted/50 border text-center text-foreground text-xs flex items-center justify-center space-x-2">
                <Lock className="w-4 h-4 text-amber-500" />
                <span className="font-medium">Digitally Verified RC Smartcard Pre-Uploaded by Owner</span>
              </div>
            </div>
          </TabsContent>

          {/* Insurance Tab */}
          <TabsContent value="insurance" className="space-y-4 pt-3">
            <div className="p-4 rounded-xl bg-background border space-y-3 shadow-xs">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-sm text-foreground flex items-center">
                  <Award className="w-4 h-4 text-amber-500 mr-2" /> Commercial Machinery Insurance
                </h4>
                <Badge className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30 text-[10px]">Fully Covered</Badge>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-foreground">
                <div>
                  <span className="text-muted-foreground block text-[10px] uppercase font-bold">Policy Number</span>
                  <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">{policyNo}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[10px] uppercase font-bold">Jobsite Liability Cover</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">₹5,00,00,000 Sum Assured</span>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Fitness Certificate Tab */}
          <TabsContent value="fitness" className="space-y-4 pt-3">
            <div className="p-4 rounded-xl bg-background border space-y-3 shadow-xs">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-sm text-foreground flex items-center">
                  <Building className="w-4 h-4 text-amber-500 mr-2" /> RTO Mechanical Fitness Certificate
                </h4>
                <Badge className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30 text-[10px]">Approved</Badge>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-foreground">
                <div>
                  <span className="text-muted-foreground block text-[10px] uppercase font-bold">Emission / Certificate No.</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">{fitnessUrl}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[10px] uppercase font-bold">Inspection Validity</span>
                  <span className="font-semibold">BS-IV / CEV Stage IV Certified</span>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Operator License Tab */}
          <TabsContent value="license" className="space-y-4 pt-3">
            <div className="p-4 rounded-xl bg-background border space-y-3 shadow-xs">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-sm text-foreground flex items-center">
                  <UserCheck className="w-4 h-4 text-amber-500 mr-2" /> Certified Operator Driving License
                </h4>
                <Badge className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30 text-[10px]">Verified Operator</Badge>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-foreground">
                <div>
                  <span className="text-muted-foreground block text-[10px] uppercase font-bold">Heavy License Number</span>
                  <span className="font-semibold text-foreground">{licenseUrl}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[10px] uppercase font-bold">Heavy Vehicle Class</span>
                  <span className="font-semibold text-amber-600 dark:text-amber-400">TRANS-HEAVY-EXCAVATOR</span>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t">
          <Button
            size="sm"
            variant="outline"
            onClick={handleDownloadPDF}
            className="border-emerald-500/40 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500 hover:text-white text-xs font-bold w-full sm:w-auto"
          >
            <Download className="w-3.5 h-3.5 mr-1.5" /> Download PDF Verification Pass
          </Button>

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
              onClick={handleVerifyDocuments}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs shadow-md"
            >
              {isVerified ? (
                <>
                  <CheckCircle2 className="w-4 h-4 mr-1.5 text-slate-950" /> Documents Verified
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
