import Link from "next/link";
import { Truck, Mail, Phone, ShieldCheck, MapPin, Lock, FileCheck } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

export function Footer() {
  return (
    <footer className="border-t bg-slate-950 text-slate-200">
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand & Corporate Credibility */}
          <div className="space-y-4 md:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 font-bold text-xl text-white">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-amber-500 text-slate-950 font-black">
                <Truck className="w-5 h-5" />
              </div>
              <span>Equip<span className="text-amber-500">Link</span></span>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed">
              India&apos;s premier digitized heavy machinery marketplace and fleet telematics ecosystem. Connecting highway developers, mining operators, and verified machinery owners.
            </p>
            <div className="flex items-center space-x-2 pt-1">
              <Badge variant="outline" className="text-[10px] border-emerald-500/40 text-emerald-400 font-bold bg-emerald-950/40">
                <ShieldCheck className="w-3 h-3 mr-1 inline" /> ISO 27001 Certified
              </Badge>
              <Badge variant="outline" className="text-[10px] border-amber-500/40 text-amber-400 font-bold bg-amber-950/40">
                GST Compliant
              </Badge>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h3 className="font-bold text-xs uppercase tracking-wider text-white">Fleet Directory</h3>
            <nav className="flex flex-col gap-2.5 text-xs text-slate-400">
              <Link href="/marketplace" className="hover:text-amber-400 transition-colors">
                Browse Marketplace Catalog
              </Link>
              <Link href="/equipment" className="hover:text-amber-400 transition-colors">
                Machinery Fleet Directory
              </Link>
              <Link href="/company#dispatch-hubs" className="hover:text-amber-400 transition-colors">
                Regional Dispatch Hubs
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
            <h3 className="font-bold text-xs uppercase tracking-wider text-white">Enterprise & Policy</h3>
            <nav className="flex flex-col gap-2.5 text-xs text-slate-400">
              <Link href="/company" className="hover:text-amber-400 transition-colors">
                Company Overview
              </Link>
              <Link href="/about" className="hover:text-amber-400 transition-colors">
                About Enterprise Network
              </Link>
              <Link href="/contact" className="hover:text-amber-400 transition-colors">
                Contact Corporate Desk
              </Link>
              <Link href="/company#enterprise-quote" className="hover:text-amber-400 transition-colors">
                Bulk Fleet Quote Request
              </Link>
            </nav>
          </div>

          {/* Direct Support Desk */}
          <div className="space-y-3">
            <h3 className="font-bold text-xs uppercase tracking-wider text-white">24/7 Corporate Dispatch Desk</h3>
            <div className="space-y-2 text-xs text-slate-400">
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-amber-500 shrink-0" />
                <span className="font-semibold text-slate-200">+91 1800-345-8899 (Toll Free)</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-amber-500 shrink-0" />
                <span className="text-slate-300">corporate@equiplink.com</span>
              </div>
              <div className="flex items-start space-x-2 pt-1">
                <MapPin className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <span className="text-[11px] text-slate-400">
                  EquipLink Towers, Sector 4, Peenya Industrial Complex, Bangalore, KA
                </span>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-8 bg-slate-800" />

        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} EquipLink Technologies Pvt. Ltd. All rights reserved.</p>
          <div className="flex items-center space-x-4 text-[11px] text-slate-400">
            <span className="flex items-center text-emerald-400"><Lock className="w-3 h-3 mr-1" /> 256-Bit SSL Encrypted</span>
            <span>•</span>
            <span className="flex items-center text-slate-300"><FileCheck className="w-3 h-3 mr-1" /> ITC Invoicing Ready</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
