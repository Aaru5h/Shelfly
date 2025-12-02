"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Tags,
  LogOut,
  Box,
  Search,
  Bell,
  UserRound,
} from "lucide-react";

const navLinks = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "Products", href: "/products", icon: Package },
  { label: "Categories", href: "/categories", icon: Tags },
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
    <header className="nav-shell">
      <div className="nav-inner">
        <Link href="/dashboard" className="brand" aria-label="Shelfly home">
          <span className="brand-icon">
            <Box size={20} />
          </span>
          <span className="brand-text">
            <span className="brand-name">Shelfly</span>
            <span className="brand-tag">Inventory cockpit</span>
          </span>
        </Link>

        <nav className="nav-menu" aria-label="Primary">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`nav-item ${active ? "active" : ""}`}
              >
                <Icon size={16} />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="nav-actions">
          <button type="button" className="icon-button" aria-label="Search inventory">
            <Search size={16} />
          </button>
          <button type="button" className="icon-button" aria-label="Notifications">
            <Bell size={16} />
          </button>
          <div className="divider" />
          <div className="user-chip">
            <UserRound size={16} />
            <span>Operator</span>
          </div>
          <button type="button" className="logout" onClick={handleLogout}>
            <LogOut size={16} />
            <span>Sign out</span>
          </button>
        </div>
      </div>

      <style jsx>{`
        .nav-shell {
          position: sticky;
          top: 0;
          width: 100%;
          z-index: 80;
          background: #0d0d0d;
          border-bottom: 1px solid #1f1f1f;
        }

        .nav-inner {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0.9rem clamp(1.25rem, 4vw, 2.5rem);
          display: flex;
          align-items: center;
          gap: 1.75rem;
        }

        .brand {
          display: inline-flex;
          align-items: center;
          gap: 0.7rem;
          text-decoration: none;
          color: inherit;
          white-space: nowrap;
        }

        .brand-icon {
          height: 34px;
          width: 34px;
          border-radius: 10px;
          background: #1a1a1a;
          border: 1px solid #262626;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          color: #f5f5f5;
        }

        .brand-text {
          display: flex;
          flex-direction: column;
          gap: 0.1rem;
        }

        .brand-name {
          font-size: 0.95rem;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #f5f5f5;
        }

        .brand-tag {
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.18em;
          color: #6b7280;
        }

        .nav-menu {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1.2rem;
          flex: 1;
          overflow-x: auto;
          scrollbar-width: none;
        }

        .nav-menu::-webkit-scrollbar {
          display: none;
        }

        .nav-item {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          padding: 0.5rem 1.1rem;
          border-radius: 999px;
          font-size: 0.85rem;
          color: #9ca3af;
          border: 1px solid #262626;
          background: #111111;
          transition:
            background 0.15s ease,
            color 0.15s ease,
            border-color 0.15s ease,
            box-shadow 0.15s ease;
          white-space: nowrap;
        }

        .nav-item:hover {
          color: #f5f5f5;
          border-color: #f5f5f5;
          box-shadow: 0 0 0 1px rgba(245, 245, 245, 0.2);
          background: #181818;
        }

        .nav-item.active {
          color: #f5f5f5;
          background: #181818;
          border-color: #f5f5f5;
          box-shadow: 0 0 0 1px rgba(245, 245, 245, 0.25);
        }

        .nav-actions {
          display: flex;
          align-items: center;
          gap: 0.6rem;
        }

        .icon-button {
          height: 32px;
          width: 32px;
          border-radius: 999px;
          border: 1px solid #262626;
          background: #111111;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          color: #9ca3af;
          transition: background 0.15s ease, border-color 0.15s ease, color 0.15s ease;
        }

        .icon-button:hover {
          border-color: #3b82f6;
          color: #f5f5f5;
        }

        .divider {
          width: 1px;
          height: 24px;
          background: #262626;
        }

        .user-chip {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.45rem 0.8rem;
          border-radius: 999px;
          border: 1px solid #262626;
          background: #111111;
          color: #e5e7eb;
          font-size: 0.78rem;
          font-weight: 500;
        }

        .logout {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.45rem 0.9rem;
          border-radius: 999px;
          border: 1px solid #3f1d24;
          background: #1b1113;
          color: #fca5a5;
          font-size: 0.8rem;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.15s ease, border-color 0.15s ease, color 0.15s ease;
        }

        .logout:hover {
          background: #3b141b;
          border-color: #f97373;
          color: #fee2e2;
        }

        @media (max-width: 920px) {
          .nav-inner {
            flex-wrap: wrap;
            gap: 0.9rem;
          }

          .nav-menu {
            order: 3;
            width: 100%;
            justify-content: flex-start;
          }

          .nav-actions {
            margin-left: auto;
          }
        }

        @media (max-width: 620px) {
          .nav-inner {
            padding: 0.8rem 1.1rem;
          }

          .nav-actions {
            gap: 0.4rem;
          }

          .logout span {
            display: none;
          }

          .user-chip span {
            display: none;
          }

          .brand-tag {
            display: none;
          }
        }
      `}</style>
    </header>
  );
}
