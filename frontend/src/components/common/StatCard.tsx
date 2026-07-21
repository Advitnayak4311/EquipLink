"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: string;
  trendDirection?: "up" | "down" | "none";
}

export default function StatCard({
  title,
  value,
  icon,
  trend,
  trendDirection = "none",
}: StatCardProps) {
  return (
    <Card className="border bg-card shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 relative overflow-hidden group">
      {/* Glow highlight */}
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
          {title}
        </CardTitle>
        {icon && <div className="text-muted-foreground/60 shrink-0">{icon}</div>}
      </CardHeader>
      
      <CardContent className="space-y-1">
        <div className="text-2xl font-extrabold tracking-tight text-foreground">
          {value}
        </div>
        {trend && (
          <p className={`text-[10px] font-semibold flex items-center ${
            trendDirection === "up"
              ? "text-emerald-600 dark:text-emerald-400"
              : trendDirection === "down"
              ? "text-rose-600 dark:text-rose-400"
              : "text-muted-foreground"
          }`}>
            {trend}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
