import { cn } from "@/lib/utils";

function Input({ className = "", type = "text", ...props }) {
  return (
    <input
      type={type}
      className={cn(
        "w-full rounded-md border border-[#2e2e2e] bg-[#111111] px-3 py-2 text-sm text-[#f5f5f5] placeholder:text-[#5f5f5f] transition focus-ring focus:border-[#3b82f6] disabled:cursor-not-allowed disabled:opacity-60",
        className
      )}
      {...props}
    />
  );
}

export { Input };
