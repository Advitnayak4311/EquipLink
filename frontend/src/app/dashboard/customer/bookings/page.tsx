"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Calendar, Truck, ArrowLeft, ArrowRight } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import Sidebar from "@/components/layout/Sidebar";
import Breadcrumb from "@/components/common/Breadcrumb";
import BookingStatusBadge from "@/components/common/BookingStatusBadge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useMyBookings, useCancelBooking } from "@/lib/api/bookingService";
import Loader from "@/components/common/Loader";
import { resolveImageUrl } from "@/lib/utils";

export default function CustomerBookingsPage() {
  const [page, setPage] = useState(0);

  const { data: pageData, isLoading, refetch } = useMyBookings({
    page,
    size: 10,
  });

  const cancelMutation = useCancelBooking();

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
          <div className="mb-6 mt-2">
            <h1 className="text-3xl font-bold tracking-tight">My Rental Requests</h1>
            <p className="text-muted-foreground text-sm">
              Track and manage machinery rental requests submitted to fleet owners.
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
            <div className="space-y-4">
              {pageData?.content.map((booking) => {
                const imageUrl = resolveImageUrl(booking.equipmentImageUrl);

                return (
                  <Card key={booking.id} className="border overflow-hidden bg-card shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-5">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                        {/* Equipment cover & details */}
                        <div className="flex items-start space-x-4">
                          <div className="w-24 aspect-video bg-muted flex items-center justify-center rounded-lg overflow-hidden shrink-0 relative">
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
                            <Truck className="h-8 w-8 text-muted-foreground/60 absolute" />
                          </div>
                          <div className="space-y-1">
                            <h3 className="font-bold text-base leading-snug">
                              <Link href={`/equipment/${booking.equipmentId}`} className="hover:text-primary transition-colors">
                                {booking.equipmentName}
                              </Link>
                            </h3>
                            <p className="text-xs text-muted-foreground">Lessor Email: {booking.customerEmail}</p>
                            <p className="text-xs text-foreground font-semibold flex items-center pt-1">
                              <Calendar className="mr-1 h-3.5 w-3.5 text-primary" />
                              {booking.startDate} to {booking.endDate}
                            </p>
                          </div>
                        </div>

                        {/* Status badge & cancel button */}
                        <div className="flex sm:flex-col items-start sm:items-end justify-between sm:justify-start gap-3">
                          <BookingStatusBadge status={booking.status} />
                          {booking.status === "PENDING" && (
                            <Button
                              size="xs"
                              variant="destructive"
                              onClick={() => handleCancel(booking.id)}
                            >
                              Cancel Request
                            </Button>
                          )}
                        </div>
                      </div>

                      {/* Optional message to owner */}
                      {booking.message && (
                        <div className="mt-4 p-3 bg-muted/30 border rounded-lg text-xs text-muted-foreground">
                          <p className="font-semibold text-[10px] uppercase text-muted-foreground/80 mb-1">
                            Your Message to Owner:
                          </p>
                          {booking.message}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
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

// Helper to make Next.js build compile cleanly since Link is used in return
import Link from "next/link";
