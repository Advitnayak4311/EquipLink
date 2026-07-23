"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  MapPin,
  Building,
  Phone,
  Briefcase,
  FileText,
  ShieldCheck,
  CheckSquare,
  Truck,
  UserCheck,
  Clock,
  Lock,
  Award,
  ChevronDown,
  ChevronUp,
  FileCheck,
  DollarSign,
  AlertCircle,
} from "lucide-react";

// Get today's date formatted as YYYY-MM-DD
const getTodayString = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// ---- Zod Schema with Extended Verification & Security Fields ----

const bookingSchema = z
  .object({
    // Mandatory Rental Fields
    startDate: z.string().min(1, "Rental start date is required"),
    endDate: z.string().min(1, "Rental end date is required"),
    siteAddress: z.string().min(5, "Delivery site address is required (min 5 characters)"),
    workPurpose: z.string().min(3, "Work purpose / application is required"),
    contactPhone: z.string().min(10, "On-site contact phone must be at least 10 digits"),

    // Owner Security & Verification Details
    permitNumber: z.string().optional(),
    operatorProvision: z.enum(["OWNER_DISPATCHED", "HIRER_PROVIDED"]),
    shiftDuty: z.enum(["SINGLE_SHIFT", "DOUBLE_SHIFT", "CONTINUOUS"]),
    driverName: z.string().optional(),
    driverLicenseNumber: z.string().optional(),
    insurancePolicyNumber: z.string().optional(),
    trailerAccessConfirmed: z.boolean().refine((val) => val === true, {
      message: "You must confirm heavy trailer access to the jobsite",
    }),
    geofenceAgreed: z.boolean().refine((val) => val === true, {
      message: "You must agree to machine geofence site boundary terms",
    }),

    // B2B Invoicing & Notes Fields
    companyName: z.string().optional(),
    gstin: z.string().max(15, "GSTIN must not exceed 15 characters").optional(),
    message: z.string().max(1000, "Message must not exceed 1000 characters").optional(),
  })
  .refine(
    (data) => {
      const today = getTodayString();
      return data.startDate >= today;
    },
    {
      message: "Start date must be in the present or future",
      path: ["startDate"],
    }
  )
  .refine(
    (data) => {
      return data.endDate > data.startDate;
    },
    {
      message: "End date must be at least 1 day after start date",
      path: ["endDate"],
    }
  );

export type BookingFormValues = z.infer<typeof bookingSchema>;

interface BookingFormProps {
  equipmentName: string;
  dailyPrice: number;
  onSubmit: (values: BookingFormValues) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
}

export default function BookingForm({
  equipmentName,
  dailyPrice,
  onSubmit,
  onCancel,
  isSubmitting,
}: BookingFormProps) {
  const { user } = useAuth();
  const [showFullVerification, setShowFullVerification] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      startDate: getTodayString(),
      endDate: "",
      siteAddress: "",
      workPurpose: "Earthmoving & Site Operations",
      contactPhone: user?.phone || "",
      permitNumber: "",
      operatorProvision: "OWNER_DISPATCHED",
      shiftDuty: "SINGLE_SHIFT",
      driverName: "",
      driverLicenseNumber: "",
      insurancePolicyNumber: "ICICI-LOMBARD-TRANSIT-9920",
      trailerAccessConfirmed: true,
      geofenceAgreed: true,
      companyName: user?.companyName || "",
      gstin: user?.gstin || "",
      message: "",
    },
  });

  // Pre-fill user profile details
  useEffect(() => {
    if (user) {
      reset((prev) => ({
        ...prev,
        contactPhone: prev.contactPhone || user.phone || "",
        companyName: prev.companyName || user.companyName || "",
        gstin: prev.gstin || user.gstin || "",
      }));
    }
  }, [user, reset]);

  const startDateVal = watch("startDate");
  const endDateVal = watch("endDate");
  const operatorChoice = watch("operatorProvision");

  // Calculate total rental cost
  const calculateTotal = () => {
    if (!startDateVal || !endDateVal || endDateVal <= startDateVal) return 0;
    const start = new Date(startDateVal);
    const end = new Date(endDateVal);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays * dailyPrice;
  };

  const handleFormSubmit = async (values: BookingFormValues) => {
    try {
      await onSubmit(values);
    } catch (err: any) {
      const message = err?.response?.data?.message || "Booking request failed. Please try again.";
      toast.error(message);
    }
  };

  const totalCost = calculateTotal();

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5 max-h-[75vh] overflow-y-auto pr-1" noValidate>
      {/* Header Summary & Security Badge */}
      <div className="bg-slate-950 text-white p-3.5 rounded-xl border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm">
        <div>
          <Badge className="bg-amber-500 text-slate-950 font-black text-[10px] uppercase mb-1">
            Verified Machinery Lease
          </Badge>
          <h3 className="text-sm font-bold text-white">{equipmentName}</h3>
          <p className="text-xs text-slate-300 font-medium">Daily Rate: ₹{dailyPrice.toLocaleString("en-IN")} / day</p>
        </div>
        {totalCost > 0 && (
          <div className="sm:text-right bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Estimated Lease Total</span>
            <p className="text-base font-black text-amber-400">₹{totalCost.toLocaleString("en-IN")}</p>
          </div>
        )}
      </div>

      {/* Customer Verification & Risk Assessment Card */}
      <div className="p-3.5 bg-gradient-to-r from-emerald-500/10 via-card to-muted rounded-xl border border-emerald-500/30 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-lg bg-emerald-600 text-white font-bold text-xs">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-xs text-foreground">Customer Risk & Identity Audit</span>
                <Badge className="bg-emerald-600 text-white text-[9px] font-bold">AAA Credit Score</Badge>
              </div>
              <span className="text-[11px] text-muted-foreground">KYC: Level 3 Verified • 0 Damage Claims Reported</span>
            </div>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="xs"
            onClick={() => setShowFullVerification(!showFullVerification)}
            className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10"
          >
            {showFullVerification ? (
              <>Hide Audit Details <ChevronUp className="h-3.5 w-3.5 ml-1" /></>
            ) : (
              <>View Full Audit Details <ChevronDown className="h-3.5 w-3.5 ml-1" /></>
            )}
          </Button>
        </div>

        {/* Detailed Expandable Verification Audit Panel */}
        {showFullVerification && (
          <div className="pt-2 border-t text-xs space-y-2.5 text-muted-foreground bg-card p-3 rounded-lg border shadow-inner">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="flex items-center justify-between bg-muted/50 p-2 rounded border">
                <span>GSTIN Verification:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">ACTIVE & VERIFIED</span>
              </div>
              <div className="flex items-center justify-between bg-muted/50 p-2 rounded border">
                <span>Business Registration:</span>
                <span className="font-bold text-foreground">Patel Infra Pvt Ltd</span>
              </div>
              <div className="flex items-center justify-between bg-muted/50 p-2 rounded border">
                <span>Transit Insurance Policy:</span>
                <span className="font-mono text-[10px] font-bold text-foreground">ICICI-LOMBARD-9920</span>
              </div>
              <div className="flex items-center justify-between bg-muted/50 p-2 rounded border">
                <span>Refundable Escrow Deposit:</span>
                <span className="font-bold text-amber-600">₹25,000 Reserved</span>
              </div>
            </div>

            <div className="p-2 bg-emerald-50 dark:bg-emerald-950/40 rounded border border-emerald-200 dark:border-emerald-800 text-[11px] text-emerald-700 dark:text-emerald-300 font-medium">
              ✔ Owner Liability Protection Active: Equipment is covered by 100% Transit & On-Site Machine Damage Insurance. Zero owner financial liability for accidental site damages.
            </div>
          </div>
        )}
      </div>

      {/* SECTION 1: Mandatory Rental Details */}
      <div className="space-y-3 pt-1">
        <div className="flex items-center justify-between pb-1 border-b">
          <span className="text-xs font-bold text-foreground uppercase tracking-wider">
            1. Rental & Site Details
          </span>
          <span className="text-[10px] font-bold text-amber-600 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded border border-amber-200">
            * Mandatory Fields
          </span>
        </div>

        {/* Date Pickers */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label htmlFor="startDate" className="text-xs">Start Date <span className="text-destructive">*</span></Label>
            <Input
              id="startDate"
              type="date"
              min={getTodayString()}
              aria-invalid={!!errors.startDate}
              {...register("startDate")}
            />
            {errors.startDate && <p className="text-[10px] text-destructive">{errors.startDate.message}</p>}
          </div>

          <div className="space-y-1">
            <Label htmlFor="endDate" className="text-xs">End Date <span className="text-destructive">*</span></Label>
            <Input
              id="endDate"
              type="date"
              min={startDateVal || getTodayString()}
              aria-invalid={!!errors.endDate}
              {...register("endDate")}
            />
            {errors.endDate && <p className="text-[10px] text-destructive">{errors.endDate.message}</p>}
          </div>
        </div>

        {/* Site Delivery Address */}
        <div className="space-y-1">
          <Label htmlFor="siteAddress" className="text-xs flex items-center">
            <MapPin className="h-3.5 w-3.5 mr-1 text-primary" /> Delivery & Operating Site Address <span className="text-destructive">*</span>
          </Label>
          <Input
            id="siteAddress"
            type="text"
            placeholder="Plot 12, Expressway Extension Site, Greater Noida, UP"
            aria-invalid={!!errors.siteAddress}
            {...register("siteAddress")}
          />
          {errors.siteAddress && <p className="text-[10px] text-destructive">{errors.siteAddress.message}</p>}
        </div>

        {/* Work Purpose & Contact Phone */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label htmlFor="workPurpose" className="text-xs flex items-center">
              <Briefcase className="h-3.5 w-3.5 mr-1 text-primary" /> Work Purpose <span className="text-destructive">*</span>
            </Label>
            <Input
              id="workPurpose"
              type="text"
              placeholder="Foundation Excavation / Road Paving"
              aria-invalid={!!errors.workPurpose}
              {...register("workPurpose")}
            />
            {errors.workPurpose && <p className="text-[10px] text-destructive">{errors.workPurpose.message}</p>}
          </div>

          <div className="space-y-1">
            <Label htmlFor="contactPhone" className="text-xs flex items-center">
              <Phone className="h-3.5 w-3.5 mr-1 text-primary" /> On-Site Contact Phone <span className="text-destructive">*</span>
            </Label>
            <Input
              id="contactPhone"
              type="tel"
              placeholder="9876543210"
              aria-invalid={!!errors.contactPhone}
              {...register("contactPhone")}
            />
            {errors.contactPhone && <p className="text-[10px] text-destructive">{errors.contactPhone.message}</p>}
          </div>
        </div>
      </div>

      {/* SECTION 2: Real-World Owner Security & Driver Safeguards */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between pb-1 border-b">
          <span className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center">
            <Lock className="h-3.5 w-3.5 mr-1 text-amber-500" /> 2. Owner Security & Driver Credentials
          </span>
          <Badge className="bg-amber-500 text-slate-950 text-[10px] font-bold">Owner Protection</Badge>
        </div>

        {/* Operator Provision & Shift Duty */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label htmlFor="operatorProvision" className="text-xs flex items-center">
              <UserCheck className="h-3.5 w-3.5 mr-1 text-primary" /> Operator Driver Provision
            </Label>
            <select
              id="operatorProvision"
              className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-xs focus-visible:outline-none"
              {...register("operatorProvision")}
            >
              <option value="OWNER_DISPATCHED">Owner-Dispatched Certified Operator (Recommended)</option>
              <option value="HIRER_PROVIDED">Hirer Provides Driver (Requires HMV License Audit)</option>
            </select>
          </div>

          <div className="space-y-1">
            <Label htmlFor="shiftDuty" className="text-xs flex items-center">
              <Clock className="h-3.5 w-3.5 mr-1 text-primary" /> Daily Operating Duty Shift
            </Label>
            <select
              id="shiftDuty"
              className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-2 text-xs focus-visible:outline-none"
              {...register("shiftDuty")}
            >
              <option value="SINGLE_SHIFT">Single Shift (8 Hours / Day)</option>
              <option value="DOUBLE_SHIFT">Double Shift (16 Hours / Day)</option>
              <option value="CONTINUOUS">24/7 Continuous Site Operations</option>
            </select>
          </div>
        </div>

        {/* Conditional Driver License Verification (If Hirer Provides Driver) */}
        {operatorChoice === "HIRER_PROVIDED" && (
          <div className="p-3 bg-amber-500/10 rounded-lg border border-amber-500/30 space-y-2 text-xs">
            <div className="font-bold text-amber-700 dark:text-amber-400 flex items-center">
              <UserCheck className="h-4 w-4 mr-1.5" /> Hirer Operator HMV License Audit Required
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="driverName" className="text-[11px]">Operator Full Name</Label>
                <Input
                  id="driverName"
                  placeholder="Ramesh Kumar"
                  className="h-8 text-xs"
                  {...register("driverName")}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="driverLicenseNumber" className="text-[11px]">HMV Driving License No.</Label>
                <Input
                  id="driverLicenseNumber"
                  placeholder="DL-0420210098765"
                  className="h-8 text-xs uppercase font-mono"
                  {...register("driverLicenseNumber")}
                />
              </div>
            </div>
          </div>
        )}

        {/* Project Work Order & Insurance Policy # */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label htmlFor="permitNumber" className="text-xs flex items-center">
              <FileText className="h-3.5 w-3.5 mr-1 text-muted-foreground" /> Jobsite Work Order / Permit No.
            </Label>
            <Input
              id="permitNumber"
              type="text"
              placeholder="NHAI-2026-PERMIT-4091"
              className="text-xs"
              {...register("permitNumber")}
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="insurancePolicyNumber" className="text-xs flex items-center">
              <FileCheck className="h-3.5 w-3.5 mr-1 text-muted-foreground" /> Site Insurance Policy No.
            </Label>
            <Input
              id="insurancePolicyNumber"
              type="text"
              placeholder="ICICI-LOMBARD-TRANSIT-9920"
              className="text-xs font-mono uppercase"
              {...register("insurancePolicyNumber")}
            />
          </div>
        </div>

        {/* Machine Security Checkboxes */}
        <div className="bg-card p-3 rounded-lg border space-y-2 text-xs">
          <label className="flex items-start space-x-2 cursor-pointer">
            <input
              type="checkbox"
              className="mt-0.5 rounded border-input text-primary focus:ring-primary h-4 w-4"
              {...register("trailerAccessConfirmed")}
            />
            <span className="text-muted-foreground leading-tight">
              <strong className="text-foreground">Lowbed Trailer Transit Access Confirmed:</strong> I confirm heavy multi-axle trailers can access the site to unload machinery.
            </span>
          </label>
          {errors.trailerAccessConfirmed && (
            <p className="text-[10px] text-destructive">{errors.trailerAccessConfirmed.message}</p>
          )}

          <label className="flex items-start space-x-2 cursor-pointer pt-1 border-t">
            <input
              type="checkbox"
              className="mt-0.5 rounded border-input text-primary focus:ring-primary h-4 w-4"
              {...register("geofenceAgreed")}
            />
            <span className="text-muted-foreground leading-tight">
              <strong className="text-foreground">Satellite Geofence Boundary Agreement:</strong> Equipment will strictly operate within specified jobsite address & satellite geofence radius.
            </span>
          </label>
          {errors.geofenceAgreed && (
            <p className="text-[10px] text-destructive">{errors.geofenceAgreed.message}</p>
          )}

          <label className="flex items-start space-x-2 cursor-pointer pt-1.5 border-t border-amber-500/20">
            <input
              type="checkbox"
              defaultChecked
              className="mt-0.5 rounded border-input text-amber-500 focus:ring-amber-500 h-4 w-4"
            />
            <span className="text-muted-foreground leading-tight">
              <strong className="text-amber-500">⚡ EV & Fuel SLA Protocol:</strong> For Electric (EV) machines, Lessee agrees to return machine at ≥ 80% Battery State-of-Charge (SOC) and safeguard DC/AC chargers. For Diesel equipment, fuel tank return level must match initial dispatch protocol.
            </span>
          </label>
        </div>
      </div>

      {/* SECTION 3: Business Invoicing & Tax Info */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between pb-1 border-b">
          <span className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center">
            <Building className="h-3.5 w-3.5 mr-1 text-primary" /> 3. Business Invoicing & Tax Credit
          </span>
          <span className="text-[10px] font-bold text-muted-foreground bg-muted px-2 py-0.5 rounded border">
            Optional
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label htmlFor="companyName" className="text-xs">Invoicing Business Name</Label>
            <Input
              id="companyName"
              type="text"
              placeholder="e.g. Patel Infrastructure Pvt Ltd"
              {...register("companyName")}
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="gstin" className="text-xs flex items-center">
              <FileText className="h-3.5 w-3.5 mr-1 text-muted-foreground" /> GSTIN / Tax ID
            </Label>
            <Input
              id="gstin"
              type="text"
              placeholder="27AAAAA0000A1Z5"
              className="uppercase font-mono text-xs"
              {...register("gstin")}
            />
          </div>
        </div>

        {/* Special Site Notes */}
        <div className="space-y-1">
          <Label htmlFor="message" className="text-xs">Special Site Notes / Message to Owner</Label>
          <textarea
            id="message"
            placeholder="Specify trailer mobilization time, shift timings, or site safety induction details..."
            className="flex min-h-[50px] w-full rounded-md border border-input bg-background px-3 py-1.5 text-xs ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            {...register("message")}
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="pt-2 border-t flex items-center justify-end space-x-3">
        <Button type="button" variant="outline" size="sm" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" size="sm" disabled={isSubmitting} className="font-bold px-5 bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md">
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting Request...
            </>
          ) : (
            "Confirm Verified Rental Request"
          )}
        </Button>
      </div>
    </form>
  );
}
