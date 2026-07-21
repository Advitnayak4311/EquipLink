"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import Breadcrumb from "@/components/common/Breadcrumb";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Truck,
  ShieldCheck,
  Award,
  Users,
  CheckCircle2,
  MapPin,
  Cpu,
  Zap,
  Globe,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8 max-w-7xl space-y-12">
        <Breadcrumb />

        {/* Hero Section */}
        <div className="relative rounded-3xl bg-slate-950 text-white p-8 md:p-14 overflow-hidden shadow-xl border border-amber-500/20">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-3xl space-y-4">
            <Badge className="bg-amber-500 text-slate-950 font-black px-3 py-1 text-xs tracking-wider uppercase">
              About EquipLink Technologies
            </Badge>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
              Digitizing Heavy Equipment Logistics & Infrastructure Rental Ecosystems
            </h1>
            <p className="text-slate-300 text-base md:text-lg leading-relaxed">
              EquipLink is India&apos;s leading heavy machinery marketplace connecting construction developers, mining operators, and verified equipment owners. We eliminate unverified middleman broker commissions through direct digital contracts, GPS telematics, and transparent GST invoicing.
            </p>

            <div className="pt-4 flex flex-wrap gap-4 items-center">
              <Button asChild size="lg" className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold shadow-md">
                <Link href="/marketplace">
                  <Truck className="mr-2 h-5 w-5" /> Explore Marketplace Catalog
                </Link>
              </Button>
              <Button asChild size="lg" className="bg-slate-800 hover:bg-slate-700 text-white font-bold border border-slate-600 shadow-md">
                <Link href="/company">
                  <Globe className="mr-2 h-5 w-5 text-amber-400" /> Corporate Network
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Core Strategic Pillars */}
        <div>
          <div className="text-center max-w-3xl mx-auto mb-10">
            <Badge variant="secondary" className="px-3 py-1 font-semibold text-xs mb-2">
              Our Core Platform Pillars
            </Badge>
            <h2 className="text-3xl font-extrabold tracking-tight">Engineered for Reliability & Scale</h2>
            <p className="text-sm text-muted-foreground mt-2">
              How EquipLink delivers maximum jobsite efficiency for highway, mining, and commercial construction projects.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border shadow-sm hover:shadow-md transition-all">
              <CardHeader>
                <ShieldCheck className="h-8 w-8 text-emerald-600 mb-2" />
                <CardTitle className="text-xl">100% Fitness Verification</CardTitle>
                <CardDescription>
                  Every excavator, crane, or loader listed undergoes fitness certificate verification, RTO roadworthiness inspection, and maintenance log review.
                </CardDescription>
              </CardHeader>
              <CardContent className="text-xs space-y-2 text-muted-foreground">
                <div className="flex items-center"><CheckCircle2 className="h-4 w-4 text-emerald-600 mr-2 shrink-0" /> Verified vehicle fitness certificate</div>
                <div className="flex items-center"><CheckCircle2 className="h-4 w-4 text-emerald-600 mr-2 shrink-0" /> Owner GSTIN identity verification</div>
              </CardContent>
            </Card>

            <Card className="border shadow-sm hover:shadow-md transition-all">
              <CardHeader>
                <Cpu className="h-8 w-8 text-amber-500 mb-2" />
                <CardTitle className="text-xl">T3 Live Telematics</CardTitle>
                <CardDescription>
                  Real-time engine hour meter tracking ensures transparent daily/hourly billing with zero disputes over machinery runtime.
                </CardDescription>
              </CardHeader>
              <CardContent className="text-xs space-y-2 text-muted-foreground">
                <div className="flex items-center"><CheckCircle2 className="h-4 w-4 text-emerald-600 mr-2 shrink-0" /> GPS geofencing & hour meter track</div>
                <div className="flex items-center"><CheckCircle2 className="h-4 w-4 text-emerald-600 mr-2 shrink-0" /> Automated daily runtime reports</div>
              </CardContent>
            </Card>

            <Card className="border shadow-sm hover:shadow-md transition-all">
              <CardHeader>
                <Users className="h-8 w-8 text-blue-600 mb-2" />
                <CardTitle className="text-xl">Certified Operator Dispatch</CardTitle>
                <CardDescription>
                  Optionally dispatch certified, safety-trained machine drivers with valid heavy motor driving licenses & PF compliance.
                </CardDescription>
              </CardHeader>
              <CardContent className="text-xs space-y-2 text-muted-foreground">
                <div className="flex items-center"><CheckCircle2 className="h-4 w-4 text-emerald-600 mr-2 shrink-0" /> Pre-screened machine drivers</div>
                <div className="flex items-center"><CheckCircle2 className="h-4 w-4 text-emerald-600 mr-2 shrink-0" /> On-site safety compliance</div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Corporate Trust Banner */}
        <div className="bg-muted/40 rounded-3xl p-8 border space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <Badge variant="secondary" className="px-3 py-1 font-semibold text-xs">
              <Award className="mr-1.5 h-3.5 w-3.5 text-amber-500" /> Enterprise Guarantee
            </Badge>
            <h3 className="text-2xl font-extrabold tracking-tight">Zero-Downtime Machinery Replacement Policy</h3>
            <p className="text-sm text-muted-foreground">
              In the rare event of a site breakdown, EquipLink dispatches a certified replacement machine within 24 hours to keep your construction timeline on track.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
