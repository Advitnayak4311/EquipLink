"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbProps {
  customLabels?: Record<string, string>;
}

export default function Breadcrumb({ customLabels = {} }: BreadcrumbProps) {
  const pathname = usePathname();
  if (pathname === "/") return null;

  const pathnames = pathname.split("/").filter((x) => x);

  return (
    <nav className="flex items-center space-x-1.5 text-sm text-muted-foreground py-4">
      <Link href="/" className="flex items-center hover:text-foreground transition-colors">
        <Home className="h-4 w-4" />
        <span className="sr-only">Home</span>
      </Link>

      {pathnames.map((value, index) => {
        const last = index === pathnames.length - 1;
        const to = `/${pathnames.slice(0, index + 1).join("/")}`;
        
        // Capitalize default label or use custom mapped label
        const rawLabel = customLabels[value] || value;
        const label = rawLabel.charAt(0).toUpperCase() + rawLabel.slice(1).replace(/-/g, " ");

        return (
          <div key={to} className="flex items-center space-x-1.5">
            <ChevronRight className="h-4 w-4 text-muted-foreground/60" />
            {last ? (
              <span className="font-medium text-foreground">{label}</span>
            ) : (
              <Link href={to} className="hover:text-foreground transition-colors">
                {label}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
}
