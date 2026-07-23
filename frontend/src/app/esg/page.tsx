"use client";

import { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import Breadcrumb from "@/components/common/Breadcrumb";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Leaf,
  Zap,
  ShieldCheck,
  Award,
  CheckCircle2,
  FileCheck,
  TrendingDown,
  Sparkles,
  ArrowRight,
  Globe,
  Sun,
} from "lucide-react";
import { toast } from "sonner";
import { downloadEsgCertificatePDF } from "@/lib/pdfGenerator";

export default function ESGPage() {
  const [downloading, setDownloading] = useState(false);

  const ecoMachinery = [
    {
      name: "Caterpillar 320 Zeller Electric Excavator",
      type: "Zero-Emission Electric Excavator",
      battery: "300 kWh Lithium-Ion Pack",
      runtime: "8 Operating Hours / Charge",
      co2Saved: "45 Tons CO2 / Month",
    },
    {
      name: "Volvo L25 Electric Wheel Loader",
      type: "Compact Electric Loader",
      battery: "40 kWh Battery Pack",
      runtime: "6 Operating Hours / Charge",
      co2Saved: "18 Tons CO2 / Month",
    },
    {
      name: "JCB 19E-1 Electric Mini Excavator",
      type: "Urban Zero-Noise Excavator",
      battery: "20 kWh Lithium Battery",
      runtime: "5 Operating Hours / Charge",
      co2Saved: "12 Tons CO2 / Month",
    },
  ];

  const handleDownloadCert = () => {
    setDownloading(true);
    downloadEsgCertificatePDF({
      carbonOffsetTons: 340.5,
      electricFleetHours: 1280,
      sustainabilityRating: "A+ Platinum Zero Carbon",
    });
    setDownloading(false);
    toast.success("Enterprise ESG Carbon Compliance Certificate generated & opened for print/download!");
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8 max-w-7xl space-y-10">
        <Breadcrumb />

        {/* Hero Header */}
        <div className="relative rounded-3xl bg-slate-950 text-white p-8 md:p-12 overflow-hidden shadow-xl border border-emerald-500/20 glow-emerald">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-3xl space-y-4">
            <Badge className="bg-emerald-500 text-slate-950 font-extrabold px-3 py-1 text-xs tracking-wider uppercase">
              <Leaf className="w-3.5 h-3.5 mr-1 inline" /> ESG Green Fleet & Net-Zero Sustainability Portal
            </Badge>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
              Sustainable Infrastructure & Electric Heavy Machinery
            </h1>
            <p className="text-slate-300 text-base md:text-lg leading-relaxed">
              Accelerate your corporation&apos;s ESG sustainability targets. EquipLink offers India&apos;s premier fleet of electric heavy machinery, low-emission hybrid loaders, and automated carbon offset reporting.
            </p>
          </div>
        </div>

        {/* ESG Impact Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <Card className="border shadow-sm text-center">
            <CardContent className="pt-6">
              <div className="text-3xl md:text-4xl font-black text-emerald-600 dark:text-emerald-400">
                1,250+
              </div>
              <p className="text-xs text-muted-foreground font-bold mt-2 uppercase tracking-wider">
                Tons CO2 Offset Saved
              </p>
            </CardContent>
          </Card>

          <Card className="border shadow-sm text-center">
            <CardContent className="pt-6">
              <div className="text-3xl md:text-4xl font-black text-blue-600 dark:text-blue-400">
                420+
              </div>
              <p className="text-xs text-muted-foreground font-bold mt-2 uppercase tracking-wider">
                Electric & Hybrid Units
              </p>
            </CardContent>
          </Card>

          <Card className="border shadow-sm text-center">
            <CardContent className="pt-6">
              <div className="text-3xl md:text-4xl font-black text-purple-600 dark:text-purple-400">
                100%
              </div>
              <p className="text-xs text-muted-foreground font-bold mt-2 uppercase tracking-wider">
                Audited Carbon Invoices
              </p>
            </CardContent>
          </Card>

          <Card className="border shadow-sm text-center">
            <CardContent className="pt-6">
              <div className="text-3xl md:text-4xl font-black text-amber-600 dark:text-amber-400">
                ISO 14001
              </div>
              <p className="text-xs text-muted-foreground font-bold mt-2 uppercase tracking-wider">
                Environmental Standard
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Electric Machinery Showcase */}
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight flex items-center">
              <Zap className="w-6 h-6 mr-2 text-emerald-500" /> Featured Electric Heavy Machinery Fleet
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Zero-noise, zero-tailpipe-emission heavy equipment available for urban infrastructure projects.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {ecoMachinery.map((item, idx) => (
              <Card key={idx} className="border shadow-sm hover:border-emerald-500 transition-all">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Badge className="bg-emerald-600 text-white text-[10px] font-bold">Electric Fleet</Badge>
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center">
                      <TrendingDown className="w-3.5 h-3.5 mr-1" /> {item.co2Saved}
                    </span>
                  </div>
                  <CardTitle className="text-lg mt-2">{item.name}</CardTitle>
                  <CardDescription className="text-xs">{item.type}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2 text-xs pt-0">
                  <div className="flex justify-between border-t pt-2 text-muted-foreground">
                    <span>Battery Capacity:</span>
                    <span className="font-bold text-foreground">{item.battery}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Shift Runtime:</span>
                    <span className="font-bold text-foreground">{item.runtime}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Certificate Download Box */}
        <div className="bg-card border rounded-3xl p-8 md:p-12 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <Badge className="bg-emerald-600 text-white font-bold text-xs uppercase">
              Corporate Reporting
            </Badge>
            <h3 className="text-2xl font-extrabold tracking-tight">Need ESG Carbon Compliance Audit Reports?</h3>
            <p className="text-xs text-muted-foreground">
              EquipLink generates verified CO2 reduction certificates for your corporate annual sustainability filings and tender applications.
            </p>
          </div>
          <Button
            onClick={handleDownloadCert}
            disabled={downloading}
            size="lg"
            className="font-bold shadow-md bg-emerald-600 hover:bg-emerald-500 text-white shrink-0"
          >
            <FileCheck className="w-4 h-4 mr-2" />
            {downloading ? "Generating Certificate..." : "Download ESG Compliance Report"}
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  );
}
