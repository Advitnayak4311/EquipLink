"use client";

import Link from "next/link";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function NotFoundPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-6">
        <div className="p-4 bg-primary/10 rounded-full text-primary animate-bounce">
          <AlertCircle className="h-16 w-16" />
        </div>
        <div className="space-y-2">
          <h1 className="text-4xl font-extrabold tracking-tight">404 – Page Not Found</h1>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto leading-relaxed">
            The requested machinery portal or link could not be located on the platform.
          </p>
        </div>
        <div className="flex space-x-3">
          <Button asChild size="sm">
            <Link href="/">Back to Home</Link>
          </Button>
          <Button variant="outline" asChild size="sm">
            <Link href="/marketplace">Search Marketplace</Link>
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  );
}
