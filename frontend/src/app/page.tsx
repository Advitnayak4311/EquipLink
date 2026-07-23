"use client";

import { useAuth } from "@/contexts/AuthContext";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import PublicLandingView from "@/components/home/PublicLandingView";
import CustomerPortalView from "@/components/home/CustomerPortalView";
import OwnerPortalView from "@/components/home/OwnerPortalView";
import Loader from "@/components/common/Loader";

export default function HomePage() {
  const { user, isAuthenticated, isLoading } = useAuth();

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />

      <main className="flex-1">
        {isLoading ? (
          <div className="py-24 flex items-center justify-center">
            <Loader label="Initializing EquipLink portal..." />
          </div>
        ) : !isAuthenticated || !user ? (
          // 1. Guest / Unauthenticated Visitors -> Public Heavy Machinery Marketplace Landing Page
          <PublicLandingView />
        ) : user.role === "OWNER" ? (
          // 2. Equipment Owners -> Fleet Owner Operational Command Center
          <OwnerPortalView />
        ) : (
          // 3. Customers / Lessees -> Lessee Customer Machinery Portal
          <CustomerPortalView />
        )}
      </main>

      <Footer />
    </div>
  );
}
