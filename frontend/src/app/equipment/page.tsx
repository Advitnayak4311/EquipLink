"use client";

import { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import Breadcrumb from "@/components/common/Breadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Truck,
  Search,
  Filter,
  ShieldCheck,
  Zap,
  MapPin,
  Sparkles,
  ChevronRight,
  Plus,
  Compass,
  CheckCircle2,
  Cpu,
  Layers,
  Clock,
} from "lucide-react";
import { useAllEquipment, useCategories } from "@/lib/api/equipmentService";
import EquipmentGrid from "@/components/common/EquipmentGrid";
import { useAuth } from "@/contexts/AuthContext";

export default function EquipmentCatalogPage() {
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | string>("");

  const { data: categories } = useCategories();
  const { data: pageData, isLoading } = useAllEquipment({
    page: 0,
    size: 12,
    search: search || undefined,
    categoryId: selectedCategoryId ? Number(selectedCategoryId) : undefined,
  });

  const equipmentList = pageData?.content || [];

  // Machinery Fleet Specialty Showcase Data
  const fleetCategories = [
    {
      title: "Earthmoving Machinery",
      desc: "Excavators, Bulldozers, Backhoe Loaders & Wheel Loaders for site excavation.",
      icon: Truck,
      count: "1,450+ Units",
      color: "bg-amber-500/10 text-amber-600 border-amber-500/20",
    },
    {
      title: "Cranes & Heavy Lifting",
      desc: "Mobile Hydraulic Cranes, Tower Cranes & Rough Terrain Cranes for lifting.",
      icon: Layers,
      count: "820+ Units",
      color: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    },
    {
      title: "Road Construction & Paving",
      desc: "Vibratory Road Rollers, Asphalt Pavers & Motor Graders for roadwork.",
      icon: Cpu,
      count: "640+ Units",
      color: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    },
    {
      title: "Concrete & Material Handling",
      desc: "Transit Mixers, Concrete Pumps, Forklifts & Boom Lifts for building sites.",
      icon: Zap,
      count: "980+ Units",
      color: "bg-purple-500/10 text-purple-600 border-purple-500/20",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8 max-w-7xl space-y-10">
        <Breadcrumb />

        {/* Hero Section */}
        <div className="relative rounded-3xl bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950 text-white p-8 md:p-12 overflow-hidden shadow-xl border border-amber-500/20">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-3xl space-y-4">
            <Badge className="bg-amber-500 text-slate-950 font-bold px-3 py-1 text-xs tracking-wider uppercase">
              Pan-India Heavy Equipment Fleet Catalog
            </Badge>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
              Verified Construction Equipment Fleet & Specification Guide
            </h1>
            <p className="text-slate-300 text-base md:text-lg leading-relaxed">
              Explore India&apos;s largest certified heavy machinery directory. Compare operating capacities, daily rental rates, GPS telematics support, and certified operator availability.
            </p>

            <div className="pt-4 flex flex-wrap gap-4 items-center">
              <Button asChild size="lg" className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold shadow-md">
                <Link href="/marketplace">
                  <Search className="mr-2 h-5 w-5" /> Browse Live Marketplace
                </Link>
              </Button>
              {user?.role === "OWNER" ? (
                <Button asChild size="lg" className="bg-slate-800 hover:bg-slate-700 text-white font-bold border border-slate-600 shadow-md">
                  <Link href="/dashboard/owner/equipment">
                    <Truck className="mr-2 h-5 w-5" /> Manage My Listed Fleet
                  </Link>
                </Button>
              ) : (
                <Button asChild size="lg" className="bg-slate-800 hover:bg-slate-700 text-amber-400 font-bold border border-amber-500/40 shadow-md">
                  <Link href="/register?role=OWNER">
                    <Plus className="mr-2 h-5 w-5" /> List Equipment & Earn
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Fleet Specialty Category Cards */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Machinery Categories & Specialties</h2>
              <p className="text-sm text-muted-foreground mt-1">Standardized heavy equipment specifications for construction & mining projects across India.</p>
            </div>
            {selectedCategoryId && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedCategoryId("")}
                className="text-xs font-bold border-amber-500/40 text-amber-500 hover:bg-amber-500 hover:text-slate-950"
              >
                Clear Selected Category Filter
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories && categories.length > 0 ? (
              categories.map((cat) => (
                <Card
                  key={cat.id}
                  onClick={() => setSelectedCategoryId(cat.id === selectedCategoryId ? "" : cat.id)}
                  className={`border shadow-sm hover:shadow-md transition-all cursor-pointer ${
                    selectedCategoryId === cat.id ? "ring-2 ring-amber-500 border-amber-500 bg-amber-500/10" : ""
                  }`}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="p-3 rounded-xl border bg-amber-500/10 text-amber-500 border-amber-500/20">
                        <Truck className="h-6 w-6" />
                      </div>
                      <Badge variant="outline" className="text-xs font-semibold">Verified Category</Badge>
                    </div>
                    <CardTitle className="text-lg mt-3">{cat.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {cat.description || `Heavy machinery certified for ${cat.name.toLowerCase()} infrastructure operations.`}
                    </p>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-4 text-center py-6 text-xs text-muted-foreground">
                Loading live machinery categories...
              </div>
            )}
          </div>
        </div>

        {/* Live Machinery Directory Search & Filter */}
        <div className="space-y-6 pt-4 border-t">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold tracking-tight flex items-center">
                <Compass className="mr-2 h-6 w-6 text-primary" /> Active Equipment Directory
              </h2>
              <p className="text-sm text-muted-foreground mt-1">Filter live machinery listings by category and location.</p>
            </div>
          </div>

          <div className="bg-card p-4 rounded-2xl border shadow-sm flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search equipment by brand (CAT, JCB), model (320D, 3DX), or city..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 text-sm"
              />
            </div>

            <select
              value={selectedCategoryId}
              onChange={(e) => setSelectedCategoryId(e.target.value)}
              className="h-10 w-full md:w-56 rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="">All Categories</option>
              {categories?.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Grid Display */}
          <EquipmentGrid
            items={equipmentList}
            isLoading={isLoading}
            emptyMessage="No machinery currently listed matching your criteria. Be the first owner to list equipment in this category!"
          />
        </div>

        {/* Real-World Trust & Quality Checklist Section */}
        <div className="bg-muted/40 rounded-3xl p-8 border space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <Badge variant="secondary" className="px-3 py-1 font-semibold text-xs">
              <ShieldCheck className="mr-1.5 h-3.5 w-3.5 text-emerald-600" /> Real-World Quality Assurance
            </Badge>
            <h3 className="text-2xl font-bold tracking-tight">Every Machine Inspected Before Deployment</h3>
            <p className="text-sm text-muted-foreground">
              EquipLink verifies vehicle fitness certificates, operator credentials, and maintenance logs prior to lease execution.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
            <div className="bg-card p-5 rounded-xl border flex items-start space-x-4">
              <CheckCircle2 className="h-6 w-6 text-emerald-600 shrink-0 mt-1" />
              <div>
                <h4 className="font-bold text-sm">GPS Telematics & Hour Meter Tracked</h4>
                <p className="text-xs text-muted-foreground mt-1">Live tracking of engine operating hours to guarantee fair hourly/daily billing.</p>
              </div>
            </div>

            <div className="bg-card p-5 rounded-xl border flex items-start space-x-4">
              <CheckCircle2 className="h-6 w-6 text-emerald-600 shrink-0 mt-1" />
              <div>
                <h4 className="font-bold text-sm">Certified Operator Included Option</h4>
                <p className="text-xs text-muted-foreground mt-1">Choose between certified machine drivers or bare rental based on project needs.</p>
              </div>
            </div>

            <div className="bg-card p-5 rounded-xl border flex items-start space-x-4">
              <CheckCircle2 className="h-6 w-6 text-emerald-600 shrink-0 mt-1" />
              <div>
                <h4 className="font-bold text-sm">GST Tax Invoicing & Insurance</h4>
                <p className="text-xs text-muted-foreground mt-1">100% compliant B2B invoicing with full transit and jobsite insurance coverage.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
