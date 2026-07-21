"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import Loader from "@/components/common/Loader";

export default function BookingsRouteDispatcher() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      router.replace("/login?redirect=/bookings");
      return;
    }

    if (user?.role === "OWNER") {
      router.replace("/dashboard/owner/bookings");
    } else {
      router.replace("/dashboard/customer/bookings");
    }
  }, [user, isAuthenticated, isLoading, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Loader label="Redirecting to your bookings dashboard..." />
    </div>
  );
}
