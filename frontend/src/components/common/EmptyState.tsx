"use client";

import React from "react";
import { FolderOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionText?: string;
  onActionClick?: () => void;
}

export default function EmptyState({
  icon = <FolderOpen className="h-12 w-12 text-muted-foreground/60" />,
  title,
  description,
  actionText,
  onActionClick,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-12 bg-card rounded-2xl border border-dashed text-center max-w-md mx-auto space-y-4">
      <div className="p-3 bg-muted/40 rounded-full">{icon}</div>
      <div className="space-y-1">
        <h3 className="text-base font-bold tracking-tight text-foreground">{title}</h3>
        <p className="text-xs text-muted-foreground leading-normal max-w-[280px]">
          {description}
        </p>
      </div>
      {actionText && onActionClick && (
        <Button onClick={onActionClick} size="sm" className="mt-2 text-xs font-semibold">
          {actionText}
        </Button>
      )}
    </div>
  );
}
