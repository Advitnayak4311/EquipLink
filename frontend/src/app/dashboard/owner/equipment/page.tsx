"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, Search, HelpCircle, ArrowLeft, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import Sidebar from "@/components/layout/Sidebar";
import Breadcrumb from "@/components/common/Breadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  useMyEquipment,
  useMyStats,
  useDeleteEquipment,
  useCategories,
} from "@/lib/api/equipmentService";
import EquipmentGrid from "@/components/common/EquipmentGrid";
import { EquipmentStatus } from "@/types";

import ProtectedRoute from "@/components/common/ProtectedRoute";

export default function OwnerEquipmentListPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<number | string>("");
  const [selectedStatus, setSelectedStatus] = useState<EquipmentStatus | "">("");
  const [page, setPage] = useState(0);

  // API Queries & Mutations
  const { data: stats, isLoading: loadingStats } = useMyStats();
  const { data: categories = [] } = useCategories();
  const { data: pageData, isLoading: loadingList, refetch } = useMyEquipment({
    search: search || undefined,
    categoryId: selectedCategory || undefined,
    status: selectedStatus || undefined,
    page,
    size: 10,
  });

  const deleteMutation = useDeleteEquipment();

  const handleEdit = (id: number) => {
    router.push(`/dashboard/owner/equipment/edit/${id}`);
  };

  const handleDelete = async (id: number) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this listing?");
    if (!confirmDelete) return;

    try {
      await deleteMutation.mutateAsync(id);
      toast.success("Listing deleted successfully.");
      refetch();
    } catch {
      toast.error("Failed to delete listing.");
    }
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  return (
    <ProtectedRoute allowedRoles={["OWNER", "ADMIN"]}>
      <div className="flex flex-col min-h-screen bg-background">
        <Navbar />
        <div className="flex-1 flex">
          <Sidebar className="hidden md:flex" />
          <main className="flex-1 container mx-auto px-4 py-8 max-w-6xl">
            <Breadcrumb />

            {/* Heading */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div>
                <h1 className="text-3xl font-extrabold tracking-tight">My Equipment Fleet</h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Manage your active machinery listings, edit specifications, or add new units.
                </p>
              </div>
              <Button asChild className="font-semibold shadow-sm">
                <Link href="/dashboard/owner/equipment/new">
                  <Plus className="mr-2 h-4 w-4" />
                  List New Equipment
                </Link>
              </Button>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <Card className="border shadow-sm">
                <CardHeader className="py-3">
                  <CardTitle className="text-xs text-muted-foreground uppercase font-semibold">Total Listed Units</CardTitle>
                </CardHeader>
                <CardContent className="py-2">
                  <p className="text-2xl font-bold">{loadingStats ? "…" : stats?.total ?? 0}</p>
                </CardContent>
              </Card>

              <Card className="border shadow-sm">
                <CardHeader className="py-3">
                  <CardTitle className="text-xs text-muted-foreground uppercase font-semibold">Available for Lease</CardTitle>
                </CardHeader>
                <CardContent className="py-2">
                  <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                    {loadingStats ? "…" : stats?.available ?? 0}
                  </p>
                </CardContent>
              </Card>

              <Card className="border shadow-sm">
                <CardHeader className="py-3">
                  <CardTitle className="text-xs text-muted-foreground uppercase font-semibold">Currently Rented Out</CardTitle>
                </CardHeader>
                <CardContent className="py-2">
                  <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                    {loadingStats ? "…" : stats?.booked ?? 0}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row items-center gap-4 mb-6 bg-card p-4 rounded-xl border shadow-sm">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by equipment name, brand, or model..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(0);
                  }}
                  className="pl-9 text-xs"
                />
              </div>

              <div className="flex items-center gap-2 w-full md:w-auto">
                <select
                  value={selectedCategory}
                  onChange={(e) => {
                    setSelectedCategory(e.target.value ? Number(e.target.value) : "");
                    setPage(0);
                  }}
                  className="h-9 w-full md:w-48 rounded-md border border-input bg-background px-3 text-xs ring-offset-background focus-visible:outline-none"
                >
                  <option value="">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>

                <select
                  value={selectedStatus}
                  onChange={(e) => {
                    setSelectedStatus(e.target.value as EquipmentStatus | "");
                    setPage(0);
                  }}
                  className="h-9 w-full md:w-40 rounded-md border border-input bg-background px-3 text-xs ring-offset-background focus-visible:outline-none"
                >
                  <option value="">All Statuses</option>
                  <option value="AVAILABLE">AVAILABLE</option>
                  <option value="BOOKED">RENTED</option>
                  <option value="MAINTENANCE">MAINTENANCE</option>
                </select>
              </div>
            </div>

            {/* Equipment Grid */}
            <EquipmentGrid
              items={pageData?.content}
              isLoading={loadingList}
              emptyMessage="Listings matching filters or search queries could not be found."
              showActions
              onEdit={handleEdit}
              onDelete={handleDelete}
            />

            {/* Pagination */}
            {pageData && pageData.totalPages > 1 && (
              <div className="flex items-center justify-between mt-6 pt-4 border-t">
                <p className="text-xs text-muted-foreground">
                  Showing page <span className="font-bold text-foreground">{pageData.number + 1}</span> of{" "}
                  <span className="font-bold text-foreground">{pageData.totalPages}</span>
                </p>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(page - 1)}
                    disabled={pageData.first}
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(page + 1)}
                    disabled={pageData.last}
                  >
                    Next
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </main>
        </div>
        <Footer />
      </div>
    </ProtectedRoute>
  );
}
