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
          background: rgba(10, 13, 24, 0.92);
          border-bottom: 1px solid rgba(70, 80, 123, 0.3);
          backdrop-filter: blur(18px);
          box-shadow: 0 18px 40px rgba(5, 8, 18, 0.55);
        }

        .nav-inner {
          max-width: 1200px;
          margin: 0 auto;
          padding: 1.2rem clamp(1.25rem, 4vw, 2.5rem);
          display: flex;
          align-items: center;
          gap: 2rem;
        }

        .brand {
          display: inline-flex;
          align-items: center;
          gap: 0.9rem;
          text-decoration: none;
          color: inherit;
          white-space: nowrap;
        }

        .brand-icon {
          height: 42px;
          width: 42px;
          border-radius: 14px;
          background: linear-gradient(135deg, rgba(123, 116, 255, 0.24), rgba(96, 87, 255, 0.55));
          display: inline-flex;
          align-items: center;
          justify-content: center;
          color: #e6e4ff;
          box-shadow: 0 16px 32px rgba(100, 92, 255, 0.35);
        }

        .brand-text {
          display: flex;
          flex-direction: column;
          gap: 0.18rem;
        }

        .brand-name {
          font-size: 1.1rem;
          font-weight: 600;
          letter-spacing: 0.02em;
          color: #ffffff;
        }

        .brand-tag {
          font-size: 0.68rem;
          text-transform: uppercase;
          letter-spacing: 0.24em;
          color: #7a85ab;
        }

        .nav-menu {
          display: flex;
          align-items: center;
          gap: 0.6rem;
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
          gap: 0.55rem;
          padding: 0.65rem 1.05rem;
          border-radius: 999px;
          font-size: 0.9rem;
          color: #8f9ac0;
          border: 1px solid rgba(87, 102, 160, 0.2);
          background: rgba(20, 24, 39, 0.6);
          transition: all 0.2s ease;
          white-space: nowrap;
        }

        .nav-item:hover {
          color: #ffffff;
          border-color: rgba(123, 116, 255, 0.45);
          box-shadow: 0 12px 25px rgba(93, 106, 214, 0.22);
        }

        .nav-item.active {
          color: #ffffff;
          background: linear-gradient(120deg, rgba(122, 116, 255, 0.35), rgba(105, 98, 255, 0.55));
          border-color: rgba(131, 122, 255, 0.6);
          box-shadow: 0 16px 30px rgba(110, 102, 255, 0.3);
        }

        .nav-actions {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .icon-button {
          height: 38px;
          width: 38px;
          border-radius: 12px;
          border: 1px solid rgba(70, 83, 133, 0.35);
          background: rgba(18, 22, 38, 0.7);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          color: #b6c1e8;
          transition: all 0.2s ease;
        }

        .icon-button:hover {
          border-color: rgba(125, 118, 255, 0.6);
          color: #ffffff;
        }

        .divider {
          width: 1px;
          height: 28px;
          background: linear-gradient(180deg, rgba(90, 104, 168, 0), rgba(90, 104, 168, 0.4), rgba(90, 104, 168, 0));
        }

        .user-chip {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.6rem 0.9rem;
          border-radius: 14px;
          border: 1px solid rgba(70, 83, 133, 0.35);
          background: rgba(18, 22, 38, 0.7);
          color: #d4daf6;
          font-size: 0.8rem;
          font-weight: 600;
        }

        .logout {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          padding: 0.6rem 1rem;
          border-radius: 14px;
          border: none;
          background: rgba(54, 24, 32, 0.55);
          color: #ff9ba1;
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s ease, color 0.2s ease;
        }

        .logout:hover {
          background: rgba(255, 92, 117, 0.2);
          color: #ffe4e7;
        }

        @media (max-width: 920px) {
          .nav-inner {
            flex-wrap: wrap;
            gap: 1.25rem;
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
            padding: 1rem 1.1rem;
          }

          .nav-actions {
            gap: 0.5rem;
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
