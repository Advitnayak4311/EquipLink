import Link from "next/link";
import { Search, Compass, Hammer, ShieldCheck, Zap, Building2, ChevronRight, CheckCircle2, Lock, Radio } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HeroSection() {
  const categories = [
    { label: "Excavators", href: "/marketplace?category=Excavators" },
    { label: "Tower & Mobile Cranes", href: "/marketplace?category=Cranes" },
    { label: "Wheel Loaders", href: "/marketplace?category=Loaders" },
    { label: "Concrete Pavers & Pumps", href: "/marketplace?category=Paving" },
    { label: "Mining Dump Trucks", href: "/marketplace?category=Trucks" },
  ];

  return (
    <section className="relative overflow-hidden bg-slate-950 text-white py-20 lg:py-28 border-b border-amber-500/20 tech-grid-pattern">
      {/* Background Subtle Ambient Glowing Lighting */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-950/90 to-slate-950 -z-10" />
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-amber-500/10 rounded-full blur-[120px] -z-10" />
      <div className="absolute top-1/3 right-10 w-96 h-96 bg-emerald-500/5 rounded-full blur-[100px] -z-10" />

      <div className="container mx-auto px-4 max-w-5xl text-center space-y-8 relative">
        {/* Top Enterprise Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30 shadow-lg shadow-amber-500/10">
          <ShieldCheck className="h-4 w-4 text-amber-400" />
          <span>Digitized Heavy Machinery Marketplace & Telematics</span>
        </div>
        
        {/* Main Heading */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.1] font-heading">
          Empowering Heavy Infrastructure with <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-300">
            Verified Machinery & Telematics.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed font-sans font-normal">
          Connect directly with fleet owners across India. Discover, inspect, and deploy excavators, cranes, loaders, and pavers with transparent SLAs, live T3 GPS tracking, and instant GST invoicing.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <Button size="lg" className="font-extrabold text-sm w-full sm:w-auto px-8 bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-xl shadow-amber-500/25 transition-all hover:scale-[1.02]" asChild>
            <Link href="/marketplace">
              <Search className="mr-2 h-4 w-4" /> Browse Marketplace
            </Link>
          </Button>
          <Button size="lg" variant="outline" className="font-bold text-sm w-full sm:w-auto px-8 border-slate-700 bg-slate-900/60 hover:bg-slate-800 text-slate-200 hover:border-amber-500/40" asChild>
            <Link href="/register?role=OWNER">
              <Building2 className="mr-2 h-4 w-4 text-amber-400" /> List Your Equipment
            </Link>
          </Button>
        </div>

        {/* Category Pills */}
        <div className="pt-6">
          <p className="text-xs uppercase font-bold text-slate-400 tracking-wider mb-3">Popular Fleet Categories</p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {categories.map((cat, idx) => (
              <Link
                key={idx}
                href={cat.href}
                className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-900/80 border border-slate-800 text-slate-300 hover:border-amber-500/40 hover:text-amber-400 transition-all"
              >
                <span>{cat.label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Value Proposition Feature Grid (No Dummy Stats) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-10 border-t border-slate-800/80">
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-center space-y-1.5">
            <CheckCircle2 className="w-6 h-6 text-amber-400 mx-auto" />
            <h4 className="text-sm font-extrabold text-slate-100 font-heading">Direct Fleet Booking</h4>
            <p className="text-xs text-slate-400">Connect directly with verified machinery owners</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-center space-y-1.5">
            <Radio className="w-6 h-6 text-emerald-400 mx-auto" />
            <h4 className="text-sm font-extrabold text-slate-100 font-heading">T3 Telematics</h4>
            <p className="text-xs text-slate-400">Satellite GPS & hour meter monitoring</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-center space-y-1.5">
            <ShieldCheck className="w-6 h-6 text-amber-400 mx-auto" />
            <h4 className="text-sm font-extrabold text-slate-100 font-heading">Verified Listings</h4>
            <p className="text-xs text-slate-400">Inspected equipment & documented records</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-center space-y-1.5">
            <Lock className="w-6 h-6 text-blue-400 mx-auto" />
            <h4 className="text-sm font-extrabold text-slate-100 font-heading">GST Compliant</h4>
            <p className="text-xs text-slate-400">Instant invoicing & ITC tax readiness</p>
          </div>
        </div>
      </div>
    </section>
  );
}
