"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import Loader from "@/components/common/Loader";

export default function DashboardRouteDispatcher() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated || !user) {
      router.replace("/login");
      return;
    }

    if (user.role === "ADMIN") {
      router.replace("/dashboard/admin");
    } else if (user.role === "OWNER") {
      router.replace("/dashboard/owner");
    } else {
      router.replace("/dashboard/customer");
    }
  }, [user, isAuthenticated, isLoading, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Loader label="Redirecting to your dashboard portal..." />
    </div>
  );
}
