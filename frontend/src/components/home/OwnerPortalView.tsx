"use client";

import Link from "next/link";
import {
  PlusCircle,
  Calendar,
  CheckCircle2,
  Truck,
  Video,
  FileCheck,
  ShieldCheck,
  ArrowRight,
  Radio,
  Building,
  Check,
  X,
} from "lucide-react";
import { useOwnerDashboard } from "@/lib/api/dashboardService";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import LocationThreeWayBadge from "@/components/common/LocationThreeWayBadge";
import BookingStatusBadge from "@/components/common/BookingStatusBadge";
import Loader from "@/components/common/Loader";

export default function OwnerPortalView() {
  const { user } = useAuth();
  const { data: dashboardData, isLoading } = useOwnerDashboard();

  if (isLoading) {
    return (
      <div className="py-20 flex justify-center">
        <Loader label="Loading Fleet Owner Command Center..." />
      </div>
    );
  }

  const ownerName = user ? `${user.firstName} ${user.lastName}` : "Fleet Owner";

  return (
    <div className="space-y-8 pb-16 font-sans">
      {/* Owner Command Center Hero */}
      <section className="bg-slate-950 text-white py-10 border-b border-amber-500/20 shadow-lg">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/40 text-xs uppercase font-extrabold">
                  <Truck className="w-3 h-3 mr-1 inline" /> Fleet Owner Command Center
                </Badge>
                <span className="text-xs text-slate-400">• Machinery Fleet Proprietor</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-black tracking-tight font-heading text-white">
                Welcome back, <span className="text-amber-400">{ownerName}</span>
              </h1>
              <p className="text-sm text-slate-300 max-w-2xl">
                Manage your heavy fleet, approve incoming lessee rental requests, conduct live machinery video demonstrations, and present RTO compliance certificates.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg" className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold shadow-md">
                <Link href="/dashboard/owner/equipment/new">
                  <PlusCircle className="mr-2 h-5 w-5" /> List New Machinery
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-slate-700 text-slate-200 hover:bg-slate-900 font-bold">
                <Link href="/dashboard/owner/bookings">
                  <Calendar className="mr-2 h-4 w-4 text-amber-400" /> Incoming Requests
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 max-w-7xl space-y-10">
        {/* Owner Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          <Card className="border bg-slate-900/60 text-slate-100 border-slate-800 shadow-sm">
            <CardHeader className="pb-1">
              <CardTitle className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Total Listed Fleet
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black text-white flex items-center font-heading">
                <Truck className="mr-2 h-6 w-6 text-amber-400 shrink-0" />
                {dashboardData?.totalEquipment ?? 0} Units
              </div>
            </CardContent>
          </Card>

          <Card className="border bg-slate-900/60 text-slate-100 border-slate-800 shadow-sm">
            <CardHeader className="pb-1">
              <CardTitle className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Available for Lease
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black text-emerald-400 flex items-center font-heading">
                <CheckCircle2 className="mr-2 h-6 w-6 text-emerald-400 shrink-0" />
                {dashboardData?.availableEquipment ?? 0} Units
              </div>
            </CardContent>
          </Card>

          <Card className="border bg-slate-900/60 text-slate-100 border-slate-800 shadow-sm">
            <CardHeader className="pb-1">
              <CardTitle className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Currently On Jobsite
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black text-blue-400 flex items-center font-heading">
                <Building className="mr-2 h-6 w-6 text-blue-400 shrink-0" />
                {dashboardData?.bookedEquipment ?? 0} Units
              </div>
            </CardContent>
          </Card>

          <Card className="border bg-slate-900/60 text-slate-100 border-slate-800 shadow-sm">
            <CardHeader className="pb-1">
              <CardTitle className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Pending Verification Requests
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black text-amber-400 flex items-center font-heading">
                <Video className="mr-2 h-6 w-6 text-amber-400 shrink-0" />
                {dashboardData?.pendingBookings ?? 0}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Fleet Owner Quick Shortcuts */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            href="/dashboard/owner/equipment/new"
            className="p-6 rounded-2xl bg-card border shadow-sm hover:shadow-md hover:border-amber-500/50 transition-all group space-y-3"
          >
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold">
              <PlusCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-foreground group-hover:text-amber-500 transition-colors flex items-center font-heading">
                Add Machinery to Fleet <ArrowRight className="w-4 h-4 ml-1.5 opacity-0 group-hover:opacity-100 transition-opacity" />
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                List new excavators, cranes, or pavers with specs, pricing, and RTO certificate scans.
              </p>
            </div>
          </Link>

          <Link
            href="/dashboard/owner/bookings"
            className="p-6 rounded-2xl bg-card border shadow-sm hover:shadow-md hover:border-emerald-500/50 transition-all group space-y-3"
          >
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold">
              <FileCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-foreground group-hover:text-emerald-500 transition-colors flex items-center font-heading">
                Rental Request & Verification Queue <ArrowRight className="w-4 h-4 ml-1.5 opacity-0 group-hover:opacity-100 transition-opacity" />
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                Approve rental requests, start live video inspections, and verify legal RTO permits.
              </p>
            </div>
          </Link>

          <Link
            href="/telematics"
            className="p-6 rounded-2xl bg-card border shadow-sm hover:shadow-md hover:border-blue-500/50 transition-all group space-y-3"
          >
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center font-bold">
              <Radio className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-foreground group-hover:text-blue-500 transition-colors flex items-center font-heading">
                T3 Telematics Fleet GPS <ArrowRight className="w-4 h-4 ml-1.5 opacity-0 group-hover:opacity-100 transition-opacity" />
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                Monitor live engine RPM, satellite GPS geofencing, and digital hour meter telemetry.
              </p>
            </div>
          </Link>
        </section>

        {/* Incoming Rental Verification Requests */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold font-heading">Incoming Rental Requests & Verification Queue</h2>
            <Button asChild variant="ghost" size="sm" className="text-xs text-primary font-bold">
              <Link href="/dashboard/owner/bookings">View All Requests ({dashboardData?.pendingBookings ?? 0}) <ArrowRight className="w-3.5 h-3.5 ml-1" /></Link>
            </Button>
          </div>

          {dashboardData?.recentBookings && dashboardData.recentBookings.length > 0 ? (
            <div className="space-y-4">
              {dashboardData.recentBookings.slice(0, 3).map((booking) => (
                <Card key={booking.id} className="border bg-card shadow-sm p-4 space-y-4">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                    <div>
                      <h3 className="font-bold text-base text-foreground font-heading">{booking.equipmentName}</h3>
                      <p className="text-xs text-muted-foreground">
                        Requested By: <span className="font-bold text-foreground">{booking.customerName}</span> ({booking.customerEmail})
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Rental Period: {booking.startDate} to {booking.endDate}
                      </p>
                    </div>

                    <div className="flex items-center space-x-2">
                      <BookingStatusBadge status={booking.status} />
                      <Button size="xs" variant="outline" asChild className="font-bold border-amber-500 text-amber-500">
                        <Link href="/dashboard/owner/bookings">Verify & Action</Link>
                      </Button>
                    </div>
                  </div>

                  <LocationThreeWayBadge
                    machineLocation={booking.machineLocation || "Owner Machinery Yard"}
                    customerLocation={booking.customerLocation || "Lessee Corporate HQ"}
                    siteAddress={booking.siteAddress || "Target Jobsite Address"}
                    estimatedDistanceKm={booking.estimatedDistanceKm || 48}
                    mobilizationCost={booking.mobilizationCost || 5760}
                  />
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center p-8 bg-card rounded-xl border border-dashed space-y-2">
              <Calendar className="mx-auto h-8 w-8 text-muted-foreground/60" />
              <h3 className="font-bold text-sm">No Pending Rental Requests</h3>
              <p className="text-xs text-muted-foreground">Your listed machinery is ready for incoming lessee requests.</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
