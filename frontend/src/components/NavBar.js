"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

const navLinks = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Products", href: "/products" },
  { label: "Categories", href: "/categories" },
];

export default function NavBar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  const isActive = (href) => pathname?.startsWith(href);

  return (
    <aside className="w-full border-b border-[#1f1f1f] bg-[#0d0d0d]/80 backdrop-blur md:w-64 md:border-r md:border-b-0">
      <div className="flex items-center justify-between px-6 py-4 md:py-6">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-[#6f6f6f]">
            Shelfly
          </p>
          <p className="text-lg font-semibold text-[#f5f5f5]">Inventory</p>
        </div>
        <Button
          variant="ghost"
          className="text-xs font-semibold uppercase text-[#b0b0b0]"
          onClick={handleLogout}
        >
          Logout
        </Button>
      </div>

      <nav className="px-2 pb-4 md:px-4">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`flex items-center justify-between rounded-md px-4 py-3 text-sm font-medium transition ${
              isActive(link.href)
                ? "bg-[#1a1a1a] text-[#f5f5f5] border border-[#3b82f6]"
                : "text-[#b0b0b0] hover:bg-[#141414] hover:text-[#f5f5f5]"
            }`}
          >
            <span>{link.label}</span>
            {isActive(link.href) && (
              <div className="h-2 w-2 rounded-full bg-[#3b82f6]" />
            )}
          </Link>
        ))}
      </nav>
    </aside>
  );
}

