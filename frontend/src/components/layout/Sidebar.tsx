"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Truck,
  CalendarCheck,
  Heart,
  Settings,
  User,
  Shield,
  MessageSquare,
} from "lucide-react";

interface SidebarProps {
  className?: string;
}

export default function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();
  const { user } = useAuth();

  const getLinks = () => {
    if (!user) return [];

    const commonLinks = [
      { href: "/profile", label: "Profile", icon: User },
      { href: "/settings", label: "Settings", icon: Settings },
    ];

    if (user.role === "ADMIN") {
      return [
        { href: "/dashboard/admin", label: "Overview", icon: LayoutDashboard },
        { href: "/marketplace", label: "Equipment Moderation", icon: Truck },
        ...commonLinks,
      ];
    }

    if (user.role === "OWNER") {
      return [
        { href: "/dashboard/owner", label: "Overview", icon: LayoutDashboard },
        { href: "/dashboard/owner/equipment", label: "My Listings", icon: Truck },
        { href: "/dashboard/owner/bookings", label: "Rental Orders", icon: CalendarCheck },
        ...commonLinks,
      ];
    }

    // Customer
    return [
      { href: "/dashboard/customer", label: "Overview", icon: LayoutDashboard },
      { href: "/bookings", label: "My Bookings", icon: CalendarCheck },
      { href: "/wishlist", label: "Wishlist", icon: Heart },
      ...commonLinks,
    ];
  };

  const links = getLinks();

  return (
    <aside className={cn("w-64 border-r bg-card text-card-foreground h-full flex flex-col p-4 space-y-4", className)}>
      <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
        Navigation
      </div>
      <nav className="flex-1 space-y-1">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;

          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              {link.label}
            </Link>
          );
        })}
      </nav>
      {user && (
        <div className="border-t pt-4 text-xs text-muted-foreground text-center">
          Logged in as <span className="font-semibold">{user.firstName} {user.lastName}</span>
        </div>
      )}
    </aside>
  );
}
