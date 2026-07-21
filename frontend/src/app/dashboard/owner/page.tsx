"use client";

import Link from "next/link";
import { Plus, Hammer, Calendar, ClipboardCheck, ArrowRight, Truck } from "lucide-react";
import ReactECharts from "echarts-for-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import Sidebar from "@/components/layout/Sidebar";
import Breadcrumb from "@/components/common/Breadcrumb";
import BookingStatusBadge from "@/components/common/BookingStatusBadge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useOwnerDashboard } from "@/lib/api/dashboardService";
import Loader from "@/components/common/Loader";

import ProtectedRoute from "@/components/common/ProtectedRoute";

export default function OwnerDashboardPage() {
  const { data, isLoading, error } = useOwnerDashboard();

  // ECharts Configurations
  const statusPieOption = {
    tooltip: { trigger: "item" },
    legend: { bottom: "0%", left: "center", textStyle: { color: "#888" } },
    series: [
      {
        name: "Fleet Status",
        type: "pie",
        radius: ["40%", "70%"],
        avoidLabelOverlap: false,
        itemStyle: { borderRadius: 8, borderWidth: 1 },
        label: { show: false },
        data: [
          { value: data?.availableEquipment ?? 0, name: "Available", itemStyle: { color: "#10b981" } },
          { value: data?.bookedEquipment ?? 0, name: "Booked", itemStyle: { color: "#3b82f6" } },
          { value: Math.max(0, (data?.totalEquipment ?? 0) - (data?.availableEquipment ?? 0) - (data?.bookedEquipment ?? 0)), name: "Other", itemStyle: { color: "#f59e0b" } },
        ],
      },
    ],
  };

  const monthsKeys = Object.keys(data?.bookingsPerMonth || {});
  const monthsValues = Object.values(data?.bookingsPerMonth || {});

  const bookingsBarOption = {
    tooltip: { trigger: "axis" },
    xAxis: {
      type: "category",
      data: monthsKeys.length > 0 ? monthsKeys : ["No Data"],
      axisLabel: { color: "#888" },
    },
    yAxis: {
      type: "value",
      axisLabel: { color: "#888" },
    },
    series: [
      {
        data: monthsValues.length > 0 ? monthsValues : [0],
        type: "bar",
        itemStyle: { color: "#ea580c" },
        barWidth: "40%",
      },
    ],
  };

  return (
    <ProtectedRoute allowedRoles={["OWNER", "ADMIN"]}>
      {isLoading ? (
        <div className="flex flex-col min-h-screen bg-background">
          <Navbar />
          <main className="flex-1 flex items-center justify-center">
            <Loader label="Loading owner statistics..." />
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
                We encountered an issue compiling owner statistics. Please try again later.
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
              <h1 className="text-3xl font-extrabold tracking-tight">Owner Dashboard</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Monitor listed equipment performance, active bookings, and rental request logs.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button asChild size="sm">
                <Link href="/dashboard/owner/equipment/new">
                  <Plus className="mr-1.5 h-4 w-4" /> Add Equipment
                </Link>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link href="/dashboard/owner/equipment">
                  Manage Fleet
                </Link>
              </Button>
            </div>
          </div>

          {/* Quick Metrics Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <Card className="border shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-semibold text-muted-foreground uppercase">
                  Total Fleet listed
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-extrabold flex items-center">
                  <Hammer className="mr-2 h-6 w-6 text-primary/60 shrink-0" /> {data.totalEquipment}
                </div>
              </CardContent>
            </Card>

            <Card className="border shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-semibold text-muted-foreground uppercase">
                  Available Fleet
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
                  {data.availableEquipment}
                </div>
              </CardContent>
            </Card>

            <Card className="border shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-semibold text-muted-foreground uppercase">
                  Booked Fleet
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-extrabold text-blue-600 dark:text-blue-400">
                  {data.bookedEquipment}
                </div>
              </CardContent>
            </Card>

            <Card className="border shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-semibold text-muted-foreground uppercase">
                  Pending requests
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-extrabold text-amber-600 dark:text-amber-400">
                  {data.pendingBookings}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts Panel */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border shadow-sm">
              <CardHeader>
                <CardTitle className="text-sm font-bold">Fleet Availability Status</CardTitle>
              </CardHeader>
              <CardContent className="h-64">
                <ReactECharts option={statusPieOption} style={{ height: "100%", width: "100%" }} />
              </CardContent>
            </Card>

            <Card className="border shadow-sm">
              <CardHeader>
                <CardTitle className="text-sm font-bold">Bookings Per Month</CardTitle>
              </CardHeader>
              <CardContent className="h-64">
                <ReactECharts option={bookingsBarOption} style={{ height: "100%", width: "100%" }} />
              </CardContent>
            </Card>
          </div>

          {/* Grids and Logs */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent listed equipment */}
            <Card className="border shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-sm font-bold">Recent Fleet Additions</CardTitle>
                <Button variant="ghost" size="sm" asChild className="text-xs text-primary">
                  <Link href="/dashboard/owner/equipment" className="flex items-center">
                    View All <ArrowRight className="ml-1 h-3.5 w-3.5" />
                  </Link>
                </Button>
              </CardHeader>
              <CardContent className="p-0">
                {data.recentEquipment.length === 0 ? (
                  <div className="p-6 text-center text-xs text-muted-foreground">No listed fleet found.</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left border-collapse">
                      <thead>
                        <tr className="border-b bg-muted/40 text-muted-foreground">
                          <th className="p-3">Equipment</th>
                          <th className="p-3">Category</th>
                          <th className="p-3">Rate (₹)</th>
                          <th className="p-3">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.recentEquipment.map((eq) => (
                          <tr key={eq.id} className="border-b hover:bg-muted/10">
                            <td className="p-3 font-semibold text-foreground truncate max-w-[120px]">{eq.name}</td>
                            <td className="p-3">{eq.categoryName}</td>
                            <td className="p-3">₹{eq.dailyRentalPrice.toLocaleString("en-IN")}</td>
                            <td className="p-3 capitalize">{eq.availabilityStatus.toLowerCase()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent incoming bookings requests */}
            <Card className="border shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-sm font-bold">Recent Booking Requests</CardTitle>
                <Button variant="ghost" size="sm" asChild className="text-xs text-primary">
                  <Link href="/dashboard/owner/bookings" className="flex items-center">
                    View All <ArrowRight className="ml-1 h-3.5 w-3.5" />
                  </Link>
                </Button>
              </CardHeader>
              <CardContent className="p-0">
                {data.recentBookings.length === 0 ? (
                  <div className="p-6 text-center text-xs text-muted-foreground">No recent requests.</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left border-collapse">
                      <thead>
                        <tr className="border-b bg-muted/40 text-muted-foreground">
                          <th className="p-3">Customer</th>
                          <th className="p-3">Equipment</th>
                          <th className="p-3">Dates</th>
                          <th className="p-3">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.recentBookings.map((b) => (
                          <tr key={b.id} className="border-b hover:bg-muted/10">
                            <td className="p-3 truncate max-w-[100px]">{b.customerName}</td>
                            <td className="p-3 truncate max-w-[120px]">{b.equipmentName}</td>
                            <td className="p-3">{b.startDate}</td>
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
          </div>
        </main>
      </div>
      <Footer />
    </div>
      )}
    </ProtectedRoute>
  );
}
