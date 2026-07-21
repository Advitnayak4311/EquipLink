"use client";

import Link from "next/link";
import { AlertOctagon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function ServerErrorPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-6">
        <div className="p-4 bg-amber-500/10 rounded-full text-amber-600 animate-pulse">
          <AlertOctagon className="h-16 w-16" />
        </div>
        <div className="space-y-2">
          <h1 className="text-4xl font-extrabold tracking-tight">500 – Server Error</h1>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto leading-relaxed">
            The database or API gateway returned an internal transaction failure. Please retry shortly.
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
