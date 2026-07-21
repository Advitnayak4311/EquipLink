"use client";

import { useAuth } from "@/contexts/AuthContext";
import { Role } from "@/types";
import React from "react";
import Loader from "./Loader";

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: Role[];
  fallback?: React.ReactNode;
}

/**
 * Guard component that only renders its children if the authenticated user
 * has one of the allowed roles.
 */
export default function RoleGuard({
  children,
  allowedRoles,
  fallback = (
    <div className="flex flex-col items-center justify-center p-8 bg-card rounded-xl border max-w-lg mx-auto my-8">
      <h3 className="text-xl font-bold text-destructive mb-2">Access Denied</h3>
      <p className="text-muted-foreground text-center">
        You do not have the required permissions to view this content.
      </p>
    </div>
  ),
}: RoleGuardProps) {
  const { user, isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return <Loader label="Verifying access..." />;
  }

  if (!isAuthenticated || !user) {
    return fallback;
  }

  // ADMIN always bypasses role checks
  if (user.role === "ADMIN") {
    return <>{children}</>;
  }

  if (!allowedRoles.includes(user.role)) {
    return fallback;
  }

  return <>{children}</>;
}
