"use client";

import { useState, useMemo } from "react";
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
  Building2,
  MapPin,
  ShieldCheck,
  Award,
  Users,
  CheckCircle2,
  FileText,
  Send,
  Phone,
  Mail,
  Truck,
  Cpu,
  Zap,
  Globe,
  Layers,
  ArrowRight,
  Search,
} from "lucide-react";
import { toast } from "sonner";
import { useAllEquipment, useCategories } from "@/lib/api/equipmentService";
import EquipmentGrid from "@/components/common/EquipmentGrid";

export default function CompanyPage() {
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [quoteForm, setQuoteForm] = useState({
    companyName: "",
    contactPerson: "",
    email: "",
    phone: "",
    machineryNeeded: "Excavator",
    projectDuration: "1-3 Months",
    projectLocation: "",
    requirements: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Live Backend Data Queries
  const { data: categories } = useCategories();
  const { data: pageData, isLoading: loadingEquipment } = useAllEquipment({ page: 0, size: 50 });
  const allEquipment = pageData?.content || [];

  // Dynamically calculate metrics from actual DB items
  const totalFleetCount = pageData?.totalElements || 0;
  const availableCount = useMemo(
    () => allEquipment.filter((item) => item.availabilityStatus === "AVAILABLE").length,
    [allEquipment]
  );

  // Extract unique locations from actual database listings
  const dbLocations = useMemo(() => {
    const locSet = new Set<string>();
    allEquipment.forEach((item) => {
      if (item.location) {
        locSet.add(item.location.trim());
      }
    });
    return Array.from(locSet);
  }, [allEquipment]);

  // Extract unique equipment brands present in backend database
  const dbBrands = useMemo(() => {
    const brandMap = new Map<string, number>();
    allEquipment.forEach((item) => {
      if (item.brand) {
        const brandName = item.brand.trim();
        brandMap.set(brandName, (brandMap.get(brandName) || 0) + 1);
      }
    });
    return Array.from(brandMap.entries());
  }, [allEquipment]);

  // Filter equipment based on chosen city
  const filteredEquipment = useMemo(() => {
    if (!selectedCity) return allEquipment;
    return allEquipment.filter((item) =>
      item.location?.toLowerCase().includes(selectedCity.toLowerCase())
    );
  }, [allEquipment, selectedCity]);

  const handleQuoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quoteForm.companyName || !quoteForm.contactPerson || !quoteForm.phone) {
      toast.error("Please fill in company name, contact person, and phone number.");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success(
        "Enterprise fleet quote request submitted! Our corporate manager will contact you shortly."
      );
      setQuoteForm({
        companyName: "",
        contactPerson: "",
        email: "",
        phone: "",
        machineryNeeded: "Excavator",
        projectDuration: "1-3 Months",
        projectLocation: "",
        requirements: "",
      });
    }, 1000);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8 max-w-7xl space-y-12">
        <Breadcrumb />

        {/* Hero Banner */}
        <div className="relative rounded-3xl bg-slate-950 text-white p-8 md:p-14 overflow-hidden shadow-xl border border-amber-500/20">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-3xl space-y-4">
            <Badge className="bg-amber-500 text-slate-950 font-extrabold px-3 py-1 text-xs tracking-wider uppercase">
              EquipLink Corporate Solutions
            </Badge>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight text-white">
              India&apos;s Digitized B2B Heavy Machinery & Fleet Operations Network
            </h1>
            <p className="text-slate-300 text-base md:text-lg leading-relaxed">
              EquipLink connects infrastructure contractors, highway developers, and mining operators with verified equipment owners, GPS telematics tracking, and automated GST billing.
            </p>

            <div className="pt-4 flex flex-wrap gap-4 items-center">
              {/* Button 1: High Visibility Primary CTA */}
              <Button
                asChild
                size="lg"
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold shadow-md px-6"
              >
                <a href="#enterprise-quote">
                  <FileText className="mr-2 h-5 w-5 text-slate-950" /> Request Corporate Fleet Quote
                </a>
              </Button>

              {/* Button 2: Fixed High-Contrast Visible Button */}
              <Button
                asChild
                size="lg"
                className="bg-slate-800 hover:bg-slate-700 text-white font-bold border border-slate-600 shadow-md px-6"
              >
                <a href="#dispatch-hubs">
                  <MapPin className="mr-2 h-5 w-5 text-amber-400" /> Explore Yard Locations
                </a>
              </Button>
            </div>
          </div>
        </div>

        {/* Real-Time Live Database Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <Card className="border shadow-sm text-center">
            <CardContent className="pt-6">
              <div className="text-3xl md:text-4xl font-black text-amber-600 dark:text-amber-400">
                {totalFleetCount}
              </div>
              <p className="text-xs text-muted-foreground font-bold mt-2 uppercase tracking-wider">
                Listed Machinery Units
              </p>
            </CardContent>
          </Card>

          <Card className="border shadow-sm text-center">
            <CardContent className="pt-6">
              <div className="text-3xl md:text-4xl font-black text-emerald-600 dark:text-emerald-400">
                {availableCount}
              </div>
              <p className="text-xs text-muted-foreground font-bold mt-2 uppercase tracking-wider">
                Ready for Immediate Lease
              </p>
            </CardContent>
          </Card>

          <Card className="border shadow-sm text-center">
            <CardContent className="pt-6">
              <div className="text-3xl md:text-4xl font-black text-blue-600 dark:text-blue-400">
                {categories?.length || 0}
              </div>
              <p className="text-xs text-muted-foreground font-bold mt-2 uppercase tracking-wider">
                Machinery Categories
              </p>
            </CardContent>
          </Card>

          <Card className="border shadow-sm text-center">
            <CardContent className="pt-6">
              <div className="text-3xl md:text-4xl font-black text-purple-600 dark:text-purple-400">
                {dbLocations.length > 0 ? dbLocations.length : 1}
              </div>
              <p className="text-xs text-muted-foreground font-bold mt-2 uppercase tracking-wider">
                Active Fleet Hub Cities
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Dynamic Regional Hub Locations (Based on Real Database Equipment) */}
        <div id="dispatch-hubs" className="space-y-6 pt-6 border-t">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-extrabold tracking-tight flex items-center">
                <MapPin className="mr-2 h-6 w-6 text-primary" /> Active Regional Dispatch Yards
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Real equipment inventory grouped by dispatch yard location. Select a city to filter live units.
              </p>
            </div>

            {dbLocations.length > 0 && (
              <div className="flex items-center space-x-2">
                <Button
                  variant={selectedCity === "" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCity("")}
                  className="text-xs font-semibold"
                >
                  All Locations ({allEquipment.length})
                </Button>
                {dbLocations.map((loc) => (
                  <Button
                    key={loc}
                    variant={selectedCity === loc ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCity(loc)}
                    className="text-xs font-semibold"
                  >
                    {loc}
                  </Button>
                ))}
              </div>
            )}
          </div>

          {dbLocations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {dbLocations.map((loc, idx) => {
                const count = allEquipment.filter((item) => item.location?.trim() === loc).length;
                return (
                  <Card key={idx} className="border shadow-sm hover:border-primary transition-all">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="text-xs font-bold text-primary border-primary">
                          Location Hub #{idx + 1}
                        </Badge>
                        <Badge className="bg-emerald-600 text-white text-[10px] font-bold">Live Yard</Badge>
                      </div>
                      <CardTitle className="text-xl mt-2">{loc}</CardTitle>
                      <CardDescription className="text-xs">
                        Direct equipment yard and dispatch facility
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3 pt-0 text-xs">
                      <div className="flex items-center justify-between border-t pt-3">
                        <span className="text-muted-foreground">Active Units Listed:</span>
                        <span className="font-extrabold text-foreground text-sm">{count} Machines</span>
                      </div>
                      <Button
                        size="xs"
                        variant="ghost"
                        onClick={() => setSelectedCity(loc)}
                        className="w-full text-primary font-bold hover:bg-primary/5 mt-2"
                      >
                        View Listed Machinery in {loc} <ArrowRight className="ml-1 h-3.5 w-3.5" />
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <Card className="border p-6 text-center bg-card">
              <MapPin className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
              <h3 className="text-lg font-bold">No Regional Yards Configured Yet</h3>
              <p className="text-xs text-muted-foreground mt-1 max-w-md mx-auto">
                Once machinery owners list equipment with location details, your active regional dispatch hubs will automatically populate here in real-time.
              </p>
              <Button asChild size="sm" className="mt-4 font-bold">
                <Link href="/dashboard/owner/equipment/new">List Machinery Location</Link>
              </Button>
            </Card>
          )}

          {/* Display Equipment for selected city filter */}
          {selectedCity && (
            <div className="pt-4 space-y-4">
              <h3 className="text-lg font-bold text-foreground flex items-center">
                <Truck className="h-5 w-5 mr-2 text-primary" /> Machinery Listed in &quot;{selectedCity}&quot;
              </h3>
              <EquipmentGrid items={filteredEquipment} isLoading={loadingEquipment} />
            </div>
          )}
        </div>

        {/* Dynamic OEM Brands Present in Database */}
        <div className="bg-card rounded-3xl p-8 border space-y-6 shadow-sm">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <Badge variant="secondary" className="px-3 py-1 font-semibold text-xs">
              <Award className="mr-1.5 h-3.5 w-3.5 text-amber-500" /> Platform OEM Machinery Brands
            </Badge>
            <h3 className="text-2xl font-extrabold tracking-tight">Heavy Equipment Brands On EquipLink</h3>
            <p className="text-sm text-muted-foreground">
              Real brand manufacturers listed by verified owners across India.
            </p>
          </div>

          {dbBrands.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
              {dbBrands.map(([brand, count], idx) => (
                <div key={idx} className="bg-muted/40 p-5 rounded-xl border flex items-center justify-between shadow-xs">
                  <div>
                    <Badge className="bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-300 text-[10px] uppercase font-bold mb-1">
                      Verified Brand
                    </Badge>
                    <h4 className="font-extrabold text-base text-foreground">{brand}</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">{count} active units in catalog</p>
                  </div>
                  <CheckCircle2 className="h-6 w-6 text-emerald-600 shrink-0" />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-xs text-muted-foreground">
              Add equipment listings with brand details (e.g. Caterpillar, JCB, Komatsu) to dynamically display verified brand alliances!
            </p>
          )}
        </div>

        {/* Enterprise Services Pillars */}
        <div>
          <div className="text-center max-w-3xl mx-auto mb-8">
            <Badge variant="secondary" className="px-3 py-1 font-semibold text-xs mb-2">
              Corporate Infrastructure
            </Badge>
            <h2 className="text-3xl font-extrabold tracking-tight">Real-World Operations & Telematics</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border shadow-sm">
              <CardHeader>
                <Cpu className="h-8 w-8 text-amber-500 mb-2" />
                <CardTitle className="text-xl">T3 Telematics & GPS Tracking</CardTitle>
                <CardDescription>
                  Real-time engine hour monitoring, fuel usage analytics, and geofenced jobsite boundaries.
                </CardDescription>
              </CardHeader>
              <CardContent className="text-xs space-y-2 text-muted-foreground">
                <div className="flex items-center"><CheckCircle2 className="h-4 w-4 text-emerald-600 mr-2 shrink-0" /> Live engine hour tracking</div>
                <div className="flex items-center"><CheckCircle2 className="h-4 w-4 text-emerald-600 mr-2 shrink-0" /> Automated maintenance alerts</div>
              </CardContent>
            </Card>

            <Card className="border shadow-sm">
              <CardHeader>
                <Users className="h-8 w-8 text-blue-500 mb-2" />
                <CardTitle className="text-xl">Certified Operator Guild</CardTitle>
                <CardDescription>
                  Pre-screened machine operators with active licenses, site safety induction, and PF compliance.
                </CardDescription>
              </CardHeader>
              <CardContent className="text-xs space-y-2 text-muted-foreground">
                <div className="flex items-center"><CheckCircle2 className="h-4 w-4 text-emerald-600 mr-2 shrink-0" /> Certified for excavators & cranes</div>
                <div className="flex items-center"><CheckCircle2 className="h-4 w-4 text-emerald-600 mr-2 shrink-0" /> Mandatory site safety compliance</div>
              </CardContent>
            </Card>

            <Card className="border shadow-sm">
              <CardHeader>
                <ShieldCheck className="h-8 w-8 text-emerald-500 mb-2" />
                <CardTitle className="text-xl">GST & Insurance Protection</CardTitle>
                <CardDescription>
                  Full legal tax compliance with instant GST e-invoices, e-way bills, and transit insurance.
                </CardDescription>
              </CardHeader>
              <CardContent className="text-xs space-y-2 text-muted-foreground">
                <div className="flex items-center"><CheckCircle2 className="h-4 w-4 text-emerald-600 mr-2 shrink-0" /> Input tax credit (ITC) ready</div>
                <div className="flex items-center"><CheckCircle2 className="h-4 w-4 text-emerald-600 mr-2 shrink-0" /> 100% jobsite insurance coverage</div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Enterprise Fleet Quote Form */}
        <div id="enterprise-quote" className="bg-card border rounded-3xl p-8 md:p-12 shadow-sm space-y-8">
          <div className="max-w-2xl space-y-2">
            <Badge className="bg-primary text-primary-foreground font-bold px-3 py-1 text-xs uppercase">
              Corporate Desk
            </Badge>
            <h2 className="text-3xl font-extrabold tracking-tight">Request an Enterprise Fleet Quote</h2>
            <p className="text-sm text-muted-foreground">
              Need custom long-term bundle pricing or multi-machinery project leasing? Submit your requirements below.
            </p>
          </div>

          <form onSubmit={handleQuoteSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <Label htmlFor="companyName">Company / Enterprise Name <span className="text-destructive">*</span></Label>
                <Input
                  id="companyName"
                  placeholder="e.g. Patel Infrastructure Pvt Ltd"
                  value={quoteForm.companyName}
                  onChange={(e) => setQuoteForm({ ...quoteForm, companyName: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="contactPerson">Contact Person Name <span className="text-destructive">*</span></Label>
                <Input
                  id="contactPerson"
                  placeholder="e.g. Rajesh Sharma (Procurement Head)"
                  value={quoteForm.contactPerson}
                  onChange={(e) => setQuoteForm({ ...quoteForm, contactPerson: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <Label htmlFor="email">Official Business Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="rajesh.sharma@company.com"
                  value={quoteForm.email}
                  onChange={(e) => setQuoteForm({ ...quoteForm, email: e.target.value })}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="phone">Mobile / Direct Phone <span className="text-destructive">*</span></Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={quoteForm.phone}
                  onChange={(e) => setQuoteForm({ ...quoteForm, phone: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-1.5">
                <Label htmlFor="machineryNeeded">Primary Machinery Category</Label>
                <select
                  id="machineryNeeded"
                  value={quoteForm.machineryNeeded}
                  onChange={(e) => setQuoteForm({ ...quoteForm, machineryNeeded: e.target.value })}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none"
                >
                  <option value="Excavator">Excavators & Earthmovers</option>
                  <option value="Crane">Hydraulic Cranes & Lifting</option>
                  <option value="Bulldozer">Bulldozers & Crawlers</option>
                  <option value="RoadRoller">Road Rollers & Compactors</option>
                  <option value="DumpTruck">Dump & Haulage Fleet</option>
                  <option value="Multiple">Multiple Machinery Package</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="projectDuration">Estimated Project Lease Duration</Label>
                <select
                  id="projectDuration"
                  value={quoteForm.projectDuration}
                  onChange={(e) => setQuoteForm({ ...quoteForm, projectDuration: e.target.value })}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none"
                >
                  <option value="1-3 Months">1 to 3 Months</option>
                  <option value="3-6 Months">3 to 6 Months</option>
                  <option value="6-12 Months">6 to 12 Months</option>
                  <option value="1+ Year">Long-Term (1+ Year)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="projectLocation">Project Jobsite Location</Label>
                <Input
                  id="projectLocation"
                  placeholder="e.g. Surat Industrial Corridor, GJ"
                  value={quoteForm.projectLocation}
                  onChange={(e) => setQuoteForm({ ...quoteForm, projectLocation: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="requirements">Additional Specs or Operator Requirements</Label>
              <textarea
                id="requirements"
                rows={3}
                placeholder="Mention specific bucket sizes, max boom reach, operator requirements, or site shifts..."
                value={quoteForm.requirements}
                onChange={(e) => setQuoteForm({ ...quoteForm, requirements: e.target.value })}
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none"
              />
            </div>

            <Button type="submit" disabled={isSubmitting} size="lg" className="font-bold w-full sm:w-auto">
              {isSubmitting ? "Submitting Request..." : "Submit Corporate Quote Request"}
              <Send className="ml-2 h-4 w-4" />
            </Button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
