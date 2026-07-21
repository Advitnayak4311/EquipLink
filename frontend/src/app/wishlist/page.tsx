"use client";

import Link from "next/link";
import { Heart, Trash2, MapPin, Truck, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import Breadcrumb from "@/components/common/Breadcrumb";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useWishlist, useRemoveFromWishlist } from "@/lib/api/wishlistService";
import Loader from "@/components/common/Loader";
import { resolveImageUrl } from "@/lib/utils";

import ProtectedRoute from "@/components/common/ProtectedRoute";

export default function WishlistPage() {
  const { data: wishlistItems, isLoading, refetch } = useWishlist();
  const removeMutation = useRemoveFromWishlist();

  const handleRemove = async (equipmentId: number) => {
    try {
      await removeMutation.mutateAsync(equipmentId);
      toast.success("Machinery listing removed from wishlist");
      refetch();
    } catch {
      toast.error("Failed to remove item from wishlist");
    }
  };

  return (
    <ProtectedRoute>
      {isLoading ? (
        <div className="flex flex-col min-h-screen bg-background">
          <Navbar />
          <main className="flex-1 flex items-center justify-center">
            <Loader label="Loading wishlist items..." />
          </main>
          <Footer />
        </div>
      ) : (
        <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8 max-w-5xl">
        <Breadcrumb />

        {/* Heading */}
        <div className="mb-8 mt-2">
          <h1 className="text-3xl font-bold tracking-tight">My Saved Wishlist</h1>
          <p className="text-muted-foreground text-sm">
            Keep track of heavy machinery and construction listings you are interested in renting.
          </p>
        </div>

        {/* Wishlist Items List */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-pulse">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="border rounded-xl h-44 bg-card" />
            ))}
          </div>
        ) : !wishlistItems || wishlistItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-16 bg-card border border-dashed rounded-2xl text-center max-w-lg mx-auto">
            <Heart className="h-12 w-12 text-muted-foreground/60 mb-3" />
            <h3 className="text-lg font-bold tracking-tight mb-1">Your wishlist is empty</h3>
            <p className="text-sm text-muted-foreground mb-6">
              You haven't saved any heavy equipment listings to your wishlist yet.
            </p>
            <Button asChild>
              <Link href="/marketplace">Explore Machinery Marketplace</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {wishlistItems.map((item) => {
              const imageUrl = resolveImageUrl(item.imageUrl);

              return (
                <Card key={item.id} className="border overflow-hidden bg-card shadow-sm hover:shadow-md transition-shadow relative">
                  <CardContent className="p-5 flex space-x-4">
                    {/* Image Cover */}
                    <div className="w-28 aspect-video bg-muted flex items-center justify-center rounded-lg overflow-hidden shrink-0 relative">
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
                      <Truck className="h-8 w-8 text-muted-foreground/60 absolute" />
                    </div>

                    {/* Description Details */}
                    <div className="flex-1 space-y-2 min-w-0">
                      <div>
                        <span className="text-[10px] font-bold text-primary uppercase tracking-wider block">
                          {item.categoryName}
                        </span>
                        <h3 className="font-bold text-sm text-foreground truncate mt-0.5">
                          {item.name}
                        </h3>
                        <p className="text-[10px] text-muted-foreground flex items-center mt-0.5">
                          <MapPin className="h-3 w-3 mr-1 shrink-0 text-primary/60" /> {item.location}
                        </p>
                      </div>

                      <div className="flex items-baseline space-x-0.5">
                        <span className="text-sm font-extrabold text-foreground">
                          ₹{item.dailyRentalPrice.toLocaleString("en-IN")}
                        </span>
                        <span className="text-[10px] text-muted-foreground font-medium">/ day</span>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center space-x-2 pt-2 border-t">
                        <Button size="xs" asChild className="flex-1 text-[10px]">
                          <Link href={`/equipment/${item.equipmentId}`}>View Details</Link>
                        </Button>
                        <Button
                          size="xs"
                          variant="outline"
                          className="text-rose-600 hover:bg-rose-50 border-rose-100 hover:text-rose-700"
                          onClick={() => handleRemove(item.equipmentId)}
                          disabled={removeMutation.isPending}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </main>
      <Footer />
    </div>
      )}
    </ProtectedRoute>
  );
}
