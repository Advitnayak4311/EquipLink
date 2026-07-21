"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Calendar, Search, Check, X, ArrowLeft, ArrowRight } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import Sidebar from "@/components/layout/Sidebar";
import Breadcrumb from "@/components/common/Breadcrumb";
import BookingStatusBadge from "@/components/common/BookingStatusBadge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useOwnerBookings, useApproveBooking, useRejectBooking } from "@/lib/api/bookingService";
import { BookingStatus } from "@/types";

export default function OwnerBookingsPage() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<BookingStatus | "">("");
  const [page, setPage] = useState(0);

  // Debounce search query
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(0);
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);

  const { data: pageData, isLoading, refetch } = useOwnerBookings({
    search: debouncedSearch || undefined,
    status: statusFilter || undefined,
    page,
    size: 10,
  });

  const approveMutation = useApproveBooking();
  const rejectMutation = useRejectBooking();

  const handleApprove = async (id: number) => {
    const confirmApprove = window.confirm("Are you sure you want to APPROVE this booking request?");
    if (!confirmApprove) return;

    try {
      await approveMutation.mutateAsync(id);
      toast.success("Booking Request Approved!");
      refetch();
    } catch (err: any) {
      const message = err?.response?.data?.message || "Failed to approve booking request.";
      toast.error(message);
    }
  };

  const handleReject = async (id: number) => {
    const confirmReject = window.confirm("Are you sure you want to REJECT this booking request?");
    if (!confirmReject) return;

    try {
      await rejectMutation.mutateAsync(id);
      toast.success("Booking Request Rejected!");
      refetch();
    } catch {
      toast.error("Failed to reject booking request.");
    }
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <div className="flex-1 flex">
        <Sidebar className="hidden md:flex" />
        <main className="flex-1 container mx-auto px-4 py-8 max-w-5xl">
          <Breadcrumb />

          {/* Heading */}
          <div className="mb-6 mt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Incoming Rental Requests</h1>
              <p className="text-muted-foreground text-sm">
                Review and manage rental requests for your listed fleet.
              </p>
            </div>
          </div>

          {/* Search & Filter bar */}
          <div className="flex flex-col sm:flex-row items-center gap-4 mb-6 bg-card p-4 rounded-xl border">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by equipment or customer name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 h-10 w-full"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value as BookingStatus | "");
                setPage(0);
              }}
              className="flex h-10 w-full sm:w-48 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
            >
              <option value="">All Statuses</option>
              <option value="PENDING">Pending Review</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
              <option value="CANCELLED">Cancelled</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>

          {/* Table / List layout */}
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="border rounded-xl p-5 bg-card animate-pulse h-28" />
              ))}
            </div>
          ) : pageData?.content.length === 0 ? (
            <div className="text-center p-12 bg-card rounded-xl border border-dashed flex flex-col items-center justify-center">
              <Calendar className="h-10 w-10 text-muted-foreground/60 mb-2" />
              <h3 className="text-lg font-bold tracking-tight mb-1">No incoming bookings found</h3>
              <p className="text-sm text-muted-foreground max-w-sm">
                No matching rental requests found in your queue.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {pageData?.content.map((booking) => (
                <Card key={booking.id} className="border bg-card shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-5 space-y-4">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                      {/* Booking Spec details */}
                      <div className="space-y-1">
                        <h3 className="font-bold text-base text-foreground leading-snug">
                          {booking.equipmentName}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          Requested By: <span className="font-semibold text-foreground">{booking.customerName}</span> ({booking.customerEmail})
                        </p>
                        <p className="text-xs text-foreground font-semibold flex items-center pt-1">
                          <Calendar className="mr-1 h-3.5 w-3.5 text-primary" />
                          {booking.startDate} to {booking.endDate}
                        </p>
                      </div>

                      {/* Status Badges & Approve/Reject CTAs */}
                      <div className="flex items-center md:items-end md:flex-col gap-3 justify-between md:justify-start">
                        <BookingStatusBadge status={booking.status} />

                        {booking.status === "PENDING" && (
                          <div className="flex space-x-2">
                            <Button
                              size="xs"
                              variant="outline"
                              className="text-emerald-600 border-emerald-500/20 hover:bg-emerald-500/10 font-bold"
                              onClick={() => handleApprove(booking.id)}
                              disabled={approveMutation.isPending || rejectMutation.isPending}
                            >
                              <Check className="h-3.5 w-3.5 mr-1" /> Approve
                            </Button>
                            <Button
                              size="xs"
                              variant="outline"
                              className="text-rose-600 border-rose-500/20 hover:bg-rose-500/10 font-bold"
                              onClick={() => handleReject(booking.id)}
                              disabled={approveMutation.isPending || rejectMutation.isPending}
                            >
                              <X className="h-3.5 w-3.5 mr-1" /> Reject
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Customer Message */}
                    {booking.message && (
                      <div className="p-3 bg-muted/30 border rounded-lg text-xs text-muted-foreground">
                        <p className="font-semibold text-[10px] uppercase text-muted-foreground/80 mb-1">
                          Customer Message:
                        </p>
                        {booking.message}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Pagination Controls */}
          {pageData && pageData.totalPages > 1 && (
            <div className="flex items-center justify-between border-t pt-6 mt-8">
              <div className="text-xs text-muted-foreground font-semibold">
                Page {pageData.number + 1} of {pageData.totalPages} ({pageData.totalElements} items)
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(page - 1)}
                  disabled={pageData.first}
                  className="text-xs"
                >
                  <ArrowLeft className="mr-1 h-4 w-4" /> Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(page + 1)}
                  disabled={pageData.last}
                  className="text-xs"
                >
                  Next <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </main>
      </div>
      <Footer />
    </div>
  );
}
