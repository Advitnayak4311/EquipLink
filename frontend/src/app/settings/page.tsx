"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { authApi } from "@/lib/api/auth";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import Sidebar from "@/components/layout/Sidebar";
import Breadcrumb from "@/components/common/Breadcrumb";
import ProtectedRoute from "@/components/common/ProtectedRoute";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import {
  Sun,
  Moon,
  Laptop,
  Lock,
  Bell,
  Globe,
  Loader2,
  Check,
  Truck,
  Sparkles,
  Sliders,
  Smartphone,
  ShieldCheck,
} from "lucide-react";
import type { ApiError } from "@/types";
import type { AxiosError } from "axios";

// ---- Validation Schema for Password Change ----

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(8, "New password must be at least 8 characters"),
    confirmNewPassword: z.string().min(1, "Password confirmation is required"),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "New passwords do not match",
    path: ["confirmNewPassword"],
  });

type PasswordFormValues = z.infer<typeof passwordSchema>;

export default function SettingsPage() {
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<"appearance" | "security" | "fleet" | "notifications" | "regional">("appearance");

  // Unique Settings States
  const [autoAiAssist, setAutoAiAssist] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState("30");
  const [accentColor, setAccentColor] = useState("amber");

  // Notification states
  const [notifications, setNotifications] = useState({
    bookingAlerts: true,
    rentalInquiries: true,
    smsDispatch: true,
    fleetReminders: true,
    marketingUpdates: false,
  });

  // Fleet defaults states
  const [defaultLocation, setDefaultLocation] = useState("Bangalore, Karnataka");
  const [defaultCategory, setDefaultCategory] = useState("Excavators");

  // Regional preferences states
  const [currency, setCurrency] = useState("INR");
  const [timezone, setTimezone] = useState("Asia/Kolkata");
  const [dateFormat, setDateFormat] = useState("DD/MM/YYYY");

  useEffect(() => {
    setMounted(true);
  }, []);

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    reset: resetPassword,
    formState: { errors: passwordErrors, isSubmitting: isPasswordSubmitting },
  } = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
  });

  const onChangePassword = async (data: PasswordFormValues) => {
    try {
      await authApi.changePassword(data);
      resetPassword({
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      });
      toast.success("Security password updated successfully!");
    } catch (err) {
      const axiosError = err as AxiosError<ApiError>;
      const message =
        axiosError.response?.data?.message || "Failed to update password. Please check credentials.";
      toast.error(message);
    }
  };

  const handleSaveFleetDefaults = () => {
    toast.success("Fleet & Machinery listing defaults saved!");
  };

  const handleSaveNotifications = () => {
    toast.success("Notification dispatch preferences saved!");
  };

  const handleSaveRegional = () => {
    toast.success("Regional formatting preferences saved!");
  };

  return (
    <ProtectedRoute>
      <div className="flex flex-col min-h-screen bg-background">
        <Navbar />
        <div className="flex-1 flex">
          <Sidebar className="hidden md:flex" />
          <main className="flex-1 container mx-auto px-4 py-8 max-w-5xl space-y-6">
            <Breadcrumb />

            {/* Page Header */}
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight">Account & Platform Settings</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Manage your theme aesthetics, security preferences, fleet defaults, and notification triggers.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Sidebar Navigation Tabs */}
              <div className="lg:col-span-1 space-y-1">
                <button
                  onClick={() => setActiveTab("appearance")}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === "appearance"
                      ? "bg-primary text-primary-foreground font-semibold shadow-sm"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <Sun className="h-4 w-4 shrink-0" />
                  <span>Theme & Aesthetics</span>
                </button>

                <button
                  onClick={() => setActiveTab("security")}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === "security"
                      ? "bg-primary text-primary-foreground font-semibold shadow-sm"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <Lock className="h-4 w-4 shrink-0" />
                  <span>Security & Sessions</span>
                </button>

                <button
                  onClick={() => setActiveTab("fleet")}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === "fleet"
                      ? "bg-primary text-primary-foreground font-semibold shadow-sm"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <Truck className="h-4 w-4 shrink-0" />
                  <span>Fleet & AI Defaults</span>
                </button>

                <button
                  onClick={() => setActiveTab("notifications")}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === "notifications"
                      ? "bg-primary text-primary-foreground font-semibold shadow-sm"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <Bell className="h-4 w-4 shrink-0" />
                  <span>Alerts & Notifications</span>
                </button>

                <button
                  onClick={() => setActiveTab("regional")}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === "regional"
                      ? "bg-primary text-primary-foreground font-semibold shadow-sm"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <Globe className="h-4 w-4 shrink-0" />
                  <span>Regional & Billing</span>
                </button>
              </div>

              {/* Tab Content Panels */}
              <div className="lg:col-span-3">
                {/* Tab 1: Appearance & Theme */}
                {activeTab === "appearance" && (
                  <Card className="border shadow-sm">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center">
                        <Sun className="mr-2 h-5 w-5 text-primary" /> Visual Appearance & Color Mode
                      </CardTitle>
                      <CardDescription>
                        Toggle system color themes and select visual accent styles for your workspace.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div>
                        <Label className="text-sm font-bold mb-3 block">Color Mode</Label>
                        {mounted && (
                          <div className="grid grid-cols-3 gap-4">
                            <button
                              onClick={() => setTheme("light")}
                              className={`p-4 rounded-xl border-2 flex flex-col items-center justify-center space-y-3 transition-all ${
                                theme === "light"
                                  ? "border-primary bg-primary/5 text-primary shadow-sm"
                                  : "border-muted hover:border-muted-foreground/30 text-muted-foreground"
                              }`}
                            >
                              <Sun className="h-8 w-8 text-amber-500" />
                              <span className="text-xs font-bold">Light Mode</span>
                              {theme === "light" && <Check className="h-4 w-4 text-primary" />}
                            </button>

                            <button
                              onClick={() => setTheme("dark")}
                              className={`p-4 rounded-xl border-2 flex flex-col items-center justify-center space-y-3 transition-all ${
                                theme === "dark"
                                  ? "border-primary bg-primary/5 text-primary shadow-sm"
                                  : "border-muted hover:border-muted-foreground/30 text-muted-foreground"
                              }`}
                            >
                              <Moon className="h-8 w-8 text-blue-400" />
                              <span className="text-xs font-bold">Dark Mode</span>
                              {theme === "dark" && <Check className="h-4 w-4 text-primary" />}
                            </button>

                            <button
                              onClick={() => setTheme("system")}
                              className={`p-4 rounded-xl border-2 flex flex-col items-center justify-center space-y-3 transition-all ${
                                theme === "system"
                                  ? "border-primary bg-primary/5 text-primary shadow-sm"
                                  : "border-muted hover:border-muted-foreground/30 text-muted-foreground"
                              }`}
                            >
                              <Laptop className="h-8 w-8 text-slate-500" />
                              <span className="text-xs font-bold">System Sync</span>
                              {theme === "system" && <Check className="h-4 w-4 text-primary" />}
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Accent Color Palette Selection */}
                      <div className="pt-4 border-t">
                        <Label className="text-sm font-bold mb-2 block">Industrial Accent Palette</Label>
                        <p className="text-xs text-muted-foreground mb-4">Choose a high-visibility theme accent tailored for industrial & fleet interfaces.</p>
                        <div className="grid grid-cols-4 gap-3">
                          <button
                            onClick={() => { setAccentColor("amber"); toast.success("Industrial Amber palette activated!"); }}
                            className={`p-3 rounded-lg border text-center text-xs font-semibold flex items-center justify-center space-x-2 ${
                              accentColor === "amber" ? "ring-2 ring-amber-500 border-amber-500 font-bold" : "hover:bg-muted"
                            }`}
                          >
                            <span className="w-3.5 h-3.5 rounded-full bg-amber-500 inline-block" />
                            <span>Construction Amber</span>
                          </button>
                          <button
                            onClick={() => { setAccentColor("blue"); toast.success("Steel Blue palette activated!"); }}
                            className={`p-3 rounded-lg border text-center text-xs font-semibold flex items-center justify-center space-x-2 ${
                              accentColor === "blue" ? "ring-2 ring-blue-600 border-blue-600 font-bold" : "hover:bg-muted"
                            }`}
                          >
                            <span className="w-3.5 h-3.5 rounded-full bg-blue-600 inline-block" />
                            <span>Steel Blue</span>
                          </button>
                          <button
                            onClick={() => { setAccentColor("emerald"); toast.success("Emerald Machinery palette activated!"); }}
                            className={`p-3 rounded-lg border text-center text-xs font-semibold flex items-center justify-center space-x-2 ${
                              accentColor === "emerald" ? "ring-2 ring-emerald-600 border-emerald-600 font-bold" : "hover:bg-muted"
                            }`}
                          >
                            <span className="w-3.5 h-3.5 rounded-full bg-emerald-600 inline-block" />
                            <span>Heavy Duty Green</span>
                          </button>
                          <button
                            onClick={() => { setAccentColor("slate"); toast.success("Dark Carbon palette activated!"); }}
                            className={`p-3 rounded-lg border text-center text-xs font-semibold flex items-center justify-center space-x-2 ${
                              accentColor === "slate" ? "ring-2 ring-slate-800 border-slate-800 font-bold" : "hover:bg-muted"
                            }`}
                          >
                            <span className="w-3.5 h-3.5 rounded-full bg-slate-800 inline-block" />
                            <span>Dark Carbon</span>
                          </button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Tab 2: Security & Sessions */}
                {activeTab === "security" && (
                  <Card className="border shadow-sm">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center">
                        <Lock className="mr-2 h-5 w-5 text-primary" /> Password & Session Protection
                      </CardTitle>
                      <CardDescription>
                        Update login credentials, set auto-lock timers, and monitor active sessions.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <form onSubmit={handlePasswordSubmit(onChangePassword)} className="space-y-4 max-w-md" noValidate>
                        <div className="space-y-1.5">
                          <Label htmlFor="currentPassword">Current Password</Label>
                          <Input
                            id="currentPassword"
                            type="password"
                            placeholder="••••••••"
                            aria-invalid={!!passwordErrors.currentPassword}
                            {...registerPassword("currentPassword")}
                          />
                          {passwordErrors.currentPassword && (
                            <p className="text-xs text-destructive">{passwordErrors.currentPassword.message}</p>
                          )}
                        </div>

                        <div className="space-y-1.5">
                          <Label htmlFor="newPassword">New Password</Label>
                          <Input
                            id="newPassword"
                            type="password"
                            placeholder="••••••••"
                            aria-invalid={!!passwordErrors.newPassword}
                            {...registerPassword("newPassword")}
                          />
                          {passwordErrors.newPassword && (
                            <p className="text-xs text-destructive">{passwordErrors.newPassword.message}</p>
                          )}
                        </div>

                        <div className="space-y-1.5">
                          <Label htmlFor="confirmNewPassword">Confirm New Password</Label>
                          <Input
                            id="confirmNewPassword"
                            type="password"
                            placeholder="••••••••"
                            aria-invalid={!!passwordErrors.confirmNewPassword}
                            {...registerPassword("confirmNewPassword")}
                          />
                          {passwordErrors.confirmNewPassword && (
                            <p className="text-xs text-destructive">{passwordErrors.confirmNewPassword.message}</p>
                          )}
                        </div>

                        <Button type="submit" disabled={isPasswordSubmitting} className="font-semibold">
                          {isPasswordSubmitting ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Updating password…
                            </>
                          ) : (
                            "Update Password"
                          )}
                        </Button>
                      </form>

                      {/* Auto-lock & Security Session Rules */}
                      <div className="pt-6 border-t space-y-4">
                        <h4 className="text-sm font-bold flex items-center text-foreground">
                          <ShieldCheck className="h-4 w-4 mr-2 text-primary" /> Session Security Policy
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <Label htmlFor="sessionTimeout">Inactivity Session Timeout</Label>
                            <select
                              id="sessionTimeout"
                              value={sessionTimeout}
                              onChange={(e) => setSessionTimeout(e.target.value)}
                              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            >
                              <option value="15">Auto-logout after 15 minutes</option>
                              <option value="30">Auto-logout after 30 minutes (Recommended)</option>
                              <option value="60">Auto-logout after 1 hour</option>
                              <option value="never">Keep logged in until browser exit</option>
                            </select>
                          </div>

                          <div className="p-3 bg-muted/50 rounded-lg border text-xs space-y-1">
                            <span className="font-semibold text-foreground">Active Account Email:</span>
                            <p className="text-muted-foreground">{user?.email}</p>
                            <span className="font-semibold text-foreground inline-block mt-2">Account Role:</span>
                            <span className="ml-2 px-2 py-0.5 rounded bg-primary/10 text-primary font-bold">{user?.role}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Tab 3: Fleet & AI Defaults */}
                {activeTab === "fleet" && (
                  <Card className="border shadow-sm">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center">
                        <Truck className="mr-2 h-5 w-5 text-primary" /> Machinery Fleet & AI Assistant Settings
                      </CardTitle>
                      <CardDescription>
                        Set default yard locations, category filters, and automated AI description generators.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 rounded-lg border bg-card">
                          <div className="flex items-start space-x-3">
                            <Sparkles className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                            <div>
                              <p className="text-sm font-semibold text-foreground">Auto AI Equipment Description Generator</p>
                              <p className="text-xs text-muted-foreground">Automatically suggest optimized technical descriptions and rental terms when listing new machinery.</p>
                            </div>
                          </div>
                          <input
                            type="checkbox"
                            checked={autoAiAssist}
                            onChange={(e) => setAutoAiAssist(e.target.checked)}
                            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                          <div className="space-y-1.5">
                            <Label htmlFor="defaultLocation">Default Fleet Yard / Dispatch Location</Label>
                            <Input
                              id="defaultLocation"
                              value={defaultLocation}
                              onChange={(e) => setDefaultLocation(e.target.value)}
                              placeholder="e.g. Surat Industrial Zone, Gujarat"
                            />
                          </div>

                          <div className="space-y-1.5">
                            <Label htmlFor="defaultCategory">Primary Fleet Specialty Category</Label>
                            <select
                              id="defaultCategory"
                              value={defaultCategory}
                              onChange={(e) => setDefaultCategory(e.target.value)}
                              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            >
                              <option value="Excavators">Excavators & Earthmovers</option>
                              <option value="Cranes">Cranes & Lifting Equipment</option>
                              <option value="Bulldozers">Bulldozers & Crawlers</option>
                              <option value="Road Rollers">Road Rollers & Compactors</option>
                              <option value="Dump Trucks">Dump & Haulage Trucks</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      <Button onClick={handleSaveFleetDefaults} className="font-semibold">
                        Save Fleet Defaults
                      </Button>
                    </CardContent>
                  </Card>
                )}

                {/* Tab 4: Alerts & Notifications */}
                {activeTab === "notifications" && (
                  <Card className="border shadow-sm">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center">
                        <Bell className="mr-2 h-5 w-5 text-primary" /> Dispatch & Communication Alerts
                      </CardTitle>
                      <CardDescription>
                        Configure instant SMS, WhatsApp, and email alerts for rental bookings and machinery orders.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-3.5 rounded-lg border bg-card">
                          <div>
                            <p className="text-sm font-semibold text-foreground">Real-Time Rental Order Alerts</p>
                            <p className="text-xs text-muted-foreground">Receive instant notifications when a contractor submits a new equipment rental booking.</p>
                          </div>
                          <input
                            type="checkbox"
                            checked={notifications.bookingAlerts}
                            onChange={(e) => setNotifications({ ...notifications, bookingAlerts: e.target.checked })}
                            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                          />
                        </div>

                        <div className="flex items-center justify-between p-3.5 rounded-lg border bg-card">
                          <div>
                            <p className="text-sm font-semibold text-foreground">SMS & WhatsApp Dispatch Messages</p>
                            <p className="text-xs text-muted-foreground">Send machinery dispatch schedules and operator details directly via SMS to your phone ({user?.phone || "configured mobile"}).</p>
                          </div>
                          <input
                            type="checkbox"
                            checked={notifications.smsDispatch}
                            onChange={(e) => setNotifications({ ...notifications, smsDispatch: e.target.checked })}
                            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                          />
                        </div>

                        <div className="flex items-center justify-between p-3.5 rounded-lg border bg-card">
                          <div>
                            <p className="text-sm font-semibold text-foreground">Rental Inquiries & Pricing Questions</p>
                            <p className="text-xs text-muted-foreground">Get alerted when interested hirers request custom quote estimates for long-term projects.</p>
                          </div>
                          <input
                            type="checkbox"
                            checked={notifications.rentalInquiries}
                            onChange={(e) => setNotifications({ ...notifications, rentalInquiries: e.target.checked })}
                            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                          />
                        </div>

                        <div className="flex items-center justify-between p-3.5 rounded-lg border bg-card">
                          <div>
                            <p className="text-sm font-semibold text-foreground">Equipment Maintenance Reminders</p>
                            <p className="text-xs text-muted-foreground">Scheduled alerts for periodic oil changes, hydraulic checks, and RC renewal dates.</p>
                          </div>
                          <input
                            type="checkbox"
                            checked={notifications.fleetReminders}
                            onChange={(e) => setNotifications({ ...notifications, fleetReminders: e.target.checked })}
                            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                          />
                        </div>
                      </div>

                      <Button onClick={handleSaveNotifications} className="font-semibold">
                        Save Notification Settings
                      </Button>
                    </CardContent>
                  </Card>
                )}

                {/* Tab 5: Regional & Billing */}
                {activeTab === "regional" && (
                  <Card className="border shadow-sm">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center">
                        <Globe className="mr-2 h-5 w-5 text-primary" /> Regional Localization & Billing Format
                      </CardTitle>
                      <CardDescription>
                        Set default pricing currencies, regional timezones, and GST tax invoice formats.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6 max-w-lg">
                      <div className="space-y-4">
                        <div className="space-y-1.5">
                          <Label htmlFor="currency">Display Rental Currency</Label>
                          <select
                            id="currency"
                            value={currency}
                            onChange={(e) => setCurrency(e.target.value)}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                          >
                            <option value="INR">₹ INR - Indian Rupee (₹/day, ₹/hour)</option>
                            <option value="USD">$ USD - US Dollar</option>
                            <option value="EUR">€ EUR - Euro</option>
                          </select>
                        </div>

                        <div className="space-y-1.5">
                          <Label htmlFor="timezone">Operational Timezone</Label>
                          <select
                            id="timezone"
                            value={timezone}
                            onChange={(e) => setTimezone(e.target.value)}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                          >
                            <option value="Asia/Kolkata">Asia/Kolkata (IST +5:30)</option>
                            <option value="UTC">UTC (Coordinated Universal Time)</option>
                            <option value="America/New_York">America/New_York (EST -5:00)</option>
                          </select>
                        </div>

                        <div className="space-y-1.5">
                          <Label htmlFor="dateFormat">Calendar Date Display Format</Label>
                          <select
                            id="dateFormat"
                            value={dateFormat}
                            onChange={(e) => setDateFormat(e.target.value)}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                          >
                            <option value="DD/MM/YYYY">DD/MM/YYYY (e.g. 20/07/2026)</option>
                            <option value="YYYY-MM-DD">YYYY-MM-DD (ISO Format)</option>
                            <option value="MMM DD, YYYY">MMM DD, YYYY (e.g. Jul 20, 2026)</option>
                          </select>
                        </div>
                      </div>

                      <Button onClick={handleSaveRegional} className="font-semibold">
                        Save Regional Preferences
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </main>
        </div>
        <Footer />
      </div>
    </ProtectedRoute>
  );
}
