import { cn } from "@/lib/utils";

const VARIANTS = {
  primary:
    "bg-[#1f1f1f] text-[#f5f5f5] border border-[#2e2e2e] hover:bg-[#262626]",
  subtle:
    "bg-transparent text-[#f5f5f5] border border-[#2e2e2e] hover:bg-[#1a1a1a]",
  ghost: "bg-transparent text-[#b0b0b0] border-none hover:text-[#f5f5f5]",
  danger:
    "bg-[#2a0f0f] text-[#f5f5f5] border border-[#3d1c1c] hover:bg-[#3d1414]",
};

export function Button({
  className = "",
  variant = "primary",
  type = "button",
  ...props
}) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors duration-150 focus-ring disabled:cursor-not-allowed disabled:opacity-60",
        VARIANTS[variant] || VARIANTS.primary,
        className
      )}
      {...props}
    />
  );
}
