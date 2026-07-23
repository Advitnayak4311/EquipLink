"use client";

import Link from "next/link";
import {
  Search,
  Calendar,
  Heart,
  ArrowRight,
  Truck,
  Calculator,
  Navigation,
  ShieldCheck,
  Video,
  FileCheck,
} from "lucide-react";
import { useCustomerDashboard } from "@/lib/api/dashboardService";
import { useMarketplace } from "@/lib/api/marketplaceService";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import EquipmentCard from "@/components/common/EquipmentCard";
import BookingStatusBadge from "@/components/common/BookingStatusBadge";
import LocationThreeWayBadge from "@/components/common/LocationThreeWayBadge";
import Loader from "@/components/common/Loader";

export default function CustomerPortalView() {
  const { user } = useAuth();
  const { data: dashboardData, isLoading: dashLoading } = useCustomerDashboard();
  const { data: catalogData, isLoading: catalogLoading } = useMarketplace({ size: 3 });

  if (dashLoading) {
    return (
      <div className="py-20 flex justify-center">
        <Loader label="Loading Customer Portal..." />
      </div>
    );
  }

  const customerName = user ? `${user.firstName} ${user.lastName}` : "Lessee";

  return (
    <div className="space-y-8 pb-16 font-sans">
      {/* Customer Hero Banner */}
      <section className="bg-slate-950 text-white py-10 border-b border-amber-500/20 shadow-lg">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/40 text-xs uppercase font-extrabold">
                  <ShieldCheck className="w-3 h-3 mr-1 inline" /> Lessee Customer Portal
                </Badge>
                <span className="text-xs text-slate-400">• B2B Corporate Hirer</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-black tracking-tight font-heading text-white">
                Welcome back, <span className="text-amber-400">{customerName}</span>
              </h1>
              <p className="text-sm text-slate-300 max-w-2xl">
                Discover verified excavators, cranes, and loaders. Track 3-way jobsite mobilization routes and verify owner compliance certificates.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg" className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold shadow-md">
                <Link href="/marketplace">
                  <Search className="mr-2 h-4 w-4" /> Browse Marketplace
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-slate-700 text-slate-200 hover:bg-slate-900 font-bold">
                <Link href="/dashboard/customer/bookings">
                  <Calendar className="mr-2 h-4 w-4 text-amber-400" /> My Rental Requests
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 max-w-7xl space-y-10">
        {/* Customer Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          <Card className="border bg-slate-900/60 text-slate-100 border-slate-800 shadow-sm">
            <CardHeader className="pb-1">
              <CardTitle className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Total Rental Requests
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black text-white flex items-center font-heading">
                <Calendar className="mr-2 h-6 w-6 text-amber-400 shrink-0" />
                {dashboardData?.totalBookings ?? 0}
              </div>
            </CardContent>
          </Card>

          <Card className="border bg-slate-900/60 text-slate-100 border-slate-800 shadow-sm">
            <CardHeader className="pb-1">
              <CardTitle className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Approved & Active Leases
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black text-emerald-400 flex items-center font-heading">
                <ShieldCheck className="mr-2 h-6 w-6 text-emerald-400 shrink-0" />
                {dashboardData?.approvedBookings ?? 0}
              </div>
            </CardContent>
          </Card>

          <Card className="border bg-slate-900/60 text-slate-100 border-slate-800 shadow-sm">
            <CardHeader className="pb-1">
              <CardTitle className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Pending Verification
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black text-amber-400 flex items-center font-heading">
                <Video className="mr-2 h-6 w-6 text-amber-400 shrink-0" />
                {dashboardData?.pendingBookings ?? 0}
              </div>
            </CardContent>
          </Card>

          <Card className="border bg-slate-900/60 text-slate-100 border-slate-800 shadow-sm">
            <CardHeader className="pb-1">
              <CardTitle className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Saved Wishlist Items
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black text-rose-400 flex items-center font-heading">
                <Heart className="mr-2 h-6 w-6 text-rose-400 shrink-0" />
                {dashboardData?.wishlistCount ?? 0}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Tools & Shortcuts Bar */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            href="/marketplace"
            className="p-6 rounded-2xl bg-card border shadow-sm hover:shadow-md hover:border-amber-500/50 transition-all group space-y-3"
          >
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-foreground group-hover:text-amber-500 transition-colors flex items-center font-heading">
                Browse Heavy Machinery Catalog <ArrowRight className="w-4 h-4 ml-1.5 opacity-0 group-hover:opacity-100 transition-opacity" />
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                Filter excavators, cranes, and tippers by tonnage, location, and daily rate.
              </p>
            </div>
          </Link>

          <Link
            href="/dashboard/customer/bookings"
            className="p-6 rounded-2xl bg-card border shadow-sm hover:shadow-md hover:border-emerald-500/50 transition-all group space-y-3"
          >
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold">
              <Navigation className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-foreground group-hover:text-emerald-500 transition-colors flex items-center font-heading">
                3-Way Transit & Verification <ArrowRight className="w-4 h-4 ml-1.5 opacity-0 group-hover:opacity-100 transition-opacity" />
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                Join live machinery video calls and verify owner RC and insurance compliance certificates.
              </p>
            </div>
          </Link>

          <Link
            href="/calculator"
            className="p-6 rounded-2xl bg-card border shadow-sm hover:shadow-md hover:border-blue-500/50 transition-all group space-y-3"
          >
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center font-bold">
              <Calculator className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-foreground group-hover:text-blue-500 transition-colors flex items-center font-heading">
                AI Lease Budget Estimator <ArrowRight className="w-4 h-4 ml-1.5 opacity-0 group-hover:opacity-100 transition-opacity" />
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                Estimate diesel fuel burn, operator crew costs, and freight mobilization prior to hiring.
              </p>
            </div>
          </Link>
        </section>

        {/* Featured Fleet Ready for Rental */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-black tracking-tight font-heading">Verified Machinery Available Now</h2>
              <p className="text-xs text-muted-foreground">Select heavy equipment for immediate deployment to your project site</p>
            </div>
            <Button asChild variant="outline" size="sm" className="font-bold border-amber-500 text-amber-500">
              <Link href="/marketplace">Explore All ({catalogData?.totalElements ?? 0})</Link>
            </Button>
          </div>

          {catalogLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-64 bg-card border rounded-xl animate-pulse" />
              ))}
            </div>
          ) : catalogData?.content && catalogData.content.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {catalogData.content.slice(0, 3).map((item) => (
                <EquipmentCard key={item.id} equipment={item} />
              ))}
            </div>
          ) : null}
        </section>

        {/* Recent Bookings & Verification Status */}
        {dashboardData?.recentBookings && dashboardData.recentBookings.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold font-heading">Your Active Rental Requests</h2>
              <Button asChild variant="ghost" size="sm" className="text-xs text-primary font-bold">
                <Link href="/dashboard/customer/bookings">View All Bookings <ArrowRight className="w-3.5 h-3.5 ml-1" /></Link>
              </Button>
            </div>

            <div className="space-y-4">
              {dashboardData.recentBookings.slice(0, 2).map((booking) => (
                <Card key={booking.id} className="border bg-card shadow-sm p-4 space-y-3">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                    <div>
                      <h3 className="font-bold text-base text-foreground font-heading">{booking.equipmentName}</h3>
                      <p className="text-xs text-muted-foreground">
                        Duration: {booking.startDate} to {booking.endDate}
                      </p>
                    </div>
                    <BookingStatusBadge status={booking.status} />
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
          </section>
        )}
      </div>
    </div>
  );
}
