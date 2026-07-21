import { useState } from "react";
import { ChevronLeft, ChevronRight, Truck } from "lucide-react";
import { resolveImageUrl } from "@/lib/utils";

interface ImageCarouselProps {
  images?: { id: number; imageUrl: string; displayOrder: number }[];
  altText?: string;
}

export default function ImageCarousel({ images = [], altText = "Machinery image" }: ImageCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [hasError, setHasError] = useState(false);

  if (images.length === 0) {
    return (
      <div className="relative aspect-video w-full rounded-xl bg-muted border flex flex-col items-center justify-center space-y-2 p-6">
        <Truck className="h-16 w-16 text-muted-foreground/60" />
        <span className="text-xs text-muted-foreground font-semibold">No Preview Images Available</span>
      </div>
    );
  }

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % images.length);
    setHasError(false);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + images.length) % images.length);
    setHasError(false);
  };

  const activeImage = resolveImageUrl(images[activeIndex]?.imageUrl) || "";

  return (
    <div className="space-y-4">
      {/* Large Display Panel */}
      <div className="relative aspect-video w-full rounded-xl overflow-hidden border bg-black flex items-center justify-center group shadow-sm">
        {activeImage && !hasError ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={activeImage}
            alt={`${altText} - preview ${activeIndex + 1}`}
            referrerPolicy="no-referrer"
            onError={() => setHasError(true)}
            className="object-contain w-full h-full max-h-[480px]"
          />
        ) : (
          <div className="flex flex-col items-center justify-center space-y-2 text-white">
            <Truck className="h-16 w-16 text-primary animate-pulse" />
            <span className="text-sm font-bold">{altText}</span>
          </div>
        )}

        {/* Carousel Left / Right Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 hover:bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity border border-white/10"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 hover:bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity border border-white/10"
              aria-label="Next image"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails list */}
      {images.length > 1 && (
        <div className="flex flex-wrap gap-2.5">
          {images.map((img, index) => {
            const thumbUrl = resolveImageUrl(img.imageUrl) || "";
            return (
              <button
                key={img.id}
                onClick={() => {
                  setActiveIndex(index);
                  setHasError(false);
                }}
                className={`relative w-20 aspect-video rounded-lg overflow-hidden border-2 transition-all bg-muted ${
                  activeIndex === index
                    ? "border-primary scale-105"
                    : "border-transparent opacity-60 hover:opacity-100"
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={thumbUrl}
                  alt={`Thumbnail view ${index + 1}`}
                  referrerPolicy="no-referrer"
                  className="object-cover w-full h-full"
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
