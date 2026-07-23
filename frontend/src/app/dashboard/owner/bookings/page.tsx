"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Calendar, Search, Check, X, ArrowLeft, ArrowRight, Video, FileCheck, ShieldCheck } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import Sidebar from "@/components/layout/Sidebar";
import Breadcrumb from "@/components/common/Breadcrumb";
import BookingStatusBadge from "@/components/common/BookingStatusBadge";
import LocationThreeWayBadge from "@/components/common/LocationThreeWayBadge";
import LiveVideoVerificationModal from "@/components/common/LiveVideoVerificationModal";
import LiveDocumentVerificationModal from "@/components/common/LiveDocumentVerificationModal";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useOwnerBookings, useApproveBooking, useRejectBooking, useVerifyVideo, useVerifyDocuments, BookingSummaryResponse } from "@/lib/api/bookingService";
import { BookingStatus } from "@/types";

export default function OwnerBookingsPage() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<BookingStatus | "">("");
  const [page, setPage] = useState(0);

  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [docModalOpen, setDocModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<BookingSummaryResponse | null>(null);

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
  const verifyVideoMutation = useVerifyVideo();
  const verifyDocMutation = useVerifyDocuments();

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

  const openVideoInspection = (booking: BookingSummaryResponse) => {
    setSelectedBooking(booking);
    setVideoModalOpen(true);
  };

  const openDocInspection = (booking: BookingSummaryResponse) => {
    setSelectedBooking(booking);
    setDocModalOpen(true);
  };

  const handleVerifyVideoSuccess = async () => {
    if (!selectedBooking) return;
    try {
      await verifyVideoMutation.mutateAsync(selectedBooking.id);
      refetch();
    } catch {
      // Ignored
    }
  };

  const handleVerifyDocSuccess = async () => {
    if (!selectedBooking) return;
    try {
      await verifyDocMutation.mutateAsync(selectedBooking.id);
      refetch();
    } catch {
      // Ignored
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background font-sans">
      <Navbar />
      <div className="flex-1 flex">
        <Sidebar className="hidden md:flex" />
        <main className="flex-1 container mx-auto px-4 py-8 max-w-5xl">
          <Breadcrumb />

          {/* Heading */}
          <div className="mb-6 mt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight font-heading">Incoming Rental Requests & Verification</h1>
              <p className="text-muted-foreground text-sm">
                Review 3-way jobsite locations, demonstrate machinery live over video, and present compliance documents to lessees.
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
              suppressHydrationWarning
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value as BookingStatus | "");
                setPage(0);
              }}
              className="flex h-10 w-full sm:w-48 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background font-semibold"
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
            <div className="space-y-6">
              {pageData?.content.map((booking) => (
                <Card key={booking.id} className="border bg-card shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-5 space-y-4">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                      {/* Booking Spec details */}
                      <div className="space-y-1">
                        <h3 className="font-extrabold text-base text-foreground leading-snug font-heading">
                          {booking.equipmentName}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          Requested By: <span className="font-bold text-foreground">{booking.customerName}</span> ({booking.customerEmail})
                        </p>
                        <p className="text-xs text-foreground font-semibold flex items-center pt-1">
                          <Calendar className="mr-1 h-3.5 w-3.5 text-amber-500" />
                          {booking.startDate} to {booking.endDate}
                        </p>
                      </div>

                      {/* Status Badges & Approve/Reject CTAs */}
                      <div className="flex items-center md:items-end md:flex-col gap-3 justify-between md:justify-start">
                        <BookingStatusBadge status={booking.status} />

                        {booking.status === "PENDING" && (
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-emerald-600 border-emerald-500/30 hover:bg-emerald-500/10 font-bold text-xs"
                              onClick={() => handleApprove(booking.id)}
                              disabled={approveMutation.isPending || rejectMutation.isPending}
                            >
                              <Check className="h-3.5 w-3.5 mr-1" /> Approve Request
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-rose-600 border-rose-500/30 hover:bg-rose-500/10 font-bold text-xs"
                              onClick={() => handleReject(booking.id)}
                              disabled={approveMutation.isPending || rejectMutation.isPending}
                            >
                              <X className="h-3.5 w-3.5 mr-1" /> Reject
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* 3-Way Location Engine */}
                    <LocationThreeWayBadge
                      machineLocation={booking.machineLocation || "Owner Machinery Yard"}
                      customerLocation={booking.customerLocation || "Lessee Corporate HQ"}
                      siteAddress={booking.siteAddress || "Target Jobsite Address"}
                      estimatedDistanceKm={booking.estimatedDistanceKm || 48}
                      mobilizationCost={booking.mobilizationCost || 5760}
                    />

                    {/* Live Video & Document Verification Suite Controls */}
                    <div className="p-3.5 rounded-xl bg-slate-900/40 border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="border-amber-500/40 text-amber-400 font-bold bg-amber-950/40 text-[10px]">
                          <ShieldCheck className="w-3 h-3 mr-1 inline" />
                          Verification: {booking.verificationStatus || "UNVERIFIED"}
                        </Badge>
                        <span className="text-[11px] text-muted-foreground hidden sm:inline">
                          Demonstrate machinery live over video or present legal RTO compliance documents.
                        </span>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openVideoInspection(booking)}
                          className="text-xs font-bold border-amber-500/40 bg-amber-500/10 text-amber-400 hover:bg-amber-500 hover:text-slate-950"
                        >
                          <Video className="w-3.5 h-3.5 mr-1.5" /> Start Live Video Demo
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openDocInspection(booking)}
                          className="text-xs font-bold border-emerald-500/40 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-slate-950"
                        >
                          <FileCheck className="w-3.5 h-3.5 mr-1.5" /> Present RC & Permits
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Modals */}
          {selectedBooking && (
            <>
              <LiveVideoVerificationModal
                open={videoModalOpen}
                onOpenChange={setVideoModalOpen}
                bookingId={selectedBooking.id}
                equipmentName={selectedBooking.equipmentName}
                videoCallRoomId={selectedBooking.videoCallRoomId}
                isVerified={selectedBooking.verificationStatus === "VIDEO_VERIFIED" || selectedBooking.verificationStatus === "FULLY_VERIFIED"}
                onVerifySuccess={handleVerifyVideoSuccess}
              />
              <LiveDocumentVerificationModal
                open={docModalOpen}
                onOpenChange={setDocModalOpen}
                bookingId={selectedBooking.id}
                equipmentName={selectedBooking.equipmentName}
                isVerified={selectedBooking.verificationStatus === "DOCUMENTS_VERIFIED" || selectedBooking.verificationStatus === "FULLY_VERIFIED"}
                onVerifySuccess={handleVerifyDocSuccess}
              />
            </>
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
                  onClick={() => setPage(page - 1)}
                  disabled={pageData.first}
                  className="text-xs font-bold"
                >
                  <ArrowLeft className="mr-1 h-4 w-4" /> Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(page + 1)}
                  disabled={pageData.last}
                  className="text-xs font-bold"
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
