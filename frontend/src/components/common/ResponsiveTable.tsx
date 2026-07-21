"use client";

import React from "react";
import Loader from "@/components/common/Loader";

interface Column<T> {
  header: string;
  accessor: (item: T) => React.ReactNode;
  className?: string;
}

interface ResponsiveTableProps<T> {
  columns: Column<T>[];
  data: T[];
  isLoading?: boolean;
  emptyMessage?: string;
}

export default function ResponsiveTable<T>({
  columns,
  data,
  isLoading = false,
  emptyMessage = "No records found.",
}: ResponsiveTableProps<T>) {
  if (isLoading) {
    return (
      <div className="py-12 flex items-center justify-center bg-card border rounded-xl">
        <Loader label="Loading table records..." />
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="py-12 text-center text-xs text-muted-foreground bg-card border rounded-xl">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto border rounded-xl bg-card shadow-sm">
      <table className="w-full text-xs text-left border-collapse">
        <thead>
          <tr className="border-b bg-muted/40 text-muted-foreground font-semibold">
            {columns.map((col, idx) => (
              <th key={idx} className={`p-3.5 ${col.className || ""}`}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, rowIdx) => (
            <tr key={rowIdx} className="border-b hover:bg-muted/10 transition-colors">
              {columns.map((col, colIdx) => (
                <td key={colIdx} className={`p-3.5 align-middle ${col.className || ""}`}>
                  {col.accessor(item)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
