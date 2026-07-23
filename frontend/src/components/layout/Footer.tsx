import Link from "next/link";
import { Truck, Mail, Phone, ShieldCheck, MapPin, Lock, FileCheck, ArrowRight, Activity } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

export function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-[#090d16] text-slate-300 font-sans">
      {/* Live System Status Header Bar */}
      <div className="border-b border-slate-800/80 bg-slate-950/60 py-3">
        <div className="container mx-auto px-4 max-w-7xl flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center space-x-2 text-slate-300">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="font-medium text-slate-200 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-amber-500" />
              EquipLink Platform & T3 Telematics Network Operational
            </span>
          </div>
          <div className="flex items-center space-x-4 text-slate-400 font-medium">
            <span>Direct Marketplace</span>
            <span>•</span>
            <span className="text-emerald-400 font-semibold">Live System Online</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-7xl space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand & Corporate Credibility */}
          <div className="space-y-4 md:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 font-extrabold text-xl text-white tracking-tight">
              <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-amber-500 text-slate-950 font-black shadow-lg shadow-amber-500/20">
                <Truck className="w-5 h-5" />
              </div>
              <span className="font-heading">Equip<span className="text-amber-500">Link</span></span>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed">
              India&apos;s premier digitized heavy machinery marketplace and fleet telematics ecosystem. Connecting highway developers, mining operators, and verified machinery owners.
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <Badge variant="outline" className="text-[10px] border-amber-500/40 text-amber-400 font-bold bg-amber-950/40 px-2 py-0.5">
                GST Compliant
              </Badge>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h3 className="font-bold text-xs uppercase tracking-wider text-white font-heading">Fleet Directory</h3>
            <nav className="flex flex-col gap-2.5 text-xs text-slate-400">
              <Link href="/marketplace" className="hover:text-amber-400 transition-colors flex items-center group">
                Browse Marketplace Catalog <ArrowRight className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
              <Link href="/equipment" className="hover:text-amber-400 transition-colors flex items-center group">
                Machinery Fleet Directory <ArrowRight className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
              <Link href="/register?role=OWNER" className="hover:text-amber-400 transition-colors">
                List Equipment & Earn
              </Link>
              <Link href="/register?role=CUSTOMER" className="hover:text-amber-400 transition-colors">
                Corporate Customer Sign-Up
              </Link>
            </nav>
          </div>

          {/* Corporate & Legal */}
          <div className="space-y-3">
            <h3 className="font-bold text-xs uppercase tracking-wider text-white font-heading">Enterprise & Policy</h3>
            <nav className="flex flex-col gap-2.5 text-xs text-slate-400">
              <Link href="/company" className="hover:text-amber-400 transition-colors">
                Company Overview
              </Link>
              <Link href="/about" className="hover:text-amber-400 transition-colors">
                About Enterprise Network
              </Link>
              <Link href="/telematics" className="hover:text-amber-400 transition-colors">
                T3 Telematics System
              </Link>
              <Link href="/esg" className="hover:text-amber-400 transition-colors">
                ESG Carbon Reporting
              </Link>
              <Link href="/contact" className="hover:text-amber-400 transition-colors">
                Contact Corporate Desk
              </Link>
            </nav>
          </div>

          {/* Direct Support Desk */}
          <div className="space-y-3">
            <h3 className="font-bold text-xs uppercase tracking-wider text-white font-heading">Corporate Support Desk</h3>
            <div className="space-y-2.5 text-xs text-slate-400">
              <div className="flex items-center space-x-2 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                <Phone className="w-4 h-4 text-amber-500 shrink-0" />
                <span className="font-bold text-slate-100">+91 1800-345-8899 <span className="text-[10px] text-slate-400 font-normal">(Toll Free)</span></span>
              </div>
              <div className="flex items-center space-x-2 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                <Mail className="w-4 h-4 text-amber-500 shrink-0" />
                <span className="text-slate-200 font-medium">corporate@equiplink.com</span>
              </div>
              <div className="flex items-start space-x-2 pt-1">
                <MapPin className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <span className="text-[11px] text-slate-400 leading-relaxed">
                  EquipLink Towers, Sector 4, Peenya Industrial Complex, Bangalore, KA - 560058
                </span>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-6 bg-slate-800/80" />

        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} EquipLink Technologies Pvt. Ltd. All rights reserved.</p>
          <div className="flex items-center space-x-4 text-[11px] text-slate-400 font-medium">
            <span className="flex items-center text-emerald-400"><Lock className="w-3.5 h-3.5 mr-1" /> 256-Bit SSL Encrypted</span>
            <span>•</span>
            <span className="flex items-center text-slate-300"><FileCheck className="w-3.5 h-3.5 mr-1 text-amber-400" /> ITC Invoicing Ready</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
