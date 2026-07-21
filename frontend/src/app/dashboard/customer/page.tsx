"use client";

import Link from "next/link";
import { Search, Calendar, Heart, ShieldAlert, ArrowRight, Truck } from "lucide-react";
import ReactECharts from "echarts-for-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import Sidebar from "@/components/layout/Sidebar";
import Breadcrumb from "@/components/common/Breadcrumb";
import BookingStatusBadge from "@/components/common/BookingStatusBadge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCustomerDashboard } from "@/lib/api/dashboardService";
import Loader from "@/components/common/Loader";
import { resolveImageUrl } from "@/lib/utils";

import ProtectedRoute from "@/components/common/ProtectedRoute";

export default function CustomerDashboardPage() {
  const { data, isLoading, error } = useCustomerDashboard();

  if (error || !data) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center p-8 bg-card rounded-xl border max-w-md">
            <h3 className="text-lg font-bold text-destructive mb-2">Error Loading Dashboard</h3>
            <p className="text-sm text-muted-foreground mb-4">
              We encountered an issue compiling customer activity log metrics. Please try again.
            </p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // ECharts Configurations
  const bookingPieOption = {
    tooltip: { trigger: "item" },
    legend: { bottom: "0%", left: "center", textStyle: { color: "#888" } },
    series: [
      {
        name: "Booking Status",
        type: "pie",
        radius: ["40%", "70%"],
        avoidLabelOverlap: false,
        itemStyle: { borderRadius: 8, borderWidth: 1 },
        label: { show: false },
        data: [
          { value: data?.pendingBookings ?? 0, name: "Pending Review", itemStyle: { color: "#f59e0b" } },
          { value: data?.approvedBookings ?? 0, name: "Approved", itemStyle: { color: "#10b981" } },
          { value: Math.max(0, (data?.totalBookings ?? 0) - (data?.pendingBookings ?? 0) - (data?.approvedBookings ?? 0)), name: "Other", itemStyle: { color: "#888" } },
        ],
      },
    ],
  };

  return (
    <ProtectedRoute allowedRoles={["CUSTOMER", "OWNER", "ADMIN"]}>
      {isLoading ? (
        <div className="flex flex-col min-h-screen bg-background">
          <Navbar />
          <main className="flex-1 flex items-center justify-center">
            <Loader label="Loading customer statistics..." />
          </main>
          <Footer />
        </div>
      ) : error || !data ? (
        <div className="flex flex-col min-h-screen bg-background">
          <Navbar />
          <main className="flex-1 flex items-center justify-center">
            <div className="text-center p-8 bg-card rounded-xl border max-w-md">
              <h3 className="text-lg font-bold text-destructive mb-2">Error Loading Dashboard</h3>
              <p className="text-sm text-muted-foreground mb-4">
                We encountered an issue compiling customer analytics. Please try again.
              </p>
            </div>
          </main>
          <Footer />
        </div>
      ) : (
        <div className="flex flex-col min-h-screen bg-background">
          <Navbar />
          <div className="flex-1 flex">
            <Sidebar className="hidden md:flex" />
        <main className="flex-1 container mx-auto px-4 py-8 max-w-6xl space-y-8">
          <Breadcrumb />

          {/* Title Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight">Customer Dashboard</h1>
              <p className="text-sm text-muted-foreground mt-1">
                View your requested machinery bookings, approvals, and saved wishlist listings.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button asChild size="sm">
                <Link href="/marketplace">
                  <Search className="mr-1.5 h-4 w-4" /> Browse Marketplace
                </Link>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link href="/dashboard/customer/bookings">
                  My Bookings
                </Link>
              </Button>
            </div>
          </div>

          {/* Quick Metrics Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <Card className="border shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-semibold text-muted-foreground uppercase">
                  Total Bookings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-extrabold flex items-center">
                  <Calendar className="mr-2 h-6 w-6 text-primary/60 shrink-0" /> {data.totalBookings}
                </div>
              </CardContent>
            </Card>

            <Card className="border shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-semibold text-muted-foreground uppercase">
                  Approved Bookings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
                  {data.approvedBookings}
                </div>
              </CardContent>
            </Card>

            <Card className="border shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-semibold text-muted-foreground uppercase">
                  Pending Bookings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-extrabold text-amber-600 dark:text-amber-400">
                  {data.pendingBookings}
                </div>
              </CardContent>
            </Card>

            <Card className="border shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-semibold text-muted-foreground uppercase">
                  Wishlist Saved
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-extrabold text-rose-500 flex items-center">
                  <Heart className="mr-2 h-6 w-6 text-rose-400 shrink-0" /> {data.wishlistCount}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts and Wishlist Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Pie Chart */}
            <Card className="border shadow-sm lg:col-span-5">
              <CardHeader>
                <CardTitle className="text-sm font-bold">Booking Request Outcomes</CardTitle>
              </CardHeader>
              <CardContent className="h-64">
                <ReactECharts option={bookingPieOption} style={{ height: "100%", width: "100%" }} />
              </CardContent>
            </Card>

            {/* Wishlist grid list */}
            <Card className="border shadow-sm lg:col-span-7">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-sm font-bold">My Saved Wishlist</CardTitle>
                <Button variant="ghost" size="sm" asChild className="text-xs text-primary">
                  <Link href="/wishlist" className="flex items-center">
                    View All <ArrowRight className="ml-1 h-3.5 w-3.5" />
                  </Link>
                </Button>
              </CardHeader>
              <CardContent className="p-0">
                {data.recentWishlist.length === 0 ? (
                  <div className="p-12 text-center text-xs text-muted-foreground flex flex-col items-center justify-center space-y-2">
                    <Heart className="h-8 w-8 text-muted-foreground/50" />
                    <span>Your wishlist is currently empty.</span>
                  </div>
                ) : (
                  <div className="divide-y text-xs">
                    {data.recentWishlist.map((item) => {
                      const imageUrl = item.images && item.images.length > 0
                        ? resolveImageUrl(item.images[0].imageUrl)
                        : null;

                      return (
                        <div key={item.id} className="p-4 flex items-center justify-between hover:bg-muted/10">
                          <div className="flex items-center space-x-3">
                            <div className="w-14 aspect-video bg-muted flex items-center justify-center rounded-lg overflow-hidden shrink-0 relative">
                              {imageUrl ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                  src={imageUrl}
                                  alt={item.name}
                                  referrerPolicy="no-referrer"
                                  onError={(e) => {
                                    e.currentTarget.style.display = "none";
                                  }}
                                  className="object-cover w-full h-full relative z-10"
                                />
                              ) : null}
                              <Truck className="h-5 w-5 text-muted-foreground/60 absolute" />
                            </div>
                            <div>
                              <p className="font-bold text-foreground truncate max-w-[150px]">{item.name}</p>
                              <p className="text-[10px] text-muted-foreground">{item.brand} • {item.model}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <span className="font-bold text-primary">₹{item.dailyRentalPrice.toLocaleString("en-IN")}/day</span>
                            <Button size="xs" variant="outline" asChild>
                              <Link href={`/equipment/${item.id}`}>View</Link>
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Recent booking request history table */}
          <Card className="border shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-bold">Recent Rental Booking History</CardTitle>
              <Button variant="ghost" size="sm" asChild className="text-xs text-primary">
                <Link href="/dashboard/customer/bookings" className="flex items-center">
                  View All <ArrowRight className="ml-1 h-3.5 w-3.5" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              {data.recentBookings.length === 0 ? (
                <div className="p-8 text-center text-xs text-muted-foreground">You have not submitted any rental requests.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead>
                      <tr className="border-b bg-muted/40 text-muted-foreground">
                        <th className="p-3">Machinery</th>
                        <th className="p-3">Start Date</th>
                        <th className="p-3">End Date</th>
                        <th className="p-3">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.recentBookings.map((b) => (
                        <tr key={b.id} className="border-b hover:bg-muted/10">
                          <td className="p-3 font-semibold text-foreground truncate max-w-[150px]">{b.equipmentName}</td>
                          <td className="p-3">{b.startDate}</td>
                          <td className="p-3">{b.endDate}</td>
                          <td className="p-3">
                            <BookingStatusBadge status={b.status} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
      <Footer />
    </div>
      )}
    </ProtectedRoute>
  );
}
