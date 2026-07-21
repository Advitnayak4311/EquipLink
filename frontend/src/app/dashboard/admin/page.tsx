"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import Sidebar from "@/components/layout/Sidebar";
import Breadcrumb from "@/components/common/Breadcrumb";
import BookingStatusBadge from "@/components/common/BookingStatusBadge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import ReactECharts from "echarts-for-react";
import { useAdminDashboard } from "@/lib/api/dashboardService";
import Loader from "@/components/common/Loader";
import { Users, Hammer, Calendar } from "lucide-react";

import ProtectedRoute from "@/components/common/ProtectedRoute";

export default function AdminDashboardPage() {
  const { data, isLoading, error } = useAdminDashboard();

  if (error || !data) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center p-8 bg-card rounded-xl border max-w-md">
            <h3 className="text-lg font-bold text-destructive mb-2">Error Loading Dashboard</h3>
            <p className="text-sm text-muted-foreground mb-4">
              We encountered an issue compiling global administrative analytics. Please try again.
            </p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // ECharts Configurations
  const usersPieOption = {
    tooltip: { trigger: "item" },
    legend: { bottom: "0%", left: "center", textStyle: { color: "#888" } },
    series: [
      {
        name: "User Roles",
        type: "pie",
        radius: ["40%", "70%"],
        avoidLabelOverlap: false,
        itemStyle: { borderRadius: 8, borderWidth: 1 },
        label: { show: false },
        data: [
          { value: data?.totalOwners ?? 0, name: "Owners", itemStyle: { color: "#ea580c" } },
          { value: data?.totalCustomers ?? 0, name: "Customers", itemStyle: { color: "#3b82f6" } },
          { value: Math.max(0, (data?.totalUsers ?? 0) - (data?.totalOwners ?? 0) - (data?.totalCustomers ?? 0)), name: "Admins", itemStyle: { color: "#f59e0b" } },
        ],
      },
    ],
  };

  const statusPieOption = {
    tooltip: { trigger: "item" },
    legend: { bottom: "0%", left: "center", textStyle: { color: "#888" } },
    series: [
      {
        name: "Rental Booking Outcomes",
        type: "pie",
        radius: ["40%", "70%"],
        avoidLabelOverlap: false,
        itemStyle: { borderRadius: 8, borderWidth: 1 },
        label: { show: false },
        data: Object.entries(data?.bookingStatusCounts || {}).map(([status, count]) => {
          let color = "#888";
          if (status === "PENDING") color = "#f59e0b";
          if (status === "APPROVED") color = "#10b981";
          if (status === "REJECTED") color = "#ef4444";
          if (status === "CANCELLED") color = "#64748b";
          if (status === "COMPLETED") color = "#3b82f6";
          return { value: count, name: status, itemStyle: { color } };
        }),
      },
    ],
  };

  const categoryNames = Object.keys(data?.equipmentByCategory || {});
  const categoryCounts = Object.values(data?.equipmentByCategory || {});

  const categoryBarOption = {
    tooltip: { trigger: "axis" },
    xAxis: {
      type: "category",
      data: categoryNames.length > 0 ? categoryNames : ["No Data"],
      axisLabel: { color: "#888", rotate: 20, fontSize: 10 },
    },
    yAxis: {
      type: "value",
      axisLabel: { color: "#888" },
    },
    series: [
      {
        data: categoryCounts.length > 0 ? categoryCounts : [0],
        type: "bar",
        itemStyle: { color: "#3b82f6" },
        barWidth: "40%",
      },
    ],
  };

  return (
    <ProtectedRoute allowedRoles={["ADMIN"]}>
      {isLoading ? (
        <div className="flex flex-col min-h-screen bg-background">
          <Navbar />
          <main className="flex-1 flex items-center justify-center">
            <Loader label="Loading administrative statistics..." />
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
                We encountered an issue compiling global administrative analytics. Please try again.
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
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight">Admin Dashboard</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Overview of users, listed fleet machinery, and rental request transactions.
              </p>
            </div>
          </div>

          {/* Quick Metrics Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <Card className="border shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-semibold text-muted-foreground uppercase">
                  Total Platform Users
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-extrabold flex items-center">
                  <Users className="mr-2 h-6 w-6 text-primary/60 shrink-0" /> {data.totalUsers}
                </div>
              </CardContent>
            </Card>

            <Card className="border shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-semibold text-muted-foreground uppercase">
                  Total Listed Equipment
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
                  Active Bookings Count
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
                  {data.bookedEquipment}
                </div>
              </CardContent>
            </Card>

            <Card className="border shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-semibold text-muted-foreground uppercase">
                  Pending Requests Queue
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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="border shadow-sm">
              <CardHeader>
                <CardTitle className="text-xs font-bold uppercase text-muted-foreground">Users By Role</CardTitle>
              </CardHeader>
              <CardContent className="h-60">
                <ReactECharts option={usersPieOption} style={{ height: "100%", width: "100%" }} />
              </CardContent>
            </Card>

            <Card className="border shadow-sm">
              <CardHeader>
                <CardTitle className="text-xs font-bold uppercase text-muted-foreground">Machinery By Category</CardTitle>
              </CardHeader>
              <CardContent className="h-60">
                <ReactECharts option={categoryBarOption} style={{ height: "100%", width: "100%" }} />
              </CardContent>
            </Card>

            <Card className="border shadow-sm">
              <CardHeader>
                <CardTitle className="text-xs font-bold uppercase text-muted-foreground">Bookings Status Distributions</CardTitle>
              </CardHeader>
              <CardContent className="h-60">
                <ReactECharts option={statusPieOption} style={{ height: "100%", width: "100%" }} />
              </CardContent>
            </Card>
          </div>

          {/* Logs and Activities tables */}
          <div className="space-y-6">
            {/* Recent users list */}
            <Card className="border shadow-sm">
              <CardHeader>
                <CardTitle className="text-sm font-bold">Recent Registered Users</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead>
                      <tr className="border-b bg-muted/40 text-muted-foreground">
                        <th className="p-3">User</th>
                        <th className="p-3">Email</th>
                        <th className="p-3">Role</th>
                        <th className="p-3">Phone</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.recentUsers.map((user) => (
                        <tr key={user.id} className="border-b hover:bg-muted/10">
                          <td className="p-3 font-semibold text-foreground">{user.firstName} {user.lastName}</td>
                          <td className="p-3">{user.email}</td>
                          <td className="p-3 capitalize">{user.role.toLowerCase()}</td>
                          <td className="p-3">{user.phone}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Recent equipment list */}
            <Card className="border shadow-sm">
              <CardHeader>
                <CardTitle className="text-sm font-bold">Recent Listed Equipment</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead>
                      <tr className="border-b bg-muted/40 text-muted-foreground">
                        <th className="p-3">Equipment</th>
                        <th className="p-3">Owner</th>
                        <th className="p-3">Category</th>
                        <th className="p-3">Rate</th>
                        <th className="p-3">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.recentEquipment.map((eq) => (
                        <tr key={eq.id} className="border-b hover:bg-muted/10">
                          <td className="p-3 font-semibold text-foreground">{eq.name}</td>
                          <td className="p-3">{eq.ownerName}</td>
                          <td className="p-3">{eq.categoryName}</td>
                          <td className="p-3">₹{eq.dailyRentalPrice.toLocaleString("en-IN")}/day</td>
                          <td className="p-3 capitalize">{eq.availabilityStatus.toLowerCase()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
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
