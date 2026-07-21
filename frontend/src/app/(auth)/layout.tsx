import Link from "next/link";
import { Truck } from "lucide-react";

/**
 * Shared layout for auth pages (login, register).
 * Split-panel design: left = form, right = brand panel.
 */
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen grid md:grid-cols-2">
      {/* Left: Form panel */}
      <div className="flex flex-col justify-center px-6 py-12 md:px-12 lg:px-16">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 font-bold text-xl mb-10"
        >
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary text-primary-foreground">
            <Truck className="w-4 h-4" />
          </div>
          Equip<span className="text-primary">Link</span>
        </Link>

        {children}
      </div>

      {/* Right: Brand panel (hidden on mobile) */}
      <div className="hidden md:flex flex-col justify-between bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-12 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        </div>

        <div className="relative z-10 space-y-6">
          <div className="text-5xl">🏗️</div>
          <blockquote className="space-y-3">
            <p className="text-2xl font-bold leading-snug">
              &quot;Connect with verified equipment owners across India — no
              middlemen, no hidden fees.&quot;
            </p>
          </blockquote>
        </div>

        <div className="relative z-10 space-y-4">
          {[
            "500+ pieces of equipment listed",
            "Verified owners only",
            "Real-time booking tracking",
            "AI-powered listing assistance",
          ].map((point) => (
            <div key={point} className="flex items-center gap-3 text-sm text-white/80">
              <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
              {point}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
