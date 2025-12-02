"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import NavBar from "@/components/NavBar";
import { authorizedFetch } from "@/lib/http";
import {
  Package,
  Tags,
  IndianRupee,
  AlertTriangle,
  ArrowRight,
  Plus,
  RefreshCcw,
  TrendingUp,
  Layers,
} from "lucide-react";

const DashboardPage = () => {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const ensureAuth = () => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) {
      router.replace("/login");
      return false;
    }
    return true;
  };

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const [categoryPayload, productPayload] = await Promise.all([
        authorizedFetch("/categories"),
        authorizedFetch("/products"),
      ]);
      setCategories(categoryPayload);
      setProducts(productPayload);
    } catch (err) {
      setError(err.message || "Unable to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (ensureAuth()) {
      loadData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const totalInventoryValue = useMemo(() => {
    return products.reduce(
      (acc, product) =>
        acc + Number(product.price || 0) * Number(product.quantity || 0),
      0
    );
  }, [products]);

  const lowStock = useMemo(() => {
    return products
      .filter((product) => Number(product.quantity) <= 5)
      .slice(0, 5);
  }, [products]);

  const soldOutCount = useMemo(() => {
    return products.filter((product) => Number(product.quantity) === 0).length;
  }, [products]);

  const totalUnits = useMemo(() => {
    return products.reduce(
      (acc, product) => acc + Number(product.quantity || 0),
      0
    );
  }, [products]);

  const averagePrice = useMemo(() => {
    if (products.length === 0) return 0;
    const totalPrice = products.reduce(
      (acc, product) => acc + Number(product.price || 0),
      0
    );
    return totalPrice / products.length;
  }, [products]);

  const latestProducts = useMemo(() => {
    return [...products]
      .sort(
        (a, b) =>
          new Date(b.createdAt || 0).getTime() -
          new Date(a.createdAt || 0).getTime()
      )
      .slice(0, 6);
  }, [products]);

  const categoryProductCounts = useMemo(() => {
    return products.reduce((acc, product) => {
      acc[product.categoryId] = (acc[product.categoryId] || 0) + 1;
      return acc;
    }, {});
  }, [products]);

  const statsCards = [
    {
      title: "Total Products",
      value: loading ? "..." : products.length,
      description: "Active SKUs",
      icon: Package,
      accent: "accent-blue",
      trend: "+2.5% vs last month",
    },
    {
      title: "Categories",
      value: loading ? "..." : categories.length,
      description: "Product groups organized",
      icon: Tags,
      accent: "accent-violet",
    },
    {
      title: "Inventory Value",
      value: loading ? "..." : formatCurrency(totalInventoryValue),
      description: "Stock on hand",
      icon: IndianRupee,
      accent: "accent-emerald",
    },
    {
      title: "Low Stock Alerts",
      value: loading ? "..." : lowStock.length,
      description: "Under 5 units",
      icon: AlertTriangle,
      accent: "accent-amber",
      alert: !loading && lowStock.length > 0,
    },
  ];

  return (
    <div className="dashboard-shell">
      <NavBar />
      <main className="dashboard-main">
        <section className="hero">
          <div>
            <p className="hero-kicker">Inventory Pulse</p>
            <h1 className="hero-title">Command Center</h1>
            <p className="hero-text">
              Monitor stock health, track categories, and act on low inventory in one cohesive glance.
            </p>
          </div>
          <div className="hero-actions">
            <button
              type="button"
              className="primary-action"
              onClick={() => router.push("/products")}
            >
              <Plus size={16} />
              <span>Add Product</span>
            </button>
            <button
              type="button"
              className="secondary-action"
              onClick={loadData}
              disabled={loading}
            >
              <RefreshCcw size={16} />
              <span>{loading ? "Refreshing..." : "Refresh"}</span>
            </button>
          </div>
        </section>

        {error && (
          <div className="status-banner error-banner">
            <AlertTriangle size={18} />
            <span>{error}</span>
          </div>
        )}

        <section className="stats-grid">
          {statsCards.map(({ title, value, description, icon: Icon, accent, trend, alert }) => (
            <article
              key={title}
              className={`stats-card ${accent} ${alert ? "stats-card-alert" : ""}`}
            >
              <div className="stats-icon">
                <Icon size={20} />
              </div>
              <div className="stats-value">{value}</div>
              <p className="stats-label">{title}</p>
              <p className="stats-description">{description}</p>
              {trend && (
                <div className="stats-trend">
                  <TrendingUp size={14} />
                  <span>{trend}</span>
                </div>
              )}
            </article>
          ))}
        </section>

        <section className="panels-grid">
          <article className="panel panel-large">
            <header className="panel-header">
              <div>
                <h2>Recent Products</h2>
                <p>Latest additions to your catalog.</p>
              </div>
              <Link href="/products" className="panel-link">
                View all
                <ArrowRight size={16} />
              </Link>
            </header>
            <div className="panel-body">
              {loading ? (
                <div className="skeleton-list">
                  {[1, 2, 3, 4].map((item) => (
                    <div key={item} className="skeleton-row" />
                  ))}
                </div>
              ) : latestProducts.length === 0 ? (
                <div className="empty-state">
                  <Package size={24} />
                  <p>No products yet. Start by creating your first item.</p>
                </div>
              ) : (
                <ul className="product-feed">
                  {latestProducts.map((product) => (
                    <li key={product.id} className="product-row">
                      <div className="product-avatar">
                        <Package size={18} />
                      </div>
                      <div className="product-meta">
                        <p className="product-name">{product.name}</p>
                        <span className="product-date">
                          Added {new Date(product.createdAt || 0).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="product-stats">
                        <span className="price-tag">{formatCurrency(Number(product.price || 0), { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                        <span className="quantity-tag">Qty {product.quantity}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </article>

          <div className="panel-stack">
            <article className="panel">
              <header className="panel-header">
                <div>
                  <h2>Low Stock Alerts</h2>
                  <p>Items below five units.</p>
                </div>
              </header>
              <div className="panel-body">
                {loading ? (
                  <div className="skeleton-row" />
                ) : lowStock.length === 0 ? (
                  <div className="empty-state small">
                    <TrendingUp size={22} />
                    <p>Inventory is in a healthy range.</p>
                  </div>
                ) : (
                  <ul className="alert-list">
                    {lowStock.map((product) => (
                      <li key={product.id} className="alert-row">
                        <div>
                          <p>{product.name}</p>
                          <span>Only {product.quantity} remaining</span>
                        </div>
                        <Link href="/products" className="alert-link">
                          Restock
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </article>

            <article className="panel">
              <header className="panel-header">
                <div>
                  <h2>Categories</h2>
                  <p>Top groupings at a glance.</p>
                </div>
              </header>
              <div className="panel-body">
                {loading ? (
                  <div className="skeleton-row" />
                ) : categories.length === 0 ? (
                  <div className="empty-state small">
                    <Layers size={22} />
                    <p>Create categories to organize your catalog.</p>
                  </div>
                ) : (
                  <ul className="category-list">
                    {categories.slice(0, 6).map((category) => (
                      <li key={category.id}>
                        <span>{category.name}</span>
                        <span className="badge">{categoryProductCounts[category.id] || 0}</span>
                      </li>
                    ))}
                  </ul>
                )}
                {categories.length > 6 && (
                  <Link href="/categories" className="panel-link subtle">
                    View all categories
                  </Link>
                )}
              </div>
            </article>

            <article className="panel">
              <header className="panel-header">
                <div>
                  <h2>Inventory Snapshot</h2>
                  <p>Quick health indicators.</p>
                </div>
              </header>
              <div className="snapshot-grid">
                <div>
                  <span className="snapshot-label">Total Units</span>
                  <span className="snapshot-value">{loading ? "..." : totalUnits}</span>
                </div>
                <div>
                  <span className="snapshot-label">Sold Out</span>
                  <span className="snapshot-value">{loading ? "..." : soldOutCount}</span>
                </div>
                <div>
                  <span className="snapshot-label">Avg. Price</span>
                  <span className="snapshot-value">
                    {loading
                      ? "..."
                      : formatCurrency(averagePrice, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                  </span>
                </div>
                <div>
                  <span className="snapshot-label">Categories</span>
                  <span className="snapshot-value">{loading ? "..." : categories.length}</span>
                </div>
              </div>
            </article>
          </div>
        </section>

        <style jsx>{`
          .dashboard-shell {
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            background: radial-gradient(circle at 20% -10%, #1d2744 0%, #0c1121 45%, #05070f 100%);
            color: #f4f6ff;
            font-family: "Inter", "SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
          }

          .dashboard-main {
            flex: 1;
            padding: 3rem clamp(1.5rem, 4vw, 3.5rem);
            display: flex;
            flex-direction: column;
            gap: 2.5rem;
            overflow-y: auto;
          }

          .hero {
            display: flex;
            flex-direction: column;
            gap: 1.5rem;
            padding: 2.4rem;
            border-radius: 28px;
            background: linear-gradient(135deg, rgba(27, 32, 52, 0.8) 0%, rgba(16, 20, 34, 0.86) 100%);
            border: 1px solid rgba(124, 116, 255, 0.16);
            box-shadow: 0 30px 60px rgba(8, 10, 24, 0.45);
          }

          @media (min-width: 900px) {
            .hero {
              flex-direction: row;
              justify-content: space-between;
              align-items: flex-start;
            }
          }

          .hero-kicker {
            font-size: 0.8rem;
            letter-spacing: 0.3em;
            text-transform: uppercase;
            color: #a0a7c2;
            margin-bottom: 0.55rem;
          }

          .hero-title {
            font-size: clamp(2.2rem, 4vw, 2.9rem);
            font-weight: 600;
            color: #ffffff;
            margin: 0;
          }

          .hero-text {
            max-width: 420px;
            margin-top: 0.8rem;
            font-size: 0.98rem;
            color: #a6aecb;
            line-height: 1.6;
          }

          .hero-actions {
            display: flex;
            gap: 0.85rem;
            flex-wrap: wrap;
          }

          .primary-action,
          .secondary-action {
            display: inline-flex;
            align-items: center;
            gap: 0.55rem;
            border-radius: 14px;
            padding: 0.85rem 1.5rem;
            font-size: 0.95rem;
            font-weight: 600;
            transition: all 0.2s ease;
            border: none;
            cursor: pointer;
          }

          .primary-action {
            background: linear-gradient(120deg, #7e74ff 0%, #6658ff 100%);
            color: #ffffff;
            box-shadow: 0 20px 35px rgba(102, 88, 255, 0.35);
          }

          .primary-action:hover {
            transform: translateY(-1px);
            box-shadow: 0 26px 40px rgba(102, 88, 255, 0.38);
          }

          .secondary-action {
            background: rgba(19, 25, 42, 0.85);
            border: 1px solid rgba(120, 133, 177, 0.22);
            color: #cfd6ff;
          }

          .secondary-action:hover:not(:disabled) {
            border-color: rgba(143, 151, 207, 0.4);
            color: #ffffff;
          }

          .secondary-action:disabled {
            opacity: 0.65;
            cursor: not-allowed;
          }

          .status-banner {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            padding: 1rem 1.25rem;
            border-radius: 16px;
            font-size: 0.9rem;
            border: 1px solid transparent;
          }

          .error-banner {
            background: rgba(255, 102, 120, 0.08);
            border-color: rgba(255, 102, 120, 0.25);
            color: #ffb2c2;
          }

          .stats-grid {
            display: grid;
            gap: 1.5rem;
            grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          }

          .stats-card {
            position: relative;
            padding: 1.75rem;
            border-radius: 22px;
            background: rgba(18, 22, 37, 0.82);
            border: 1px solid rgba(120, 133, 177, 0.18);
            box-shadow: 0 20px 40px rgba(4, 7, 18, 0.35);
            overflow: hidden;
          }

          .stats-card::after {
            content: "";
            position: absolute;
            inset: 0;
            border-radius: inherit;
            background: linear-gradient(135deg, rgba(255, 255, 255, 0.04), transparent 70%);
            pointer-events: none;
          }

          .stats-card-alert {
            border-color: rgba(255, 153, 85, 0.45);
            box-shadow: 0 22px 45px rgba(255, 153, 85, 0.14);
          }

          .stats-icon {
            width: 42px;
            height: 42px;
            border-radius: 14px;
            background: rgba(124, 116, 255, 0.1);
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 1.2rem;
            color: var(--accent-color, #cfd2ff);
          }

          .stats-value {
            font-size: 2rem;
            font-weight: 600;
            color: #ffffff;
          }

          .stats-label {
            font-size: 0.9rem;
            margin-top: 0.4rem;
            color: #a8afc7;
          }

          .stats-description {
            font-size: 0.8rem;
            color: #707997;
            margin-top: 0.35rem;
          }

          .stats-trend {
            display: inline-flex;
            align-items: center;
            gap: 0.4rem;
            margin-top: 0.85rem;
            font-size: 0.78rem;
            color: rgba(141, 214, 138, 0.9);
          }

          .accent-blue {
            --accent-color: #6ea8ff;
          }

          .accent-violet {
            --accent-color: #c4b5ff;
          }

          .accent-emerald {
            --accent-color: #8fe3b6;
          }

          .accent-amber {
            --accent-color: #ffbd82;
          }

          .panels-grid {
            display: grid;
            gap: 1.8rem;
          }

          @media (min-width: 1100px) {
            .panels-grid {
              grid-template-columns: minmax(0, 2fr) minmax(0, 1fr);
            }
          }

          .panel {
            position: relative;
            border-radius: 24px;
            background: rgba(16, 20, 33, 0.9);
            border: 1px solid rgba(114, 124, 171, 0.2);
            box-shadow: 0 24px 50px rgba(5, 7, 16, 0.38);
            overflow: hidden;
          }

          .panel-large {
            min-height: 420px;
          }

          .panel-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            gap: 1rem;
            padding: 2rem 2.1rem 1.6rem;
            border-bottom: 1px solid rgba(114, 124, 171, 0.18);
          }

          .panel-header h2 {
            font-size: 1.2rem;
            font-weight: 600;
            margin: 0;
            color: #ffffff;
          }

          .panel-header p {
            margin-top: 0.35rem;
            font-size: 0.85rem;
            color: #8791b3;
          }

          .panel-link {
            display: inline-flex;
            align-items: center;
            gap: 0.4rem;
            font-size: 0.85rem;
            color: #bcb8ff;
            text-decoration: none;
            transition: color 0.2s ease;
            white-space: nowrap;
          }

          .panel-link:hover {
            color: #ffffff;
          }

          .panel-link.subtle {
            margin: 1.3rem 2.1rem 2.1rem;
            color: #9ca6d1;
          }

          .panel-link.subtle:hover {
            color: #c8ceff;
          }

          .panel-body {
            padding: 1.7rem 2.1rem 2rem;
          }

          .panel-stack {
            display: flex;
            flex-direction: column;
            gap: 1.5rem;
          }

          .skeleton-list {
            display: flex;
            flex-direction: column;
            gap: 1rem;
          }

          .skeleton-row {
            height: 64px;
            border-radius: 18px;
            background: linear-gradient(90deg, rgba(33, 37, 58, 0.6), rgba(48, 54, 86, 0.8), rgba(33, 37, 58, 0.6));
            background-size: 200% 100%;
            animation: pulse 1.6s ease-in-out infinite;
          }

          @keyframes pulse {
            0% {
              background-position: 0% 50%;
            }
            100% {
              background-position: -200% 50%;
            }
          }

          .empty-state {
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
            gap: 0.9rem;
            padding: 3.5rem 1rem;
            color: #8d97bd;
          }

          .empty-state svg {
            color: #4f5c8a;
          }

          .empty-state.small {
            padding: 2.6rem 1rem;
          }

          .product-feed {
            display: flex;
            flex-direction: column;
            gap: 0.6rem;
            list-style: none;
            margin: 0;
            padding: 0;
          }

          .product-row {
            display: grid;
            grid-template-columns: auto 1fr auto;
            gap: 1.2rem;
            align-items: center;
            padding: 0.95rem 1rem;
            border-radius: 18px;
            background: rgba(20, 24, 40, 0.75);
            border: 1px solid transparent;
            transition: border 0.2s ease, transform 0.2s ease;
          }

          .product-row:hover {
            border-color: rgba(125, 118, 255, 0.32);
            transform: translateY(-2px);
          }

          .product-avatar {
            width: 42px;
            height: 42px;
            border-radius: 14px;
            background: rgba(126, 116, 255, 0.12);
            display: flex;
            align-items: center;
            justify-content: center;
            color: #c8c4ff;
          }

          .product-meta {
            display: flex;
            flex-direction: column;
            gap: 0.3rem;
          }

          .product-name {
            font-weight: 600;
            color: #ffffff;
            margin: 0;
          }

          .product-date {
            font-size: 0.78rem;
            color: #7d86a9;
          }

          .product-stats {
            display: flex;
            flex-direction: column;
            align-items: flex-end;
            gap: 0.4rem;
            font-size: 0.85rem;
          }

          .price-tag {
            color: #ffffff;
            font-weight: 600;
          }

          .quantity-tag {
            color: #8a94bc;
          }

          .alert-list,
          .category-list {
            list-style: none;
            margin: 0;
            padding: 0;
            display: flex;
            flex-direction: column;
            gap: 1rem;
          }

          .alert-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 1rem;
            padding: 0.9rem 1rem;
            border-radius: 16px;
            background: rgba(40, 19, 23, 0.28);
            border: 1px solid rgba(255, 112, 112, 0.2);
          }

          .alert-row p {
            margin: 0;
            font-weight: 600;
            color: #ffb3be;
          }

          .alert-row span {
            font-size: 0.78rem;
            color: #ff878f;
          }

          .alert-link {
            font-size: 0.78rem;
            font-weight: 600;
            color: #ffe0e4;
            text-decoration: none;
          }

          .alert-link:hover {
            color: #ffffff;
          }

          .category-list li {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0.85rem 1rem;
            border-radius: 16px;
            background: rgba(24, 27, 46, 0.7);
            color: #d0d6ff;
            font-size: 0.88rem;
          }

          .badge {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            min-width: 32px;
            border-radius: 999px;
            background: rgba(128, 137, 226, 0.3);
            color: #ebeaff;
            font-size: 0.72rem;
            padding: 0.25rem 0.65rem;
          }

          .snapshot-grid {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 1.3rem;
            padding: 1.8rem 2.1rem;
          }

          .snapshot-label {
            font-size: 0.75rem;
            text-transform: uppercase;
            letter-spacing: 0.12em;
            color: #7a84aa;
          }

          .snapshot-value {
            display: block;
            margin-top: 0.5rem;
            font-size: 1.3rem;
            font-weight: 600;
            color: #ffffff;
          }

          @media (max-width: 768px) {
            .dashboard-main {
              padding: 2.4rem 1.25rem 4rem;
            }

            .hero {
              padding: 2rem;
            }

            .panel-header,
            .panel-body {
              padding: 1.6rem;
            }

            .product-row {
              grid-template-columns: 1fr;
              align-items: flex-start;
            }

            .product-stats {
              align-items: flex-start;
              flex-direction: row;
              gap: 1rem;
            }

            .snapshot-grid {
              grid-template-columns: repeat(1, minmax(0, 1fr));
            }
          }
        `}</style>
      </main>
    </div>
  );
};

function formatCurrency(val, { minimumFractionDigits, maximumFractionDigits } = {}) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: minimumFractionDigits ?? 0,
    maximumFractionDigits: maximumFractionDigits ?? (minimumFractionDigits ?? 0),
  }).format(val);
}

export default DashboardPage;
