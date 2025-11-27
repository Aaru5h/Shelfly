import { cn } from "@/lib/utils";

function Card({ className = "", ...props }) {
  return (
    <section
      className={cn(
        "card-surface flex flex-col rounded-[10px] border border-[#262626] p-6 shadow-[0_15px_45px_rgba(0,0,0,0.45)]",
        className
      )}
      {...props}
    />
  );
}

function CardHeader({ className = "", ...props }) {
  return (
    <header
      className={cn(
        "mb-4 flex flex-col gap-1 border-b border-[#1f1f1f] pb-4",
        className
      )}
      {...props}
    />
  );
}

function CardTitle({ className = "", children }) {
  return (
    <h3
      className={cn("text-lg font-semibold text-[#f5f5f5]", className)}
    >
      {children}
    </h3>
  );
}

function CardDescription({ className = "", children }) {
  return (
    <p className={cn("text-sm text-[#b0b0b0]", className)}>{children}</p>
  );
}

function CardContent({ className = "", ...props }) {
  return (
    <div className={cn("flex-1 space-y-4", className)} {...props} />
  );
}

function CardFooter({ className = "", ...props }) {
  return (
    <footer
      className={cn("mt-4 flex items-center justify-end gap-2", className)}
      {...props}
    />
  );
}

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };
