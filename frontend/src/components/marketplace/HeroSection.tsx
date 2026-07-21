import Link from "next/link";
import { Search, Compass, Hammer } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-background py-20 border-b">
      {/* Background Subtle Gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,var(--tw-gradient-stops))] from-primary/10 via-background to-background -z-10" />
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary/5 rounded-full blur-3xl -z-10" />

      <div className="container mx-auto px-4 text-center max-w-4xl space-y-6">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
          <Hammer className="h-3 w-3 mr-1.5" /> Direct Heavy Machinery Rental
        </span>
        
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-tight">
          Reliable Heavy Equipment, <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-500">
            Rentals Simplified.
          </span>
        </h1>

        <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Connect directly with fleet owners. Discover, search, and reserve heavy machinery — from excavators and cranes to forklifts and dump trucks — with no hidden middlemen.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Button size="lg" className="font-bold text-sm w-full sm:w-auto shadow-md" asChild>
            <Link href="/marketplace">
              <Search className="mr-2 h-4 w-4" /> Search Equipment
            </Link>
          </Button>
          <Button size="lg" variant="outline" className="font-semibold text-sm w-full sm:w-auto" asChild>
            <Link href="/marketplace?focus=categories">
              <Compass className="mr-2 h-4 w-4" /> Browse Categories
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
