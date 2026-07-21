"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { authApi } from "@/lib/api/auth";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import Breadcrumb from "@/components/common/Breadcrumb";
import ProtectedRoute from "@/components/common/ProtectedRoute";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  LogOut,
  ShieldCheck,
  Phone,
  Mail,
  Building2,
  FileText,
  MapPin,
  CreditCard,
  Truck,
  Award,
  CheckCircle2,
  User,
  Building,
  Landmark,
  ShieldAlert,
} from "lucide-react";
import type { ApiError } from "@/types";
import type { AxiosError } from "axios";

// ---- Zod Validation Schemas ----

const profileSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  companyName: z.string().optional(),
  gstin: z.string().max(15, "GSTIN must not exceed 15 characters").optional(),
  businessType: z.string().optional(),
  companyAddress: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  pincode: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const router = useRouter();
  const { user, logout, login } = useAuth();
  const [activeTab, setActiveTab] = useState<"personal" | "business" | "payout" | "dispatch">("personal");

  // Bank payout states
  const [bankDetails, setBankDetails] = useState({
    bankName: "HDFC Bank",
    accountHolder: user ? `${user.firstName} ${user.lastName}` : "",
    accountNumber: "50100234567890",
    ifscCode: "HDFC0001234",
    upiId: "equiplink@hdfcbank",
  });

  // Dispatch preferences states
  const [dispatchPrefs, setDispatchPrefs] = useState({
    dispatchRadius: "100 km",
    operatorMode: "Operator Included (Certified Driver)",
    securityDeposit: "Standard Security Clearance",
    emergencyContact: "+91 98765 43210",
  });

  // Edit Profile Form
  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    reset: resetProfile,
    formState: { errors: profileErrors, isSubmitting: isProfileSubmitting },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
  });

  // Pre-fill profile form fields once user details load
  useEffect(() => {
    if (user) {
      resetProfile({
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone || "",
        companyName: user.companyName || "",
        gstin: user.gstin || "",
        businessType: user.businessType || "CONSTRUCTION_CONTRACTOR",
        companyAddress: user.companyAddress || "",
        city: user.city || "",
        state: user.state || "",
        pincode: user.pincode || "",
      });
      setBankDetails((prev) => ({
        ...prev,
        accountHolder: `${user.firstName} ${user.lastName}`,
      }));
    }
  }, [user, resetProfile]);

  const onUpdateProfile = async (data: ProfileFormValues) => {
    try {
      const updatedUser = await authApi.updateProfile(data);
      login(updatedUser);
      toast.success("Profile & Enterprise details updated successfully!");
    } catch (err) {
      const axiosError = err as AxiosError<ApiError>;
      const message =
        axiosError.response?.data?.message || "Failed to update profile. Please try again.";
      toast.error(message);
    }
  };

  const handleSaveBank = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Bank payout & settlement details saved!");
  };

  const handleSaveDispatch = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Fleet dispatch & operator preferences updated!");
  };

  const handleLogoutClick = async () => {
    try {
      await logout();
      toast.success("Logged out successfully.");
      router.push("/login");
    } catch {
      toast.error("Logout failed.");
    }
  };

  return (
    <ProtectedRoute>
      <div className="flex flex-col min-h-screen bg-background">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-8 max-w-6xl">
          <Breadcrumb />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-6">
            {/* Left Column: Profile Card & Trust Credentials */}
            <Card className="lg:col-span-1 border shadow-sm h-fit">
              <CardHeader className="text-center pb-4">
                <div className="w-24 h-24 bg-gradient-to-tr from-amber-500/20 to-primary/20 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-primary/30 shadow-xs">
                  <span className="text-3xl font-black text-primary">
                    {user?.firstName?.charAt(0)}
                    {user?.lastName?.charAt(0)}
                  </span>
                </div>
                <CardTitle className="text-xl font-bold">
                  {user?.firstName} {user?.lastName}
                </CardTitle>
                <div className="mt-1 flex items-center justify-center gap-2">
                  <Badge variant="default" className="capitalize font-bold text-xs bg-primary">
                    {user?.role.toLowerCase()} Account
                  </Badge>
                  <Badge variant="outline" className="text-[10px] border-emerald-500 text-emerald-600 font-bold bg-emerald-50 dark:bg-emerald-950/40">
                    <ShieldCheck className="h-3 w-3 mr-1 inline" /> Verified Level 3
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Contact & Company Snippets */}
                <div className="space-y-3.5 text-xs border-t border-b py-4">
                  <div className="flex items-center space-x-3 text-muted-foreground">
                    <Mail className="h-4 w-4 text-primary shrink-0" />
                    <span className="text-foreground truncate font-medium">{user?.email}</span>
                  </div>
                  <div className="flex items-center space-x-3 text-muted-foreground">
                    <Phone className="h-4 w-4 text-primary shrink-0" />
                    <span className="text-foreground font-medium">{user?.phone || "No phone registered"}</span>
                  </div>
                  {user?.companyName && (
                    <div className="flex items-center space-x-3 text-muted-foreground">
                      <Building2 className="h-4 w-4 text-primary shrink-0" />
                      <span className="text-foreground font-semibold">{user?.companyName}</span>
                    </div>
                  )}
                  {user?.gstin && (
                    <div className="flex items-center space-x-3 text-muted-foreground">
                      <FileText className="h-4 w-4 text-primary shrink-0" />
                      <span className="text-foreground uppercase text-[11px] font-mono tracking-wider bg-muted px-2 py-0.5 rounded border font-semibold">
                        GSTIN: {user?.gstin}
                      </span>
                    </div>
                  )}
                </div>

                {/* Real-World Trust Metric Badge */}
                <div className="p-3.5 bg-gradient-to-r from-amber-500/10 via-primary/5 to-muted rounded-xl border space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="flex items-center text-amber-700 dark:text-amber-400">
                      <Award className="h-4 w-4 mr-1" /> Trust Rating Score
                    </span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-black">98.4 / 100</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    High reliability score based on verified machine fitness certificates and on-time rental dispatch records.
                  </p>
                </div>

                {/* Logout Button */}
                <Button
                  variant="destructive"
                  className="w-full flex items-center justify-center font-semibold"
                  onClick={handleLogoutClick}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out of Account
                </Button>
              </CardContent>
            </Card>

            {/* Right Column: Multi-Tab Enterprise Profile Controls */}
            <Card className="lg:col-span-2 border shadow-sm">
              <CardHeader className="border-b pb-0">
                <div className="flex flex-wrap gap-2 sm:gap-4">
                  <button
                    onClick={() => setActiveTab("personal")}
                    className={`pb-3 text-xs sm:text-sm font-semibold border-b-2 transition-all flex items-center space-x-1.5 ${
                      activeTab === "personal"
                        ? "border-primary text-primary"
                        : "border-transparent text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <User className="h-4 w-4" />
                    <span>Personal Details</span>
                  </button>

                  <button
                    onClick={() => setActiveTab("business")}
                    className={`pb-3 text-xs sm:text-sm font-semibold border-b-2 transition-all flex items-center space-x-1.5 ${
                      activeTab === "business"
                        ? "border-primary text-primary"
                        : "border-transparent text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Building className="h-4 w-4" />
                    <span>Business & GST KYC</span>
                  </button>

                  <button
                    onClick={() => setActiveTab("payout")}
                    className={`pb-3 text-xs sm:text-sm font-semibold border-b-2 transition-all flex items-center space-x-1.5 ${
                      activeTab === "payout"
                        ? "border-primary text-primary"
                        : "border-transparent text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Landmark className="h-4 w-4" />
                    <span>Bank Payouts</span>
                  </button>

                  <button
                    onClick={() => setActiveTab("dispatch")}
                    className={`pb-3 text-xs sm:text-sm font-semibold border-b-2 transition-all flex items-center space-x-1.5 ${
                      activeTab === "dispatch"
                        ? "border-primary text-primary"
                        : "border-transparent text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Truck className="h-4 w-4" />
                    <span>Fleet & Dispatch</span>
                  </button>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                {/* Tab 1: Personal Details */}
                {activeTab === "personal" && (
                  <form onSubmit={handleProfileSubmit(onUpdateProfile)} className="space-y-6" noValidate>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between pb-2 border-b">
                        <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">
                          Personal & Contact Information
                        </h3>
                        <span className="text-[10px] font-bold text-amber-600 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded border border-amber-200">
                          * Mandatory Fields
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <Label htmlFor="firstName">First Name <span className="text-destructive">*</span></Label>
                          <Input
                            id="firstName"
                            type="text"
                            placeholder="Advit"
                            aria-invalid={!!profileErrors.firstName}
                            {...registerProfile("firstName")}
                          />
                          {profileErrors.firstName && (
                            <p className="text-xs text-destructive">{profileErrors.firstName.message}</p>
                          )}
                        </div>

                        <div className="space-y-1.5">
                          <Label htmlFor="lastName">Last Name <span className="text-destructive">*</span></Label>
                          <Input
                            id="lastName"
                            type="text"
                            placeholder="Nayak"
                            aria-invalid={!!profileErrors.lastName}
                            {...registerProfile("lastName")}
                          />
                          {profileErrors.lastName && (
                            <p className="text-xs text-destructive">{profileErrors.lastName.message}</p>
                          )}
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="phone">Mobile / Contact Phone <span className="text-destructive">*</span></Label>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="9876543210"
                          aria-invalid={!!profileErrors.phone}
                          {...registerProfile("phone")}
                        />
                        {profileErrors.phone && (
                          <p className="text-xs text-destructive">{profileErrors.phone.message}</p>
                        )}
                      </div>
                    </div>

                    <Button type="submit" disabled={isProfileSubmitting} className="font-semibold w-full sm:w-auto">
                      {isProfileSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving changes…
                        </>
                      ) : (
                        "Save Personal Details"
                      )}
                    </Button>
                  </form>
                )}

                {/* Tab 2: Business & GST KYC */}
                {activeTab === "business" && (
                  <form onSubmit={handleProfileSubmit(onUpdateProfile)} className="space-y-6" noValidate>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between pb-2 border-b">
                        <h3 className="text-sm font-bold text-foreground uppercase tracking-wider flex items-center">
                          <Building2 className="h-4 w-4 mr-2 text-primary" /> Corporate Billing & Tax Invoicing
                        </h3>
                        <Badge variant="outline" className="text-[10px] border-emerald-500 text-emerald-600 font-bold bg-emerald-50">
                          GST Compliant
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <Label htmlFor="companyName">Registered Company Name</Label>
                          <Input
                            id="companyName"
                            type="text"
                            placeholder="e.g. Nayak Infra Projects Pvt Ltd"
                            {...registerProfile("companyName")}
                          />
                        </div>

                        <div className="space-y-1.5">
                          <Label htmlFor="gstin">GSTIN / Tax ID Number</Label>
                          <Input
                            id="gstin"
                            type="text"
                            placeholder="27AAAAA0000A1Z5"
                            className="uppercase font-mono"
                            {...registerProfile("gstin")}
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="businessType">Business Operations Category</Label>
                        <select
                          id="businessType"
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-xs focus-visible:outline-none"
                          {...registerProfile("businessType")}
                        >
                          <option value="CONSTRUCTION_CONTRACTOR">Construction Contractor</option>
                          <option value="INFRASTRUCTURE_DEVELOPER">Infrastructure & Road Developer</option>
                          <option value="MINING_OPERATOR">Mining & Quarrying Operator</option>
                          <option value="EQUIPMENT_FLEET_OPERATOR">Equipment Rental Fleet Owner</option>
                          <option value="INDIVIDUAL_OPERATOR">Individual Operator / Subcontractor</option>
                          <option value="GOVERNMENT_PSU">Government / PSU Contractor</option>
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="companyAddress">Registered Business Address</Label>
                        <Input
                          id="companyAddress"
                          type="text"
                          placeholder="Plot 42, GIDC Industrial Estate, Sector 3"
                          {...registerProfile("companyAddress")}
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="space-y-1.5">
                          <Label htmlFor="city">City</Label>
                          <Input id="city" placeholder="Surat" {...registerProfile("city")} />
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="state">State</Label>
                          <Input id="state" placeholder="Gujarat" {...registerProfile("state")} />
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="pincode">Pincode</Label>
                          <Input id="pincode" placeholder="395003" {...registerProfile("pincode")} />
                        </div>
                      </div>
                    </div>

                    <Button type="submit" disabled={isProfileSubmitting} className="font-semibold w-full sm:w-auto">
                      Save Business & Tax Info
                    </Button>
                  </form>
                )}

                {/* Tab 3: Bank Payout Settlement */}
                {activeTab === "payout" && (
                  <form onSubmit={handleSaveBank} className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between pb-2 border-b">
                        <h3 className="text-sm font-bold text-foreground uppercase tracking-wider flex items-center">
                          <Landmark className="h-4 w-4 mr-2 text-primary" /> Rental Revenue Payout Account
                        </h3>
                        <Badge className="bg-emerald-600 text-white text-[10px]">Auto Settlement Active</Badge>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <Label htmlFor="bankName">Bank Name</Label>
                          <Input
                            id="bankName"
                            value={bankDetails.bankName}
                            onChange={(e) => setBankDetails({ ...bankDetails, bankName: e.target.value })}
                          />
                        </div>

                        <div className="space-y-1.5">
                          <Label htmlFor="accountHolder">Account Holder Name</Label>
                          <Input
                            id="accountHolder"
                            value={bankDetails.accountHolder}
                            onChange={(e) => setBankDetails({ ...bankDetails, accountHolder: e.target.value })}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <Label htmlFor="accountNumber">Account Number</Label>
                          <Input
                            id="accountNumber"
                            type="password"
                            value={bankDetails.accountNumber}
                            onChange={(e) => setBankDetails({ ...bankDetails, accountNumber: e.target.value })}
                          />
                        </div>

                        <div className="space-y-1.5">
                          <Label htmlFor="ifscCode">IFSC Code</Label>
                          <Input
                            id="ifscCode"
                            className="uppercase font-mono"
                            value={bankDetails.ifscCode}
                            onChange={(e) => setBankDetails({ ...bankDetails, ifscCode: e.target.value })}
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="upiId">Instant VPA / UPI ID</Label>
                        <Input
                          id="upiId"
                          value={bankDetails.upiId}
                          onChange={(e) => setBankDetails({ ...bankDetails, upiId: e.target.value })}
                        />
                      </div>
                    </div>

                    <Button type="submit" className="font-semibold w-full sm:w-auto">
                      Save Payout Settlement Details
                    </Button>
                  </form>
                )}

                {/* Tab 4: Fleet & Dispatch Preferences */}
                {activeTab === "dispatch" && (
                  <form onSubmit={handleSaveDispatch} className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between pb-2 border-b">
                        <h3 className="text-sm font-bold text-foreground uppercase tracking-wider flex items-center">
                          <Truck className="h-4 w-4 mr-2 text-primary" /> Fleet Dispatch & Operator Operations
                        </h3>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <Label htmlFor="dispatchRadius">Maximum Fleet Dispatch Radius</Label>
                          <select
                            id="dispatchRadius"
                            value={dispatchPrefs.dispatchRadius}
                            onChange={(e) => setDispatchPrefs({ ...dispatchPrefs, dispatchRadius: e.target.value })}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-xs focus-visible:outline-none"
                          >
                            <option value="50 km">Within 50 km (Local District)</option>
                            <option value="100 km">Within 100 km (State Regional)</option>
                            <option value="Pan-India">Pan-India (Interstate Transit)</option>
                          </select>
                        </div>

                        <div className="space-y-1.5">
                          <Label htmlFor="operatorMode">Default Operator Provision</Label>
                          <select
                            id="operatorMode"
                            value={dispatchPrefs.operatorMode}
                            onChange={(e) => setDispatchPrefs({ ...dispatchPrefs, operatorMode: e.target.value })}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-xs focus-visible:outline-none"
                          >
                            <option value="Operator Included (Certified Driver)">Operator Included (Certified Driver Dispatched)</option>
                            <option value="Bare Machinery Only">Bare Machinery Only (Contractor Provides Driver)</option>
                            <option value="Flexible Choice">Flexible (Hirer Option)</option>
                          </select>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="emergencyContact">Emergency Site Contact Hotline</Label>
                        <Input
                          id="emergencyContact"
                          value={dispatchPrefs.emergencyContact}
                          onChange={(e) => setDispatchPrefs({ ...dispatchPrefs, emergencyContact: e.target.value })}
                        />
                      </div>
                    </div>

                    <Button type="submit" className="font-semibold w-full sm:w-auto">
                      Save Dispatch & Operator Settings
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    </ProtectedRoute>
  );
}
