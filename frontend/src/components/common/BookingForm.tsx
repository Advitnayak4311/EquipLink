"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, MapPin, Building, Phone, Briefcase, FileText } from "lucide-react";

// Get today's date formatted as YYYY-MM-DD
const getTodayString = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// ---- Zod Schema ----

const bookingSchema = z
  .object({
    // Mandatory Rental Fields
    startDate: z.string().min(1, "Rental start date is required"),
    endDate: z.string().min(1, "Rental end date is required"),
    siteAddress: z.string().min(5, "Delivery site address is required (min 5 characters)"),
    workPurpose: z.string().min(3, "Work purpose / application is required"),
    contactPhone: z.string().min(10, "On-site contact phone must be at least 10 digits"),

    // Optional B2B Invoicing & Notes Fields
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
      companyName: user?.companyName || "",
      gstin: user?.gstin || "",
      message: "",
    },
  });

  // Automatically pre-fill saved user business profile details
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

  // Calculate estimated total price
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
      {/* Header Info */}
      <div className="bg-primary/5 p-3 rounded-lg border border-primary/15 flex items-center justify-between">
        <div>
          <h3 className="text-xs font-bold text-foreground">{equipmentName}</h3>
          <p className="text-[11px] text-muted-foreground font-semibold">Rate: ₹{dailyPrice.toLocaleString("en-IN")} / day</p>
        </div>
        {totalCost > 0 && (
          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-muted-foreground">Est. Total</span>
            <p className="text-sm font-extrabold text-primary">₹{totalCost.toLocaleString("en-IN")}</p>
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
            <MapPin className="h-3 w-3 mr-1 text-primary" /> Delivery & Operating Site Address <span className="text-destructive">*</span>
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
              <Briefcase className="h-3 w-3 mr-1 text-primary" /> Work Purpose <span className="text-destructive">*</span>
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
              <Phone className="h-3 w-3 mr-1 text-primary" /> On-Site Contact Phone <span className="text-destructive">*</span>
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

      {/* SECTION 2: Optional Business / Tax Billing Info */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between pb-1 border-b">
          <span className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center">
            <Building className="h-3.5 w-3.5 mr-1 text-primary" /> 2. Business Invoicing & Tax Credit
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
              <FileText className="h-3 w-3 mr-1 text-muted-foreground" /> GSTIN / Tax ID
            </Label>
            <Input
              id="gstin"
              type="text"
              placeholder="27AAAAA0000A1Z5"
              className="uppercase"
              {...register("gstin")}
            />
          </div>
        </div>

        {/* Optional Message */}
        <div className="space-y-1">
          <Label htmlFor="message" className="text-xs">Special Site Notes / Message to Owner</Label>
          <textarea
            id="message"
            placeholder="Specify operator requirements, trailer mobilization time, shift timings..."
            className="flex min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-1.5 text-xs ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            aria-invalid={!!errors.message}
            {...register("message")}
          />
          {errors.message && <p className="text-[10px] text-destructive">{errors.message.message}</p>}
        </div>
      </div>

      {/* Total & Action Buttons */}
      <div className="pt-2 border-t flex items-center justify-end space-x-3">
        <Button type="button" variant="outline" size="sm" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" size="sm" disabled={isSubmitting} className="font-semibold px-5">
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting Request...
            </>
          ) : (
            "Confirm Rental Request"
          )}
        </Button>
      </div>
    </form>
  );
}
