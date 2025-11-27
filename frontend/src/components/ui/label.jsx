"use client";

import { cn } from "@/lib/utils";

function Label({ className = "", children, ...props }) {
  return (
    <label
      className={cn(
        "mb-1 block text-xs font-semibold uppercase tracking-wide text-[#b0b0b0]",
        className
      )}
      {...props}
    >
      {children}
    </label>
  );
}

export { Label };
