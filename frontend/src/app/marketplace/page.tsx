"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, ArrowRight, SlidersHorizontal, Grid } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import FilterSidebar from "@/components/marketplace/FilterSidebar";
import EquipmentCard from "@/components/common/EquipmentCard";
import { useMarketplace } from "@/lib/api/marketplaceService";
import { Button } from "@/components/ui/button";
import { EquipmentStatus } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";

export default function PublicMarketplacePage() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [category, setCategory] = useState<number | string>("");
  const [status, setStatus] = useState<EquipmentStatus | "">("");
  const [location, setLocation] = useState("");
  const [debouncedLocation, setDebouncedLocation] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(0);

  // Debouncing for search and location queries
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(0);
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedLocation(location);
      setPage(0);
    }, 500);
    return () => clearTimeout(handler);
  }, [location]);

  const { data: pageData, isLoading, error } = useMarketplace({
    search: debouncedSearch || undefined,
    category: category || undefined,
    status: status || undefined,
    location: debouncedLocation || undefined,
    minPrice: minPrice ? Number(minPrice) : undefined,
    maxPrice: maxPrice ? Number(maxPrice) : undefined,
    sort,
    page,
    size: 9,
  });

  const handleClearFilters = () => {
    setSearch("");
    setCategory("");
    setStatus("");
    setLocation("");
    setMinPrice("");
    setMaxPrice("");
    setSort("newest");
    setPage(0);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8 space-y-2">
          <h1 className="text-3xl font-extrabold tracking-tight">Marketplace Catalog</h1>
          <p className="text-sm text-muted-foreground">
            Browse and compare heavy machinery listed by verified owners across India.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters Sidebar */}
          <FilterSidebar
            search={search}
            setSearch={setSearch}
            category={category}
            setCategory={setCategory}
            status={status}
            setStatus={setStatus}
            location={location}
            setLocation={setLocation}
            minPrice={minPrice}
            setMinPrice={setMinPrice}
            maxPrice={maxPrice}
            setMaxPrice={setMaxPrice}
            onClear={handleClearFilters}
          />

          {/* Catalog Listings Content */}
          <div className="flex-1 space-y-6">
            {/* Sorting controls */}
            <div className="flex items-center justify-between bg-card p-4 rounded-xl border">
              <div className="text-xs font-semibold text-muted-foreground flex items-center">
                <Grid className="mr-1.5 h-4 w-4" />
                {pageData ? `${pageData.totalElements} machinery items listed` : "Checking fleet…"}
              </div>

              <div className="flex items-center space-x-2">
                <label htmlFor="sort" className="text-xs text-muted-foreground font-semibold">
                  Sort By:
                </label>
                <select
                  id="sort"
                  value={sort}
                  onChange={(e) => {
                    setSort(e.target.value);
                    setPage(0);
                  }}
                  className="flex h-8 rounded-md border border-input bg-background px-2.5 py-1 text-xs ring-offset-background"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="priceAsc">Price: Low to High</option>
                  <option value="priceDesc">Price: High to Low</option>
                  <option value="nameAsc">Machinery Name: A-Z</option>
                </select>
              </div>
            </div>

            {/* Grid List */}
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className="border rounded-xl p-4 space-y-4 animate-pulse">
                    <Skeleton className="aspect-video w-full rounded-lg" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-2/3" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                    <div className="pt-4 flex justify-between border-t">
                      <Skeleton className="h-6 w-1/3" />
                      <Skeleton className="h-8 w-1/4" />
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="text-center p-12 bg-card rounded-xl border border-dashed">
                <h3 className="text-lg font-bold text-destructive mb-2">Error loading catalog</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  We encountered an issue retrieving marketplace listings. Please try again.
                </p>
                <Button onClick={handleClearFilters} size="sm">
                  Reset Catalog
                </Button>
              </div>
            ) : pageData?.content.length === 0 ? (
              <div className="text-center p-12 bg-card rounded-xl border border-dashed flex flex-col items-center justify-center">
                <SlidersHorizontal className="h-10 w-10 text-muted-foreground/60 mb-2.5" />
                <h3 className="text-lg font-bold tracking-tight mb-1">No machinery matches</h3>
                <p className="text-sm text-muted-foreground max-w-sm mb-4">
                  Adjust your price ranges, status filters, or clear keywords to broaden your search.
                </p>
                <Button onClick={handleClearFilters} size="sm">
                  Clear Filters
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {pageData?.content.map((item) => (
                  <EquipmentCard key={item.id} equipment={item} />
                ))}
              </div>
            )}

            {/* Pagination Panel */}
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
                    <ArrowLeft className="mr-1.5 h-3.5 w-3.5" /> Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(page + 1)}
                    disabled={pageData.last}
                    className="text-xs"
                  >
                    Next <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
