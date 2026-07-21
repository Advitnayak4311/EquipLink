"use client";

import Link from "next/link";
import { ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function ForbiddenPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-6">
        <div className="p-4 bg-rose-500/10 rounded-full text-rose-600 animate-pulse">
          <ShieldAlert className="h-16 w-16" />
        </div>
        <div className="space-y-2">
          <h1 className="text-4xl font-extrabold tracking-tight">403 – Access Denied</h1>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto leading-relaxed">
            You do not have administrative authorization permissions to access this dashboard portal.
          </p>
        </div>
        <Button asChild size="sm">
          <Link href="/">Back to Home</Link>
        </Button>
      </main>
      <Footer />
    </div>
  );
}
