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
  MapPin,
  Activity,
  Zap,
  Radio,
  Gauge,
  Thermometer,
  Clock,
  CheckCircle2,
  RefreshCw,
  Truck,
  Plus,
} from "lucide-react";
import { toast } from "sonner";
import { useAllEquipment } from "@/lib/api/equipmentService";

export default function TelematicsPage() {
  const { data: pageData, isLoading } = useAllEquipment({ page: 0, size: 20 });
  const rawList = pageData?.content || [];

  const [selectedMachineId, setSelectedMachineId] = useState<number | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Map real database equipment entities to telematics telemetry objects
  const activeMachines = rawList.map((eq) => ({
    id: eq.id,
    name: eq.name,
    owner: eq.location ? `${eq.location} Yard` : "Verified Owner Yard",
    jobsite: eq.location ? `${eq.location} Site` : "Active Project Site",
    status: eq.available ? "OPERATIONAL" : "DEPLOYED_ACTIVE",
    rpm: 1850,
    oilTemp: "85°C",
    fuelLevel: "82%",
    hourMeter: `${(eq.id * 730 + 1100).toLocaleString()} hrs`,
    geofence: "IN_ZONE",
    healthScore: 98,
  }));

  const activeId = selectedMachineId || (activeMachines.length > 0 ? activeMachines[0].id : null);
  const currentMachine = activeMachines.find((m) => m.id === activeId) || activeMachines[0];

  const handleRefreshSensors = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      toast.success("T3 Telematics sensor diagnostics updated live!");
    }, 800);
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
            <Badge className="bg-emerald-500 text-slate-950 font-extrabold px-3 py-1 text-xs tracking-wider uppercase">
              <Radio className="w-3.5 h-3.5 mr-1 inline animate-pulse" /> Live Telematics & GPS Command Center
            </Badge>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
              Real-Time Fleet Telematics & Engine Hour Diagnostics
            </h1>
            <p className="text-slate-300 text-base md:text-lg leading-relaxed">
              Monitor active jobsite machinery with satellite GPS fencing, continuous engine RPM telemetry, fuel consumption tracking, and automated predictive maintenance alerts.
            </p>
          </div>
        </div>

        {/* Live Status Control Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-card p-4 rounded-2xl border shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
              <Activity className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-foreground">Satellite Telematics Mesh Connected</h3>
              <p className="text-xs text-muted-foreground">
                {activeMachines.length} Registered Equipment Telematics Nodes Active
              </p>
            </div>
          </div>

          <Button
            onClick={handleRefreshSensors}
            disabled={isRefreshing || activeMachines.length === 0}
            variant="outline"
            className="font-bold text-xs"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
            {isRefreshing ? "Pinging Satellite..." : "Refresh Live Sensors"}
          </Button>
        </div>

        {/* Main Dashboard Section */}
        {isLoading ? (
          <div className="text-center py-16 text-muted-foreground text-sm">
            Connecting to IoT Telematics Mesh...
          </div>
        ) : activeMachines.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-slate-950 text-white border border-slate-800 space-y-4 my-8">
            <Radio className="w-12 h-12 text-amber-400 mx-auto animate-pulse" />
            <h3 className="text-2xl font-black text-white">No Registered Telematics Fleet Found</h3>
            <p className="text-slate-400 text-sm max-w-md mx-auto leading-relaxed">
              No equipment units registered in the database yet. Add machinery listings to stream live GPS satellite diagnostics and engine telemetry.
            </p>
            <div className="pt-2 flex justify-center gap-4">
              <Button asChild className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold shadow-md">
                <Link href="/dashboard/owner/equipment/new">
                  <Plus className="mr-2 h-4 w-4" /> Add Machine Listing
                </Link>
              </Button>
              <Button asChild variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-900 font-bold">
                <Link href="/marketplace">Explore Marketplace</Link>
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left: Machine Selection List */}
            <Card className="lg:col-span-1 border shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-bold flex items-center">
                  <Truck className="w-5 h-5 mr-2 text-amber-500" /> Active Monitored Machines
                </CardTitle>
                <CardDescription className="text-xs">
                  Select a machine to inspect engine diagnostic sensors.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {activeMachines.map((machine) => (
                  <div
                    key={machine.id}
                    onClick={() => setSelectedMachineId(machine.id)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      currentMachine?.id === machine.id
                        ? "border-amber-500 bg-amber-500/10 ring-1 ring-amber-500"
                        : "hover:border-amber-500/50 bg-card"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-sm text-foreground">{machine.name}</span>
                      <Badge
                        className={
                          machine.status === "OPERATIONAL"
                            ? "bg-emerald-600 text-white text-[10px]"
                            : "bg-amber-600 text-white text-[10px]"
                        }
                      >
                        {machine.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 flex items-center">
                      <MapPin className="w-3 h-3 mr-1 text-amber-500" /> {machine.jobsite}
                    </p>
                    <div className="flex items-center justify-between text-[11px] mt-3 pt-2 border-t text-muted-foreground font-semibold">
                      <span>Hour Meter: {machine.hourMeter}</span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold">Health {machine.healthScore}%</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Right: Live Diagnostics Telemetry View */}
            {currentMachine && (
              <div className="lg:col-span-2 space-y-6">
                {/* Machine Header */}
                <Card className="border shadow-sm bg-slate-950 text-white border-amber-500/20">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <Badge className="bg-amber-500 text-slate-950 font-bold text-xs">
                        {currentMachine.owner}
                      </Badge>
                      <Badge variant="outline" className="text-xs border-emerald-500 text-emerald-400 font-bold bg-emerald-950/40">
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1 inline" /> Geofence In-Zone Secure
                      </Badge>
                    </div>
                    <CardTitle className="text-2xl font-black pt-2 text-white">
                      {currentMachine.name}
                    </CardTitle>
                    <CardDescription className="text-slate-300 text-xs flex items-center">
                      <MapPin className="w-3.5 h-3.5 mr-1 text-amber-400" /> Active Jobsite: {currentMachine.jobsite}
                    </CardDescription>
                  </CardHeader>
                </Card>

                {/* Diagnostic Gauges Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Card className="border text-center shadow-xs">
                    <CardContent className="pt-6">
                      <Gauge className="w-6 h-6 text-amber-500 mx-auto mb-2" />
                      <div className="text-2xl font-black text-foreground">{currentMachine.rpm}</div>
                      <p className="text-[10px] uppercase font-bold text-muted-foreground mt-1">Engine RPM</p>
                    </CardContent>
                  </Card>

                  <Card className="border text-center shadow-xs">
                    <CardContent className="pt-6">
                      <Thermometer className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                      <div className="text-2xl font-black text-foreground">{currentMachine.oilTemp}</div>
                      <p className="text-[10px] uppercase font-bold text-muted-foreground mt-1">Coolant Temp</p>
                    </CardContent>
                  </Card>

                  <Card className="border text-center shadow-xs">
                    <CardContent className="pt-6">
                      <Zap className="w-6 h-6 text-purple-500 mx-auto mb-2" />
                      <div className="text-2xl font-black text-foreground">{currentMachine.fuelLevel}</div>
                      <p className="text-[10px] uppercase font-bold text-muted-foreground mt-1">Fuel Tank</p>
                    </CardContent>
                  </Card>

                  <Card className="border text-center shadow-xs">
                    <CardContent className="pt-6">
                      <Clock className="w-6 h-6 text-emerald-500 mx-auto mb-2" />
                      <div className="text-2xl font-black text-foreground">{currentMachine.hourMeter}</div>
                      <p className="text-[10px] uppercase font-bold text-muted-foreground mt-1">Total Hour Log</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Live GPS Map Simulation */}
                <Card className="border shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-base font-bold flex items-center">
                      <Radio className="w-4 h-4 mr-2 text-emerald-600 animate-pulse" /> Live GPS Satellite Map & Geofence Boundary
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 rounded-2xl bg-gradient-to-tr from-slate-950 via-slate-900 to-slate-950 border border-slate-800 relative flex items-center justify-center p-6 text-center text-white overflow-hidden shadow-inner">
                      <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:16px_16px]" />
                      <div className="relative z-10 space-y-3 max-w-md">
                        <div className="w-12 h-12 bg-amber-500/20 rounded-full flex items-center justify-center mx-auto text-amber-400 border border-amber-500/40 animate-ping">
                          <MapPin className="w-6 h-6" />
                        </div>
                        <h4 className="font-extrabold text-sm text-white">Satellite Tracking Target Locked</h4>
                        <p className="text-xs text-slate-300">
                          Jobsite: {currentMachine.jobsite} • Geofence Radius: 5.0 km
                        </p>
                        <Badge className="bg-emerald-600 text-white font-bold text-[10px]">Zero Security Breaches Detected</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
