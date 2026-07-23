"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import {
  Menu,
  X,
  Truck,
  LayoutDashboard,
  LogOut,
  User,
  Heart,
  CalendarCheck,
  Shield,
  ChevronDown,
} from "lucide-react";
import { toast } from "sonner";

/**
 * Primary navigation bar.
 * - Shows different links based on authentication state and user role.
 * - Responsive: collapses to a hamburger menu on mobile.
 */
export function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const displayName = user ? `${user.firstName} ${user.lastName}` : "";

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out successfully.");
    router.push("/");
  };

  const getDashboardHref = () => {
    if (!user) return "/dashboard";
    if (user.role === "ADMIN") return "/dashboard/admin";
    if (user.role === "OWNER") return "/dashboard/owner";
    return "/dashboard/customer";
  };

  const getRoleBadgeColor = () => {
    if (user?.role === "ADMIN") return "destructive";
    if (user?.role === "OWNER") return "default";
    return "secondary";
  };

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

  const NavLinks = () => {
    if (isAuthenticated && user?.role === "OWNER") {
      return (
        <>
          <Link
            href="/dashboard/owner"
            className="text-sm font-extrabold text-muted-foreground hover:text-amber-500 transition-colors font-heading"
            onClick={() => setMobileOpen(false)}
          >
            Fleet Manager
          </Link>
          <Link
            href="/dashboard/owner/bookings"
            className="text-sm font-extrabold text-muted-foreground hover:text-amber-500 transition-colors font-heading"
            onClick={() => setMobileOpen(false)}
          >
            Rental Requests & Verification
          </Link>
          <Link
            href="/dashboard/owner/equipment/new"
            className="text-sm font-extrabold text-muted-foreground hover:text-amber-500 transition-colors font-heading"
            onClick={() => setMobileOpen(false)}
          >
            + Add Machinery
          </Link>
          <Link
            href="/telematics"
            className="text-sm font-extrabold text-muted-foreground hover:text-amber-500 transition-colors font-heading"
            onClick={() => setMobileOpen(false)}
          >
            Telematics GPS
          </Link>
          <Link
            href="/calculator"
            className="text-sm font-extrabold text-muted-foreground hover:text-amber-500 transition-colors font-heading"
            onClick={() => setMobileOpen(false)}
          >
            AI Estimator
          </Link>
        </>
      );
    }

    if (isAuthenticated && user?.role === "CUSTOMER") {
      return (
        <>
          <Link
            href="/marketplace"
            className="text-sm font-extrabold text-muted-foreground hover:text-emerald-500 transition-colors font-heading"
            onClick={() => setMobileOpen(false)}
          >
            Find Machinery
          </Link>
          <Link
            href="/dashboard/customer/bookings"
            className="text-sm font-extrabold text-muted-foreground hover:text-emerald-500 transition-colors font-heading"
            onClick={() => setMobileOpen(false)}
          >
            My Rental Requests
          </Link>
          <Link
            href="/calculator"
            className="text-sm font-extrabold text-muted-foreground hover:text-emerald-500 transition-colors font-heading"
            onClick={() => setMobileOpen(false)}
          >
            AI Cost Estimator
          </Link>
          <Link
            href="/wishlist"
            className="text-sm font-extrabold text-muted-foreground hover:text-emerald-500 transition-colors font-heading"
            onClick={() => setMobileOpen(false)}
          >
            Saved Wishlist
          </Link>
          <Link
            href="/telematics"
            className="text-sm font-extrabold text-muted-foreground hover:text-emerald-500 transition-colors font-heading"
            onClick={() => setMobileOpen(false)}
          >
            Telematics GPS
          </Link>
        </>
      );
    }

    return (
      <>
        <Link
          href="/marketplace"
          className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
          onClick={() => setMobileOpen(false)}
        >
          Marketplace
        </Link>
        <Link
          href="/equipment"
          className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
          onClick={() => setMobileOpen(false)}
        >
          Fleet Catalog
        </Link>
        <Link
          href="/calculator"
          className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors flex items-center"
          onClick={() => setMobileOpen(false)}
        >
          AI Estimator
        </Link>
        <Link
          href="/telematics"
          className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors flex items-center"
          onClick={() => setMobileOpen(false)}
        >
          Telematics
        </Link>
        <Link
          href="/company"
          className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
          onClick={() => setMobileOpen(false)}
        >
          Company & ESG
        </Link>
      </>
    );
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 font-sans shadow-sm">
      {/* Top Enterprise Ticker Bar */}
      <div className="hidden sm:block bg-slate-950 text-slate-300 text-[11px] py-1.5 border-b border-slate-800">
        <div className="container mx-auto px-4 max-w-7xl flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="bg-amber-500/20 text-amber-400 font-bold px-1.5 py-0.5 rounded text-[10px] uppercase">
              Notice
            </span>
            <span>
              {user?.role === "OWNER"
                ? "🚜 Owner Command Center • Manage Fleet & Verification Requests"
                : user?.role === "CUSTOMER"
                ? "🏗️ Lessee Customer Portal • Track 3-Way Jobsite Mobilization & Inspections"
                : "🚜 Digitized Heavy Machinery Marketplace & T3 Telematics Network"}
            </span>
          </div>
          <div className="flex items-center space-x-4 text-slate-400">
            <Link href="/company" className="hover:text-amber-400 transition-colors font-medium">
              Enterprise Network
            </Link>
            <span>•</span>
            <Link href="/contact" className="hover:text-amber-400 transition-colors font-medium">
              Corporate Support: +91 1800-345-8899
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 font-black text-xl tracking-tight font-heading">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20">
            <Truck className="w-5 h-5" />
          </div>
          <span className="font-extrabold text-foreground">
            Equip<span className="text-amber-500">Link</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          <NavLinks />
        </nav>

        {/* Desktop Auth */}
        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated && user ? (
            <div className="flex items-center space-x-3">
              {user.role === "OWNER" && (
                <Button size="sm" asChild className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs">
                  <Link href="/dashboard/owner/equipment/new">+ List New Machine</Link>
                </Button>
              )}
              {user.role === "CUSTOMER" && (
                <Button size="sm" asChild className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs">
                  <Link href="/marketplace">Browse Marketplace</Link>
                </Button>
              )}

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2 h-9 px-2">
                    <Avatar className="h-7 w-7">
                      <AvatarImage src={undefined} alt={displayName} />
                      <AvatarFallback className="text-xs bg-amber-500 text-slate-950 font-bold">
                        {getInitials(displayName)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium max-w-[120px] truncate">
                      {displayName}
                    </span>
                    <Badge variant={getRoleBadgeColor()} className="text-xs px-1.5 py-0 font-bold">
                      {user.role}
                    </Badge>
                    <ChevronDown className="w-3 h-3 text-muted-foreground" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">{displayName}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />

                  <DropdownMenuItem asChild>
                    <Link href={getDashboardHref()} className="cursor-pointer font-bold">
                      {user.role === "ADMIN" ? (
                        <Shield className="mr-2 h-4 w-4" />
                      ) : (
                        <LayoutDashboard className="mr-2 h-4 w-4 text-amber-500" />
                      )}
                      {user.role === "OWNER" ? "Fleet Command Center" : "Customer Portal"}
                    </Link>
                  </DropdownMenuItem>

                  {user.role === "CUSTOMER" && (
                    <>
                      <DropdownMenuItem asChild>
                        <Link href="/dashboard/customer/bookings" className="cursor-pointer">
                          <CalendarCheck className="mr-2 h-4 w-4" />
                          My Rental Requests
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/wishlist" className="cursor-pointer">
                          <Heart className="mr-2 h-4 w-4 text-rose-500" />
                          Wishlist
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}

                  {user.role === "OWNER" && (
                    <>
                      <DropdownMenuItem asChild>
                        <Link href="/dashboard/owner/bookings" className="cursor-pointer">
                          <CalendarCheck className="mr-2 h-4 w-4" />
                          Incoming Requests
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/dashboard/owner/equipment/new" className="cursor-pointer">
                          <Truck className="mr-2 h-4 w-4 text-amber-500" />
                          List New Equipment
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}

                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-destructive focus:text-destructive cursor-pointer"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/login">Sign In</Link>
              </Button>
              <Button size="sm" asChild className="bg-amber-500 text-slate-950 font-bold hover:bg-amber-400">
                <Link href="/register">Get Started</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-72">
            <div className="flex flex-col gap-6 mt-6">
              {/* Mobile user info */}
              {isAuthenticated && user && (
                <div className="flex items-center gap-3 pb-4 border-b">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={undefined} />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {getInitials(displayName)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-sm">{displayName}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                </div>
              )}

              {/* Mobile nav links */}
              <nav className="flex flex-col gap-3">
                <NavLinks />
                {isAuthenticated && (
                  <>
                    <Link
                      href={getDashboardHref()}
                      className="text-sm font-medium hover:text-primary transition-colors"
                      onClick={() => setMobileOpen(false)}
                    >
                      Dashboard
                    </Link>
                    {user?.role === "CUSTOMER" && (
                      <>
                        <Link
                          href="/bookings"
                          className="text-sm font-medium hover:text-primary transition-colors"
                          onClick={() => setMobileOpen(false)}
                        >
                          My Bookings
                        </Link>
                        <Link
                          href="/wishlist"
                          className="text-sm font-medium hover:text-primary transition-colors"
                          onClick={() => setMobileOpen(false)}
                        >
                          Wishlist
                        </Link>
                      </>
                    )}
                  </>
                )}
              </nav>

              {/* Mobile auth buttons */}
              <div className="flex flex-col gap-2 mt-auto pt-4 border-t">
                {isAuthenticated ? (
                  <Button
                    variant="destructive"
                    onClick={handleLogout}
                    className="w-full"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </Button>
                ) : (
                  <>
                    <Button variant="outline" asChild className="w-full">
                      <Link href="/login" onClick={() => setMobileOpen(false)}>
                        Sign In
                      </Link>
                    </Button>
                    <Button asChild className="w-full">
                      <Link href="/register" onClick={() => setMobileOpen(false)}>
                        Get Started
                      </Link>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
