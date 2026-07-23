"use client";

import { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import Breadcrumb from "@/components/common/Breadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Calculator,
  Zap,
  Fuel,
  Users,
  ShieldCheck,
  TrendingUp,
  Leaf,
  Sparkles,
  ArrowRight,
  FileSpreadsheet,
  Layers,
  Truck,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import { downloadEstimatePDF } from "@/lib/pdfGenerator";

export default function CalculatorPage() {
  const [projectType, setProjectType] = useState("HIGHWAY");
  const [durationDays, setDurationDays] = useState(30);
  const [excavators, setExcavators] = useState(2);
  const [cranes, setCranes] = useState(1);
  const [rollers, setRollers] = useState(2);

  // Calculations
  const dailyExcavatorRate = 9500;
  const dailyCraneRate = 18000;
  const dailyRollerRate = 6000;

  const dailyFuelPerExcavator = 85; // liters
  const dailyFuelPerCrane = 110; // liters
  const dailyFuelPerRoller = 45; // liters
  const fuelPricePerLiter = 90; // ₹

  const totalMachineryUnits = excavators + cranes + rollers;

  const dailyEquipmentCost =
    excavators * dailyExcavatorRate + cranes * dailyCraneRate + rollers * dailyRollerRate;
  const totalEquipmentCost = dailyEquipmentCost * durationDays;

  const totalFuelLiters =
    (excavators * dailyFuelPerExcavator +
      cranes * dailyFuelPerCrane +
      rollers * dailyFuelPerRoller) *
    durationDays;
  const totalFuelCost = totalFuelLiters * fuelPricePerLiter;

  const recommendedOperators = Math.ceil(totalMachineryUnits * 1.5);
  const estimatedCO2Tons = Number(((totalFuelLiters * 2.68) / 1000).toFixed(1));

  const handleExportEstimate = () => {
    downloadEstimatePDF({
      projectType,
      durationDays,
      excavators,
      cranes,
      rollers,
      dailyEquipmentCost,
      totalEquipmentCost,
      totalFuelLiters,
      totalFuelCost,
      recommendedOperators,
      estimatedCO2Tons,
    });
    toast.success("AI Cost Estimate PDF generated & opened for print/download!");
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8 max-w-7xl space-y-10">
        <Breadcrumb />

        {/* Hero Header */}
        <div className="relative rounded-3xl bg-slate-950 text-white p-8 md:p-12 overflow-hidden shadow-xl border border-amber-500/20 glow-amber">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-3xl space-y-4">
            <Badge className="bg-amber-500 text-slate-950 font-black px-3 py-1 text-xs tracking-wider uppercase">
              <Sparkles className="w-3.5 h-3.5 mr-1 inline" /> AI Fleet Estimator & Fuel Calculator
            </Badge>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
              Instant B2B Machinery Rental & Fuel Budget Forecast
            </h1>
            <p className="text-slate-300 text-base md:text-lg leading-relaxed">
              Calculate exact equipment lease budgets, diesel fuel consumption, operator headcount requirements, and carbon emission projections for highway, mining, and commercial construction projects.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Controls Form */}
          <Card className="lg:col-span-1 border shadow-sm h-fit">
            <CardHeader>
              <CardTitle className="text-xl font-bold flex items-center">
                <Calculator className="w-5 h-5 mr-2 text-amber-500" /> Project Parameters
              </CardTitle>
              <CardDescription className="text-xs">
                Adjust machinery counts and lease duration for instant calculation.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-1.5">
                <Label htmlFor="projectType" className="text-xs font-bold uppercase tracking-wider">
                  Project Domain
                </Label>
                <select
                  id="projectType"
                  suppressHydrationWarning
                  value={projectType}
                  onChange={(e) => setProjectType(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none"
                >
                  <option value="HIGHWAY">Highway & Expressway Paving</option>
                  <option value="MINING">Mining & Bulk Earth Excavation</option>
                  <option value="HIGH_RISE">High-Rise Building Construction</option>
                  <option value="METRO">Metro Rail & Bridge Infrastructure</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <Label htmlFor="durationDays" className="text-xs font-bold uppercase tracking-wider">
                    Lease Duration (Days)
                  </Label>
                  <span className="text-sm font-extrabold text-amber-600">{durationDays} Days</span>
                </div>
                <Input
                  id="durationDays"
                  type="number"
                  min={1}
                  max={365}
                  value={durationDays}
                  onChange={(e) => setDurationDays(Math.max(1, Number(e.target.value)))}
                />
              </div>

              <div className="space-y-4 pt-2 border-t">
                <h4 className="text-xs font-extrabold text-foreground uppercase tracking-wider">
                  Fleet Configuration
                </h4>

                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span>Heavy Hydraulic Excavators</span>
                    <span className="font-bold text-amber-600">{excavators} Units</span>
                  </div>
                  <Input
                    type="number"
                    min={0}
                    max={50}
                    value={excavators}
                    onChange={(e) => setExcavators(Math.max(0, Number(e.target.value)))}
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span>Hydraulic Cranes (50T-100T)</span>
                    <span className="font-bold text-amber-600">{cranes} Units</span>
                  </div>
                  <Input
                    type="number"
                    min={0}
                    max={30}
                    value={cranes}
                    onChange={(e) => setCranes(Math.max(0, Number(e.target.value)))}
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span>Vibratory Road Rollers</span>
                    <span className="font-bold text-amber-600">{rollers} Units</span>
                  </div>
                  <Input
                    type="number"
                    min={0}
                    max={40}
                    value={rollers}
                    onChange={(e) => setRollers(Math.max(0, Number(e.target.value)))}
                  />
                </div>
              </div>

              <Button onClick={handleExportEstimate} className="w-full font-bold shadow-md">
                <FileSpreadsheet className="w-4 h-4 mr-2" /> Download AI Cost Estimate PDF
              </Button>
            </CardContent>
          </Card>

          {/* Results Summary & Breakdown */}
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Cost Card */}
              <Card className="border shadow-sm bg-gradient-to-br from-slate-900 to-amber-950 text-white border-amber-500/30">
                <CardHeader className="pb-2">
                  <Badge className="w-fit bg-amber-500 text-slate-950 font-bold text-[10px] uppercase">
                    Est. Equipment Budget
                  </Badge>
                  <CardTitle className="text-3xl font-black pt-1 text-amber-400">
                    ₹{totalEquipmentCost.toLocaleString("en-IN")}
                  </CardTitle>
                  <CardDescription className="text-slate-300 text-xs">
                    Calculated for {durationDays} days ({totalMachineryUnits} total machinery units)
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-xs text-slate-300 border-t border-amber-500/20 pt-3 mt-2 space-y-1">
                  <div className="flex justify-between">
                    <span>Daily Machinery Lease Rate:</span>
                    <span className="font-bold text-white">₹{dailyEquipmentCost.toLocaleString("en-IN")}/day</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Included Insurance:</span>
                    <span className="font-bold text-emerald-400">100% Covered</span>
                  </div>
                </CardContent>
              </Card>

              {/* Fuel Card */}
              <Card className="border shadow-sm bg-gradient-to-br from-slate-900 to-blue-950 text-white border-blue-500/30">
                <CardHeader className="pb-2">
                  <Badge className="w-fit bg-blue-500 text-white font-bold text-[10px] uppercase">
                    Est. Diesel Fuel Consumption
                  </Badge>
                  <CardTitle className="text-3xl font-black pt-1 text-blue-400">
                    {totalFuelLiters.toLocaleString("en-IN")} Liters
                  </CardTitle>
                  <CardDescription className="text-slate-300 text-xs">
                    Est. Fuel Cost: ₹{totalFuelCost.toLocaleString("en-IN")} (@ ₹90/L)
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-xs text-slate-300 border-t border-blue-500/20 pt-3 mt-2 space-y-1">
                  <div className="flex justify-between">
                    <span>Daily Diesel Burn:</span>
                    <span className="font-bold text-white">
                      {Math.round(totalFuelLiters / durationDays)} L/day
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Telematics Fuel Monitoring:</span>
                    <span className="font-bold text-blue-400">Active Sensors</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Crew & Carbon Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Card className="border shadow-sm">
                <CardContent className="pt-6 flex items-start space-x-4">
                  <div className="p-3 rounded-xl bg-purple-500/10 text-purple-600 border border-purple-500/20">
                    <Users className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-xs text-muted-foreground uppercase font-bold tracking-wider">
                      Recommended Operator Guild Crew
                    </h4>
                    <div className="text-2xl font-black text-foreground mt-1">
                      {recommendedOperators} Certified Drivers
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Includes primary operators & rotation shift drivers with safety induction certificates.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border shadow-sm">
                <CardContent className="pt-6 flex items-start space-x-4">
                  <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                    <Leaf className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-xs text-muted-foreground uppercase font-bold tracking-wider">
                      Estimated Carbon Footprint
                    </h4>
                    <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
                      {estimatedCO2Tons} Tons CO2
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Eligible for EquipLink ESG Green Offset Credits.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Action CTA Box */}
            <div className="bg-card border rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-foreground">Ready to Deploy This Fleet?</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Reserve this exact machinery combination in our live marketplace catalog.
                </p>
              </div>
              <Button asChild size="lg" className="font-bold shadow-md bg-amber-500 hover:bg-amber-400 text-slate-950">
                <Link href="/marketplace">
                  Browse Live Machinery Catalog <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
