"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { MapPin, Shield, Calendar, Sparkles, Share2, Mail, Phone, User, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import Breadcrumb from "@/components/common/Breadcrumb";
import Loader from "@/components/common/Loader";
import StatusBadge from "@/components/common/StatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import ImageCarousel from "@/components/marketplace/ImageCarousel";
import RelatedEquipment from "@/components/marketplace/RelatedEquipment";
import { Star, Heart, Trash2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useWishlist, useAddToWishlist, useRemoveFromWishlist } from "@/lib/api/wishlistService";
import { useEquipmentReviews, useCreateReview, useDeleteReview } from "@/lib/api/reviewService";
import { useMyBookings, useCreateBooking } from "@/lib/api/bookingService";
import { useEquipmentDetails } from "@/lib/api/marketplaceService";
import { useAuth } from "@/contexts/AuthContext";
import BookingForm, { BookingFormValues } from "@/components/common/BookingForm";

export default function EquipmentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const idStr = params.id as string;
  const id = Number(idStr);

  const { data: equipment, isLoading, error } = useEquipmentDetails(id);
  const { isAuthenticated, user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const createBookingMutation = useCreateBooking();

  // Wishlist queries & mutations
  const { data: wishlistItems, refetch: refetchWishlist } = useWishlist();
  const addToWishlistMutation = useAddToWishlist();
  const removeFromWishlistMutation = useRemoveFromWishlist();
  const isSavedInWishlist = wishlistItems?.some((item) => item.equipmentId === id) || false;

  const handleWishlistToggle = async () => {
    if (!isAuthenticated) {
      toast.error("Please login to save machinery to your wishlist.");
      router.push("/login");
      return;
    }
    if (user?.role !== "CUSTOMER") {
      toast.error("Only customers can save listings to their wishlist.");
      return;
    }
    try {
      if (isSavedInWishlist) {
        await removeFromWishlistMutation.mutateAsync(id);
        toast.success("Removed from wishlist");
      } else {
        await addToWishlistMutation.mutateAsync(id);
        toast.success("Saved to wishlist");
      }
      refetchWishlist();
    } catch {
      toast.error("Failed to update wishlist selection");
    }
  };

  // Reviews queries & mutations
  const { data: reviewsSummary, refetch: refetchReviews } = useEquipmentReviews(id);
  const deleteReviewMutation = useDeleteReview(id);

  const handleDeleteReview = async (reviewId: number) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this review?");
    if (!confirmDelete) return;
    try {
      await deleteReviewMutation.mutateAsync(reviewId);
      toast.success("Review deleted successfully");
      refetchReviews();
    } catch {
      toast.error("Failed to delete review");
    }
  };

  // Review eligibility checks
  const { data: customerBookings } = useMyBookings();
  const isEligibleToReview = customerBookings?.content?.some(
    (b) => b.equipmentId === id && (b.status === "APPROVED" || b.status === "COMPLETED")
  ) || false;
  const hasAlreadyReviewed = reviewsSummary?.reviews?.some((r) => r.customerId === user?.id) || false;

  // Review form schema validation
  const reviewSchema = z.object({
    rating: z.number().min(1, "Please select at least 1 star").max(5),
    comment: z.string().max(1000, "Comment cannot exceed 1000 characters").optional(),
  });
  type ReviewFormValues = z.infer<typeof reviewSchema>;

  const createReviewMutation = useCreateReview();
  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: { rating: 5, comment: "" }
  });

  const ratingVal = watch("rating");

  const onReviewSubmit = async (values: ReviewFormValues) => {
    try {
      await createReviewMutation.mutateAsync({
        equipmentId: id,
        rating: values.rating,
        comment: values.comment || ""
      });
      toast.success("Review submitted successfully");
      reset();
      refetchReviews();
    } catch (err: any) {
      const message = err?.response?.data?.message || "Failed to submit review.";
      toast.error(message);
    }
  };

  const handleBookingSubmit = async (values: BookingFormValues) => {
    try {
      await createBookingMutation.mutateAsync({
        equipmentId: id,
        startDate: values.startDate,
        endDate: values.endDate,
        message: values.message,
        siteAddress: values.siteAddress,
        workPurpose: values.workPurpose,
        contactPhone: values.contactPhone,
        companyName: values.companyName,
        gstin: values.gstin,
      });
      toast.success("Booking Request Submitted");
      setIsModalOpen(false);
    } catch (err: any) {
      const message = err?.response?.data?.message || "Failed to submit booking request.";
      toast.error(message);
    }
  };

  const handleBookClick = () => {
    if (!isAuthenticated) {
      toast.error("Please login to request rental booking.");
      router.push("/login");
      return;
    }
    if (user?.role !== "CUSTOMER") {
      toast.error("Only customers can submit booking requests.");
      return;
    }
    if (equipment?.availabilityStatus !== "AVAILABLE") {
      toast.error("This machinery listing is currently unavailable.");
      return;
    }
    setIsModalOpen(true);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: equipment?.name || "Heavy Machinery Listing",
          text: `Check out this ${equipment?.brand} ${equipment?.model} for rent on EquipLink!`,
          url: window.location.href,
        })
        .catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Listing link copied to clipboard!");
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <Loader label="Loading machinery specs..." />
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !equipment) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center p-8 bg-card rounded-xl border max-w-md shadow-sm">
            <h3 className="text-lg font-bold text-destructive mb-2">Listing Not Found</h3>
            <p className="text-muted-foreground text-sm mb-4">
              The requested machinery listing does not exist or has been deleted from the catalog.
            </p>
            <Button onClick={() => router.push("/marketplace")} size="sm">
              Back to Marketplace
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8 max-w-6xl space-y-12">
        <div>
          <Breadcrumb />
          
          {/* Back button */}
          <button
            onClick={() => router.back()}
            className="inline-flex items-center text-xs font-semibold text-muted-foreground hover:text-foreground mt-4 transition-colors"
          >
            <ArrowLeft className="mr-1 h-3.5 w-3.5" /> Back to Search Results
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Block: Image Carousel Gallery */}
          <div className="lg:col-span-7">
            <ImageCarousel images={equipment.images} altText={equipment.name} />
          </div>

          {/* Right Block: Specifications & Lessor Details */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary">
                  {equipment.categoryName}
                </span>
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="icon" onClick={handleShare} className="h-8 w-8 text-muted-foreground">
                    <Share2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleWishlistToggle}
                    className={`h-8 w-8 transition-colors ${
                      isSavedInWishlist
                        ? "text-rose-500 hover:text-rose-600 hover:bg-rose-50/50"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Heart className="h-4 w-4" fill={isSavedInWishlist ? "currentColor" : "none"} />
                  </Button>
                </div>
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight leading-tight">{equipment.name}</h1>
              <div className="flex flex-wrap items-center gap-2 mt-1">
                <p className="text-sm font-semibold text-muted-foreground">
                  {equipment.brand} • {equipment.model}
                </p>
                {reviewsSummary && reviewsSummary.totalReviews > 0 && (
                  <div className="flex items-center space-x-1.5 border-l pl-2 text-xs">
                    <div className="flex text-amber-500">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className="h-3.5 w-3.5"
                          fill={i < Math.round(reviewsSummary.averageRating) ? "currentColor" : "none"}
                        />
                      ))}
                    </div>
                    <span className="font-bold text-foreground">{reviewsSummary.averageRating}</span>
                    <span className="text-muted-foreground">({reviewsSummary.totalReviews} reviews)</span>
                  </div>
                )}
              </div>
            </div>

            {/* Price Box */}
            <div className="p-4 bg-muted/20 border rounded-xl flex items-center justify-between shadow-sm">
              <div>
                <p className="text-xs text-muted-foreground font-semibold">Daily Rental Cost</p>
                <div className="flex items-baseline space-x-1 mt-1">
                  <span className="text-3xl font-extrabold text-primary">
                    ₹{Number(equipment.dailyRentalPrice).toLocaleString("en-IN")}
                  </span>
                  <span className="text-sm text-muted-foreground font-medium"> / day</span>
                </div>
              </div>
              <Button size="lg" onClick={handleBookClick} disabled={equipment.availabilityStatus !== "AVAILABLE"}>
                Book Machinery
              </Button>
            </div>

            {/* Key Specs */}
            <div className="space-y-4 border-t border-b py-4">
              <h3 className="font-bold text-sm tracking-wide">Key Specifications</h3>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="flex items-center space-x-2.5 text-muted-foreground">
                  <Calendar className="h-4 w-4 text-primary/60 shrink-0" />
                  <div>
                    <p className="text-[10px] uppercase font-bold text-muted-foreground/80">Manufacture Year</p>
                    <p className="font-semibold text-foreground">{equipment.manufactureYear}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2.5 text-muted-foreground">
                  <MapPin className="h-4 w-4 text-primary/60 shrink-0" />
                  <div>
                    <p className="text-[10px] uppercase font-bold text-muted-foreground/80">Location</p>
                    <p className="font-semibold text-foreground truncate max-w-[150px]">
                      {equipment.location}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2.5 text-muted-foreground">
                  <StatusBadge status={equipment.availabilityStatus} />
                  <div>
                    <p className="text-[10px] uppercase font-bold text-muted-foreground/80">Fleet Status</p>
                    <p className="font-semibold text-foreground capitalize">
                      {equipment.availabilityStatus.toLowerCase()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2.5 text-muted-foreground">
                  <Sparkles className="h-4 w-4 text-primary/60 shrink-0" />
                  <div>
                    <p className="text-[10px] uppercase font-bold text-muted-foreground/80">Verification Status</p>
                    <p className="font-semibold text-foreground">Verified Listing</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Lessor (Owner) Information */}
            <div className="p-4 border rounded-xl bg-card space-y-3 shadow-sm">
              <h4 className="font-bold text-sm flex items-center">
                <User className="mr-1.5 h-4 w-4 text-primary" /> Lessor Contact Details
              </h4>
              <div className="space-y-2 text-xs text-muted-foreground">
                <p className="flex items-center text-foreground font-semibold">
                  Name: {equipment.ownerName}
                </p>
                <p className="flex items-center">
                  <Mail className="mr-2 h-3.5 w-3.5 text-primary/60 shrink-0" /> {equipment.ownerEmail}
                </p>
                <p className="flex items-center">
                  <Phone className="mr-2 h-3.5 w-3.5 text-primary/60 shrink-0" /> {equipment.ownerPhone}
                </p>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <h3 className="font-bold text-sm">Description</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {equipment.description}
              </p>
            </div>
          </div>
        </div>

        {/* Reviews & Ratings Section */}
        <div className="border-t pt-8 space-y-6">
          <div>
            <h2 className="text-xl font-bold tracking-tight">Customer Reviews</h2>
            <p className="text-xs text-muted-foreground">Hear what other construction and fleet operators say about this listing.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left side: Rating Overview & Form */}
            <div className="lg:col-span-4 space-y-6">
              <Card className="border shadow-sm p-5 space-y-4">
                <h3 className="font-bold text-sm">Rating Summary</h3>
                <div className="flex items-center space-x-3">
                  <div className="text-4xl font-extrabold text-foreground">
                    {reviewsSummary?.averageRating || "0.0"}
                  </div>
                  <div>
                    <div className="flex text-amber-500">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className="h-4 w-4"
                          fill={i < Math.round(reviewsSummary?.averageRating || 0) ? "currentColor" : "none"}
                        />
                      ))}
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-0.5">
                      Based on {reviewsSummary?.totalReviews || 0} reviews
                    </p>
                  </div>
                </div>
              </Card>

              {/* Submission Form */}
              {isEligibleToReview && !hasAlreadyReviewed && (
                <Card className="border shadow-sm p-5 space-y-4">
                  <div>
                    <h3 className="font-bold text-sm">Write a Review</h3>
                    <p className="text-[10px] text-muted-foreground">Share your feedback about this heavy equipment.</p>
                  </div>
                  <form onSubmit={handleSubmit(onReviewSubmit)} className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-muted-foreground">Rating</label>
                      <div className="flex space-x-1">
                        {Array.from({ length: 5 }).map((_, i) => {
                          const starVal = i + 1;
                          return (
                            <button
                              key={i}
                              type="button"
                              onClick={() => setValue("rating", starVal)}
                              className={`p-1 hover:scale-110 transition-transform ${
                                starVal <= ratingVal ? "text-amber-500" : "text-muted-foreground/30"
                              }`}
                            >
                              <Star className="h-6 w-6" fill={starVal <= ratingVal ? "currentColor" : "none"} />
                            </button>
                          );
                        })}
                      </div>
                      {errors.rating && <p className="text-[10px] text-destructive">{errors.rating.message}</p>}
                    </div>

                    <div className="space-y-1">
                      <label htmlFor="comment" className="text-xs font-semibold text-muted-foreground">Comment (Optional)</label>
                      <textarea
                        id="comment"
                        placeholder="Write a brief comment about this equipment performance..."
                        className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        {...register("comment")}
                      />
                      {errors.comment && <p className="text-[10px] text-destructive">{errors.comment.message}</p>}
                    </div>

                    <Button type="submit" size="sm" className="w-full" disabled={createReviewMutation.isPending}>
                      Submit Review
                    </Button>
                  </form>
                </Card>
              )}
            </div>

            {/* Right side: Reviews List */}
            <div className="lg:col-span-8 space-y-4">
              {!reviewsSummary || reviewsSummary.reviews.length === 0 ? (
                <div className="text-center p-12 bg-muted/20 border rounded-xl flex flex-col items-center justify-center space-y-2">
                  <Star className="h-8 w-8 text-muted-foreground/40" />
                  <p className="text-xs text-muted-foreground">No reviews have been written for this equipment yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {reviewsSummary.reviews.map((r) => (
                    <Card key={r.id} className="border shadow-sm p-4 relative">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <span className="font-bold text-xs text-foreground">{r.customerName}</span>
                            <span className="text-[10px] text-muted-foreground">{new Date(r.createdAt).toLocaleDateString()}</span>
                          </div>
                          <div className="flex text-amber-500">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className="h-3.5 w-3.5"
                                fill={i < r.rating ? "currentColor" : "none"}
                              />
                            ))}
                          </div>
                        </div>

                        {/* Delete button (only for Admins or review owner) */}
                        {(user?.role === "ADMIN" || r.customerId === user?.id) && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-destructive hover:bg-destructive/10"
                            onClick={() => handleDeleteReview(r.id)}
                            disabled={deleteReviewMutation.isPending}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        )}
                      </div>
                      {r.comment && (
                        <p className="text-xs text-muted-foreground mt-3 leading-relaxed bg-muted/10 p-2.5 rounded border">
                          {r.comment}
                        </p>
                      )}
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Similar Listings Carousel / Grid */}
        <RelatedEquipment equipmentId={equipment.id} />
      </main>
      <Footer />

      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border rounded-xl shadow-lg w-full max-w-lg p-6 space-y-4 relative">
            <div className="flex items-center justify-between pb-2 border-b">
              <h2 className="text-lg font-bold tracking-tight">Request Rental Booking</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-muted-foreground hover:text-foreground text-sm font-semibold transition-colors"
              >
                ✕
              </button>
            </div>
            <BookingForm
              equipmentName={equipment.name}
              dailyPrice={Number(equipment.dailyRentalPrice)}
              isSubmitting={createBookingMutation.isPending}
              onCancel={() => setIsModalOpen(false)}
              onSubmit={handleBookingSubmit}
            />
          </div>
        </div>
      )}
    </div>
  );
}
