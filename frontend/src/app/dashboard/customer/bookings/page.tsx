"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Calendar, Truck, ArrowLeft, ArrowRight, Video, FileCheck, ShieldCheck } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";
import { useMyBookings, useCancelBooking, useVerifyVideo, useVerifyDocuments, BookingSummaryResponse } from "@/lib/api/bookingService";
import Loader from "@/components/common/Loader";
import { resolveImageUrl } from "@/lib/utils";

export default function CustomerBookingsPage() {
  const [page, setPage] = useState(0);
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [docModalOpen, setDocModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<BookingSummaryResponse | null>(null);

  const { data: pageData, isLoading, refetch } = useMyBookings({
    page,
    size: 10,
  });

  const cancelMutation = useCancelBooking();
  const verifyVideoMutation = useVerifyVideo();
  const verifyDocMutation = useVerifyDocuments();

  const handleCancel = async (id: number) => {
    const confirmCancel = window.confirm("Are you sure you want to cancel this booking request?");
    if (!confirmCancel) return;

    try {
      await cancelMutation.mutateAsync(id);
      toast.success("Booking request cancelled successfully!");
      refetch();
    } catch {
      toast.error("Failed to cancel booking request.");
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
          <div className="mb-6 mt-2">
            <h1 className="text-3xl font-extrabold tracking-tight font-heading">My Rental Requests & Verifications</h1>
            <p className="text-muted-foreground text-sm">
              Track 3-way jobsite locations, join live video machinery inspections, and verify owner compliance documents.
            </p>
          </div>

          {/* Bookings Lists */}
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="border rounded-xl p-5 space-y-4 animate-pulse bg-card">
                  <div className="flex space-x-4">
                    <div className="w-24 aspect-video bg-muted rounded-lg" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-muted rounded w-1/3" />
                      <div className="h-3 bg-muted rounded w-1/4" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : pageData?.content.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 bg-card rounded-xl border border-dashed text-center">
              <Calendar className="h-12 w-12 text-muted-foreground/60 mb-3" />
              <h3 className="text-lg font-bold tracking-tight mb-1">No bookings found</h3>
              <p className="text-sm text-muted-foreground max-w-sm mb-4">
                You haven't requested any machinery rentals yet. Browse the catalog to find active listings!
              </p>
              <Button asChild size="sm">
                <Link href="/marketplace">Explore Marketplace</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {pageData?.content.map((booking) => {
                const imageUrl = resolveImageUrl(booking.equipmentImageUrl);

                return (
                  <Card key={booking.id} className="border overflow-hidden bg-card shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-5 space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                        {/* Equipment cover & details */}
                        <div className="flex items-start space-x-4">
                          <div className="w-24 aspect-video bg-slate-900 flex items-center justify-center rounded-lg overflow-hidden shrink-0 relative">
                            {imageUrl ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={imageUrl}
                                alt={booking.equipmentName}
                                referrerPolicy="no-referrer"
                                onError={(e) => {
                                  e.currentTarget.style.display = "none";
                                }}
                                className="object-cover w-full h-full relative z-10"
                              />
                            ) : null}
                            <Truck className="h-8 w-8 text-amber-500/80 absolute" />
                          </div>
                          <div className="space-y-1">
                            <h3 className="font-extrabold text-base leading-snug font-heading">
                              <Link href={`/equipment/${booking.equipmentId}`} className="hover:text-amber-500 transition-colors">
                                {booking.equipmentName}
                              </Link>
                            </h3>
                            <p className="text-xs text-muted-foreground">Lessor Email: {booking.customerEmail}</p>
                            <p className="text-xs text-foreground font-semibold flex items-center pt-1">
                              <Calendar className="mr-1 h-3.5 w-3.5 text-amber-500" />
                              {booking.startDate} to {booking.endDate}
                            </p>
                          </div>
                        </div>

                        {/* Status & Action Buttons */}
                        <div className="flex sm:flex-col items-start sm:items-end justify-between sm:justify-start gap-3">
                          <BookingStatusBadge status={booking.status} />
                          {booking.status === "PENDING" && (
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleCancel(booking.id)}
                              className="text-xs font-bold"
                            >
                              Cancel Request
                            </Button>
                          )}
                        </div>
                      </div>

                      {/* 3-Way Jobsite Location Engine */}
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
                            Status: {booking.verificationStatus || "UNVERIFIED"}
                          </Badge>
                          <span className="text-[11px] text-muted-foreground hidden sm:inline">
                            Perform live video inspection or verify legal RTO certificates.
                          </span>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openVideoInspection(booking)}
                            className="text-xs font-bold border-amber-500/40 bg-amber-500/10 text-amber-400 hover:bg-amber-500 hover:text-slate-950"
                          >
                            <Video className="w-3.5 h-3.5 mr-1.5" /> Live Video Inspection
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openDocInspection(booking)}
                            className="text-xs font-bold border-emerald-500/40 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-slate-950"
                          >
                            <FileCheck className="w-3.5 h-3.5 mr-1.5" /> Inspect RC & License
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
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

// Helper to make Next.js build compile cleanly since Link is used in return
import Link from "next/link";
