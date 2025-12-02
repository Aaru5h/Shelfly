"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Compass, Layers } from "lucide-react";
import NavBar from "@/components/NavBar";
import CategoryForm from "@/components/CategoryForm";
import CategoryTable from "@/components/CategoryTable";
import { authorizedFetch } from "@/lib/http";

const filterOptions = [
  { id: "all", label: "All categories", helper: "Everything in one pass" },
  { id: "minimal", label: "Needs products", helper: "0-1 items mapped" },
  { id: "active", label: "High traction", helper: "3+ items shipping" },
];

const CategoriesPage = () => {
  const router = useRouter();
  const formRef = useRef(null);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const ensureAuth = () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) {
      router.replace("/login");
      return false;
    }
    return true;
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const [categoryPayload, productPayload] = await Promise.all([
        authorizedFetch("/categories"),
        authorizedFetch("/products"),
      ]);
      setCategories(categoryPayload);
      setProducts(productPayload);
    } catch (err) {
      setError(err.message || "Failed to load categories");
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

  const handleCreateCategory = async (payload) => {
    setFormLoading(true);
    setError("");
    try {
      await authorizedFetch("/categories", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      await loadData();
    } catch (err) {
      setError(err.message || "Unable to add category");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    setDeletingId(categoryId);
    setError("");
    try {
      await authorizedFetch(`/categories/${categoryId}`, {
        method: "DELETE",
      });
      await loadData();
    } catch (err) {
      setError(err.message || "Unable to delete category");
    } finally {
      setDeletingId(null);
    }
  };

  const productCounts = useMemo(() => {
    return products.reduce((acc, product) => {
      acc[product.categoryId] = (acc[product.categoryId] || 0) + 1;
      return acc;
    }, {});
  }, [products]);

  const totalCategories = categories.length;
  const totalProducts = products.length;
  const avgProducts = totalCategories ? totalProducts / totalCategories : 0;
  const idleCategories = categories.filter((category) => (productCounts[category.id] || 0) === 0).length;

  const topCategory = useMemo(() => {
    if (!categories.length) return null;
    return categories.reduce((top, category) => {
      const current = productCounts[category.id] || 0;
      if (!top) return { ...category, total: current };
      return current > top.total ? { ...category, total: current } : top;
    }, null);
  }, [categories, productCounts]);

  const filteredCategories = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    return categories
      .filter((category) =>
        normalizedSearch ? category.name.toLowerCase().includes(normalizedSearch) : true
      )
      .filter((category) => {
        const count = productCounts[category.id] || 0;
        if (filter === "minimal") return count <= 1;
        if (filter === "active") return count >= 3;
        return true;
      });
  }, [categories, productCounts, search, filter]);

  return (
    <div className="categories-page">
      <NavBar />
      <main className="categories-main">
        <section className="hero">
          <div>
            <p className="hero-kicker">Categories</p>
            <h1>Blueprint your product taxonomy</h1>
            <p>
              Craft clean labels, surface INR-ready insights, and keep the Shelfly catalogue
              hyper-organised for the sales team.
            </p>
          </div>
          <button
            type="button"
            className="hero-button"
            onClick={() => {
              formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
            }}
          >
            <Plus size={18} strokeWidth={1.6} />
            <span>Add category</span>
          </button>
        </section>

        <section className="stats-grid">
          <article>
            <h3>Total categories</h3>
            <p>{totalCategories}</p>
            <span>{idleCategories} idle lanes</span>
          </article>
          <article>
            <h3>Products mapped</h3>
            <p>{totalProducts}</p>
            <span>{avgProducts ? `${avgProducts.toFixed(1)} avg per category` : "No data yet"}</span>
          </article>
          <article>
            <h3>Top performer</h3>
            {topCategory ? <p>{topCategory.name}</p> : <p>—</p>}
            <span>
              {topCategory ? `${topCategory.total} mapped products` : "Add categories to see leaders"}
            </span>
          </article>
        </section>

        <section className="filters-row">
          <div className="search-field">
            <Compass size={16} strokeWidth={1.5} />
            <input
              type="search"
              placeholder="Search categories"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
          <div className="filter-chips">
            {filterOptions.map((option) => (
              <button
                key={option.id}
                type="button"
                className={filter === option.id ? "chip active" : "chip"}
                onClick={() => setFilter(option.id)}
              >
                <span>{option.label}</span>
                <small>{option.helper}</small>
              </button>
            ))}
          </div>
        </section>

        {error && (
          <div className="error-banner">
            <strong>Heads up:</strong> {error}
          </div>
        )}

        <section className="manager-grid">
          <div ref={formRef} className="forms-column">
            <CategoryForm onSubmit={handleCreateCategory} loading={formLoading} />

            <article className="insight-card">
              <Layers size={42} strokeWidth={1.2} />
              <div>
                <h4>Segment smarter</h4>
                <p>Use categories to trigger automated pricing and INR analytics in upcoming releases.</p>
              </div>
            </article>
          </div>

          <div className="table-column">
            {loading ? (
              <div className="loading-panel">
                <div className="pulse" aria-hidden="true" />
                <h4>Syncing taxonomy…</h4>
                <p>Pulling categories and linked products from Shelfly APIs.</p>
              </div>
            ) : (
              <CategoryTable
                categories={filteredCategories}
                productCounts={productCounts}
                onDelete={handleDeleteCategory}
                deletingId={deletingId}
              />
            )}
          </div>
        </section>
      </main>

      <style jsx>{`
        .categories-page {
          min-height: 100vh;
          background: radial-gradient(circle at top, rgba(62, 75, 140, 0.28), transparent 55%),
            radial-gradient(circle at 75% 20%, rgba(126, 86, 255, 0.25), transparent 45%),
            #05060f;
          color: #f4f6ff;
          display: flex;
          flex-direction: column;
        }

        .categories-main {
          flex: 1;
          padding: 2.6rem clamp(1.5rem, 6vw, 4rem) 3.2rem;
          display: flex;
          flex-direction: column;
          gap: 2.25rem;
        }

        .hero {
          display: flex;
          justify-content: space-between;
          gap: 2rem;
          padding: clamp(1.8rem, 4vw, 2.6rem);
          border-radius: 34px;
          border: 1px solid rgba(92, 108, 188, 0.32);
          background: linear-gradient(135deg, rgba(20, 25, 48, 0.9), rgba(14, 10, 32, 0.9));
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.05), 0 32px 68px rgba(3, 5, 16, 0.6);
        }

        .hero-kicker {
          font-size: 0.72rem;
          letter-spacing: 0.32em;
          text-transform: uppercase;
          color: #8a95c8;
          margin-bottom: 0.8rem;
        }

        .hero h1 {
          margin: 0 0 1rem;
          font-size: clamp(2.15rem, 5vw, 2.7rem);
          font-weight: 600;
        }

        .hero p {
          margin: 0;
          color: #c8d0ef;
          line-height: 1.6;
          max-width: 540px;
        }

        .hero-button {
          display: inline-flex;
          align-items: center;
          gap: 0.8rem;
          height: 56px;
          padding: 0 1.8rem;
          border-radius: 18px;
          border: none;
          background: linear-gradient(140deg, #7466ff, #4f47f0);
          color: #ffffff;
          font-weight: 600;
          font-size: 0.98rem;
          cursor: pointer;
          box-shadow: 0 26px 46px rgba(80, 67, 220, 0.45);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .hero-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 32px 56px rgba(80, 67, 220, 0.55);
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 1.3rem;
        }

        .stats-grid article {
          border-radius: 26px;
          padding: 1.7rem;
          background: rgba(13, 19, 38, 0.85);
          border: 1px solid rgba(74, 90, 158, 0.3);
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.04);
          display: flex;
          flex-direction: column;
          gap: 0.55rem;
        }

        .stats-grid h3 {
          margin: 0;
          font-size: 0.82rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #99a6d9;
        }

        .stats-grid p {
          margin: 0;
          font-size: clamp(1.4rem, 4vw, 1.8rem);
          font-weight: 600;
          color: #f1f4ff;
        }

        .stats-grid span {
          font-size: 0.85rem;
          color: #a6b0da;
        }

        .filters-row {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
          align-items: center;
          justify-content: space-between;
        }

        .search-field {
          flex: 1;
          min-width: 240px;
          display: flex;
          align-items: center;
          gap: 0.8rem;
          padding: 0.65rem 1.1rem;
          border-radius: 18px;
          border: 1px solid rgba(76, 89, 156, 0.45);
          background: rgba(9, 13, 26, 0.9);
        }

        .search-field input {
          flex: 1;
          background: transparent;
          border: none;
          color: #f4f6ff;
          font-size: 0.95rem;
        }

        .search-field input:focus {
          outline: none;
        }

        .filter-chips {
          display: flex;
          gap: 0.8rem;
          flex-wrap: wrap;
          justify-content: flex-end;
        }

        .chip {
          display: flex;
          flex-direction: column;
          padding: 0.65rem 1.1rem;
          border-radius: 16px;
          border: 1px solid rgba(65, 78, 140, 0.35);
          background: rgba(12, 16, 32, 0.6);
          color: #c7ceef;
          font-size: 0.85rem;
          font-weight: 600;
          letter-spacing: 0.03em;
          cursor: pointer;
          min-width: 150px;
          transition: border 0.2s ease, background 0.2s ease;
        }

        .chip small {
          font-size: 0.7rem;
          font-weight: 500;
          color: #8f9acc;
        }

        .chip.active {
          border-color: rgba(115, 106, 255, 0.8);
          background: rgba(44, 41, 94, 0.85);
          color: #f0f2ff;
        }

        .error-banner {
          border-radius: 20px;
          border: 1px solid rgba(191, 72, 96, 0.45);
          background: linear-gradient(135deg, rgba(70, 19, 28, 0.9), rgba(36, 10, 18, 0.9));
          padding: 1rem 1.4rem;
          color: #f9c6cd;
          font-size: 0.92rem;
        }

        .manager-grid {
          display: grid;
          grid-template-columns: minmax(0, 360px) minmax(0, 1fr);
          gap: 1.8rem;
          align-items: start;
        }

        .forms-column {
          display: flex;
          flex-direction: column;
          gap: 1.6rem;
        }

        .insight-card {
          border-radius: 24px;
          border: 1px solid rgba(86, 100, 173, 0.35);
          background: rgba(13, 17, 35, 0.9);
          padding: 1.6rem;
          display: flex;
          gap: 1rem;
          align-items: center;
          color: #d2d8fb;
        }

        .insight-card h4 {
          margin: 0 0 0.3rem;
          font-size: 1rem;
        }

        .insight-card p {
          margin: 0;
          color: #9da6d6;
          font-size: 0.88rem;
          line-height: 1.5;
        }

        .table-column {
          min-height: 420px;
        }

        .loading-panel {
          border-radius: 30px;
          border: 1px solid rgba(70, 88, 165, 0.32);
          background: rgba(10, 12, 26, 0.86);
          padding: 3rem 1.5rem;
          text-align: center;
          position: relative;
          overflow: hidden;
        }

        .pulse {
          position: absolute;
          inset: 0;
          background: linear-gradient(120deg, rgba(88, 98, 175, 0.28), rgba(46, 50, 92, 0.18));
          animation: pulse 2s infinite;
        }

        .loading-panel h4,
        .loading-panel p {
          position: relative;
          margin: 0;
        }

        .loading-panel h4 {
          font-size: 1.1rem;
          font-weight: 600;
          color: #e1e5ff;
          margin-bottom: 0.4rem;
        }

        .loading-panel p {
          color: #a0a9d6;
          font-size: 0.9rem;
        }

        @keyframes pulse {
          0% {
            transform: translateX(-100%);
          }
          50% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        @media (max-width: 1080px) {
          .manager-grid {
            grid-template-columns: 1fr;
          }

          .forms-column {
            order: 2;
          }

          .table-column {
            order: 1;
          }
        }

        @media (max-width: 768px) {
          .categories-main {
            padding: 2rem 1.4rem 2.6rem;
          }

          .hero {
            flex-direction: column;
          }

          .hero-button {
            width: 100%;
            justify-content: center;
          }

          .filter-chips {
            justify-content: flex-start;
          }
        }
      `}</style>
    </div>
  );
};

export default CategoriesPage;
