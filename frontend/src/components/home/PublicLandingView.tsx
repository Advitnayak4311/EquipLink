"use client";

import Link from "next/link";
import {
  ArrowRight,
  ShieldCheck,
  Truck,
  Calculator,
  Radio,
  Leaf,
  Cpu,
  Award,
} from "lucide-react";
import HeroSection from "@/components/marketplace/HeroSection";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useMarketplace } from "@/lib/api/marketplaceService";
import EquipmentCard from "@/components/common/EquipmentCard";
import { Skeleton } from "@/components/ui/skeleton";

export default function PublicLandingView() {
  const { data: pageData, isLoading } = useMarketplace({
    size: 3,
    sort: "newest",
  });

  return (
    <div className="space-y-0">
      {/* Hero Section */}
      <HeroSection />

      {/* Feature Bar */}
      <section className="py-8 bg-slate-950 text-white border-y border-amber-500/20 shadow-xl">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link
              href="/calculator"
              className="p-5 rounded-2xl bg-slate-900/80 border border-amber-500/30 hover:border-amber-400 transition-all group flex items-start space-x-4 glow-amber"
            >
              <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400 group-hover:scale-110 transition-transform">
                <Calculator className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-white group-hover:text-amber-400 transition-colors flex items-center">
                  AI Fleet Cost Estimator <ArrowRight className="w-4 h-4 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                </h3>
                <p className="text-xs text-slate-300 mt-1">
                  Calculate rental budgets, diesel fuel burn, and operator crew size instantly.
                </p>
              </div>
            </Link>

            <Link
              href="/telematics"
              className="p-5 rounded-2xl bg-slate-900/80 border border-emerald-500/30 hover:border-emerald-400 transition-all group flex items-start space-x-4 glow-emerald"
            >
              <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 group-hover:scale-110 transition-transform">
                <Radio className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-white group-hover:text-emerald-400 transition-colors flex items-center">
                  T3 Telematics Command Center <ArrowRight className="w-4 h-4 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                </h3>
                <p className="text-xs text-slate-300 mt-1">
                  Satellite GPS fencing, engine RPM telemetry, and hour meter tracking.
                </p>
              </div>
            </Link>

            <Link
              href="/esg"
              className="p-5 rounded-2xl bg-slate-900/80 border border-blue-500/30 hover:border-blue-400 transition-all group flex items-start space-x-4"
            >
              <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400 group-hover:scale-110 transition-transform">
                <Leaf className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-white group-hover:text-blue-400 transition-colors flex items-center">
                  ESG Green Fleet & Carbon Hub <ArrowRight className="w-4 h-4 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                </h3>
                <p className="text-xs text-slate-300 mt-1">
                  Electric heavy machinery and certified corporate carbon offset audit reports.
                </p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Machinery Showcase */}
      <section className="py-16 bg-muted/10 border-b">
        <div className="container mx-auto px-4 max-w-7xl space-y-12">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-2">
              <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-300 text-xs uppercase font-extrabold">
                Live Heavy Fleet Catalog
              </Badge>
              <h2 className="text-3xl font-black tracking-tight font-heading">Verified Heavy Machinery Showcase</h2>
              <p className="text-sm text-muted-foreground">
                High-performance excavators, cranes, loaders, and pavers ready for jobsite deployment.
              </p>
            </div>
            <Button asChild variant="outline" className="font-bold border-primary text-primary hover:bg-primary/10">
              <Link href="/marketplace" className="inline-flex items-center">
                Browse Full Live Catalog <ArrowRight className="ml-1.5 h-4 w-4" />
              </Link>
            </Button>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="border rounded-xl p-4 space-y-4 animate-pulse bg-card">
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
          ) : pageData?.content && pageData.content.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {pageData.content.slice(0, 3).map((item) => (
                <EquipmentCard key={item.id} equipment={item} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-card rounded-2xl border border-dashed space-y-3">
              <Truck className="mx-auto h-10 w-10 text-amber-500 mb-1" />
              <h3 className="font-bold text-base">Active Machinery Inventory Ready</h3>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                Explore our full equipment catalog or list your heavy machinery to earn rental revenue.
              </p>
              <Button asChild size="sm" className="font-bold bg-amber-500 hover:bg-amber-400 text-slate-950">
                <Link href="/register?role=OWNER">List Equipment & Earn</Link>
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Infrastructure & Telematics Pillars */}
      <section className="py-16 container mx-auto px-4 max-w-7xl space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <Badge variant="secondary" className="px-3 py-1 font-extrabold text-xs uppercase">
            The EquipLink Benchmark
          </Badge>
          <h2 className="text-3xl md:text-4xl font-black tracking-tight font-heading">Enterprise Infrastructure & Telematics</h2>
          <p className="text-sm text-muted-foreground">
            Why leading highway developers, mining firms, and construction conglomerates choose EquipLink.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border shadow-sm hover:shadow-md transition-all">
            <CardContent className="pt-6 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center border border-amber-500/20">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="font-extrabold text-lg">Verified Machine Fitness</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                RTO fitness certificates, machinery health logs, and owner identity pre-screened prior to listing.
              </p>
            </CardContent>
          </Card>

          <Card className="border shadow-sm hover:shadow-md transition-all">
            <CardContent className="pt-6 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center border border-emerald-500/20">
                <Cpu className="h-6 w-6" />
              </div>
              <h3 className="font-extrabold text-lg">T3 Live Telematics</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Satellite GPS geofencing, engine RPM telemetry, and automated hour log generation.
              </p>
            </CardContent>
          </Card>

          <Card className="border shadow-sm hover:shadow-md transition-all">
            <CardContent className="pt-6 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center border border-blue-500/20">
                <Calculator className="h-6 w-6" />
              </div>
              <h3 className="font-extrabold text-lg">AI Project Cost Estimator</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Predict exact lease budgets, diesel fuel consumption, and operator crew size before booking.
              </p>
            </CardContent>
          </Card>

          <Card className="border shadow-sm hover:shadow-md transition-all">
            <CardContent className="pt-6 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center border border-purple-500/20">
                <Award className="h-6 w-6" />
              </div>
              <h3 className="font-extrabold text-lg">B2B GST Compliance</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Automated e-invoicing with input tax credit (ITC) readiness and zero hidden broker commissions.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-slate-950 text-white border-t border-amber-500/20">
        <div className="container mx-auto px-4 max-w-4xl text-center space-y-6">
          <Badge className="bg-amber-500 text-slate-950 font-black px-3 py-1 text-xs uppercase">
            Deploy Heavy Machinery Now
          </Badge>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight font-heading">
            Elevate Your Construction & Mining Logistics
          </h2>
          <p className="text-slate-300 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
            Join thousands of verified machinery owners and corporate hirers across India on EquipLink.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Button asChild size="lg" className="w-full sm:w-auto font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md">
              <Link href="/marketplace">
                Browse Live Marketplace <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" className="w-full sm:w-auto font-bold bg-slate-800 hover:bg-slate-700 text-white border border-slate-600 shadow-md">
              <Link href="/register?role=OWNER">
                List Equipment & Earn
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
