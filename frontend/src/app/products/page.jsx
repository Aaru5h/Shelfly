"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Filter, Plus, Search } from "lucide-react";
import NavBar from "@/components/NavBar";
import ProductForm from "@/components/ProductForm";
import ProductTable from "@/components/ProductTable";
import { authorizedFetch } from "@/lib/http";

const formatCurrency = (value, fractionalDigits = 0) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: fractionalDigits,
    maximumFractionDigits: fractionalDigits,
  }).format(Number(value || 0));

const stockFilters = [
  { id: "all", label: "All stock", helper: "Entire catalog" },
  { id: "low", label: "Low stock", helper: "≤ 5 units" },
  { id: "out", label: "Out of stock", helper: "Zero units" },
  { id: "healthy", label: "Healthy", helper: "> 5 units" },
];

const ProductsPage = () => {
  const router = useRouter();
  const formRef = useRef(null);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [createLoading, setCreateLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [editProduct, setEditProduct] = useState(null);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [stockFilter, setStockFilter] = useState("all");

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
      const [categoriesData, productsData] = await Promise.all([
        authorizedFetch("/categories"),
        authorizedFetch("/products"),
      ]);

      const categoryNameMap = categoriesData.reduce((acc, category) => {
        acc[category.id] = category.name;
        return acc;
      }, {});

      const normalizedProducts = productsData.map((product) => ({
        ...product,
        categoryName: product.categoryName || categoryNameMap[product.categoryId] || "",
      }));

      setCategories(categoriesData);
      setProducts(normalizedProducts);
    } catch (err) {
      setError(err.message || "Failed to load products");
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

  const handleCreateProduct = async (payload) => {
    setCreateLoading(true);
    setError("");
    try {
      await authorizedFetch("/products", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      await loadData();
    } catch (err) {
      setError(err.message || "Unable to create product");
    } finally {
      setCreateLoading(false);
    }
  };

  const handleUpdateProduct = async (payload) => {
    if (!editProduct) return;
    setUpdateLoading(true);
    setError("");
    try {
      await authorizedFetch(`/products/${editProduct.id}`, {
        method: "PUT",
        body: JSON.stringify(payload),
      });
      setEditProduct(null);
      await loadData();
    } catch (err) {
      setError(err.message || "Unable to update product");
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleDeleteProduct = async (productId) => {
    setDeletingId(productId);
    setError("");
    try {
      await authorizedFetch(`/products/${productId}`, {
        method: "DELETE",
      });
      await loadData();
    } catch (err) {
      setError(err.message || "Unable to delete product");
    } finally {
      setDeletingId(null);
    }
  };

  const inventoryValue = useMemo(
    () =>
      products.reduce((total, product) => {
        const unitValue = Number(product.price) || 0;
        const quantity = Number(product.quantity) || 0;
        return total + unitValue * quantity;
      }, 0),
    [products]
  );

  const totalUnits = useMemo(
    () => products.reduce((total, product) => total + (Number(product.quantity) || 0), 0),
    [products]
  );

  const lowStockCount = useMemo(
    () => products.filter((product) => (Number(product.quantity) || 0) <= 5).length,
    [products]
  );

  const filteredProducts = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();
    return products.filter((product) => {
      const qty = Number(product.quantity) || 0;
      const matchesSearch = normalizedSearch
        ? [product.name, product.categoryName, product.sku]
            .filter(Boolean)
            .some((value) => value.toLowerCase().includes(normalizedSearch))
        : true;

      const matchesCategory =
        categoryFilter === "all"
          ? true
          : String(product.categoryId || "uncategorised") === categoryFilter;

      const matchesStock = (() => {
        if (stockFilter === "low") return qty > 0 && qty <= 5;
        if (stockFilter === "out") return qty === 0;
        if (stockFilter === "healthy") return qty > 5;
        return true;
      })();

      return matchesSearch && matchesCategory && matchesStock;
    });
  }, [products, searchTerm, categoryFilter, stockFilter]);

  const categoryOptions = useMemo(() => {
    const base = [
      { id: "all", name: "All categories" },
      ...categories.map((category) => ({
        id: String(category.id),
        name: category.name,
      })),
    ];

    if (products.some((product) => !product.categoryId)) {
      base.push({ id: "uncategorised", name: "Uncategorised" });
    }

    return base;
  }, [categories, products]);

  return (
    <div className="products-page">
      <NavBar />
      <main className="products-main">
        <section className="hero">
          <div>
            <p className="hero-kicker">Products</p>
            <h1>Inventory command centre</h1>
            <p>
              Shape your catalogue, monitor INR revenue potential, and keep stock levels
              on point without leaving this screen.
            </p>
          </div>
          <button
            type="button"
            className="hero-button"
            onClick={() => {
              setEditProduct(null);
              formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
            }}
          >
            <Plus size={18} strokeWidth={1.5} />
            <span>Add product</span>
          </button>
        </section>

        <section className="stats">
          <article>
            <h3>Total catalog value</h3>
            <p>{formatCurrency(inventoryValue)}</p>
            <span>Based on unit price × quantity</span>
          </article>
          <article>
            <h3>Active products</h3>
            <p>{products.length}</p>
            <span>{categories.length} categories organised</span>
          </article>
          <article>
            <h3>Total units on hand</h3>
            <p>{totalUnits}</p>
            <span>{lowStockCount} items flag low stock</span>
          </article>
        </section>

        {error && (
          <div className="error-banner">
            <strong>Something went wrong:</strong> {error}
          </div>
        )}

        <section className="filters-panel">
          <div className="search-field">
            <Search size={16} strokeWidth={1.5} />
            <input
              type="search"
              placeholder="Search name, category, or SKU"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </div>

          <div className="category-filter">
            <label htmlFor="categoryFilter">Category</label>
            <select
              id="categoryFilter"
              value={categoryFilter}
              onChange={(event) => setCategoryFilter(event.target.value)}
            >
              {categoryOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.name}
                </option>
              ))}
            </select>
          </div>

          <div className="chip-group" role="group" aria-label="Stock filters">
            {stockFilters.map((filter) => (
              <button
                key={filter.id}
                type="button"
                className={`chip ${stockFilter === filter.id ? "active" : ""}`}
                onClick={() => setStockFilter(filter.id)}
              >
                <span>{filter.label}</span>
                <small>{filter.helper}</small>
              </button>
            ))}
          </div>
        </section>

        <section className="manager-grid">
          <div ref={formRef} className="forms-stack">
            <ProductForm
              key={editProduct ? `edit-${editProduct.id}` : "create"}
              initialData={editProduct}
              loading={editProduct ? updateLoading : createLoading}
              onSubmit={editProduct ? handleUpdateProduct : handleCreateProduct}
              onCancel={editProduct ? () => setEditProduct(null) : undefined}
            />
          </div>

          <div className="table-wrap">
            {loading ? (
              <div className="loading-state">
                <div className="spark" aria-hidden="true" />
                <h4>Loading your catalog…</h4>
                <p>Fetching the freshest numbers from the Shelfly backend.</p>
              </div>
            ) : (
              <ProductTable
                products={filteredProducts}
                categories={categories}
                onEdit={setEditProduct}
                onDelete={handleDeleteProduct}
                deletingId={deletingId}
              />
            )}
          </div>
        </section>
      </main>

      <style jsx>{`
        .products-page {
          min-height: 100vh;
          background: radial-gradient(circle at top, rgba(60, 70, 120, 0.32), transparent 55%),
            radial-gradient(circle at 20% 20%, rgba(103, 72, 255, 0.25), transparent 45%),
            #05060f;
          color: #f5f7ff;
          display: flex;
          flex-direction: column;
        }

        .products-main {
          flex: 1;
          padding: 2.8rem clamp(1.5rem, 6vw, 4rem) 3.5rem;
          display: flex;
          flex-direction: column;
          gap: 2.5rem;
        }

        .hero {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 2rem;
          padding: 2.4rem clamp(1.5rem, 4vw, 3.2rem);
          background: linear-gradient(135deg, rgba(23, 28, 48, 0.92), rgba(18, 12, 40, 0.92));
          border: 1px solid rgba(98, 104, 182, 0.3);
          border-radius: 30px;
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.05), 0 28px 48px rgba(4, 6, 18, 0.55);
        }

        .hero-kicker {
          font-size: 0.72rem;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: #8d98cb;
          margin-bottom: 0.75rem;
        }

        .hero h1 {
          font-size: clamp(2.2rem, 5vw, 2.8rem);
          font-weight: 600;
          margin: 0 0 1rem;
        }

        .hero p {
          margin: 0;
          max-width: 520px;
          color: #c7cfef;
          font-size: 0.98rem;
          line-height: 1.6;
        }

        .hero-button {
          display: inline-flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.95rem 1.5rem;
          background: linear-gradient(135deg, #6f64ff, #4b49f6);
          border-radius: 16px;
          border: none;
          color: #ffffff;
          font-weight: 600;
          letter-spacing: 0.02em;
          font-size: 0.95rem;
          cursor: pointer;
          box-shadow: 0 22px 38px rgba(87, 77, 255, 0.35);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .hero-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 26px 48px rgba(87, 77, 255, 0.45);
        }

        .stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 1.5rem;
        }

        .stats article {
          background: rgba(13, 18, 34, 0.85);
          border-radius: 24px;
          border: 1px solid rgba(74, 88, 158, 0.25);
          padding: 1.8rem;
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.04);
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
        }

        .stats h3 {
          margin: 0;
          font-size: 0.85rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #94a0d0;
        }

        .stats p {
          margin: 0;
          font-size: clamp(1.4rem, 4vw, 1.8rem);
          font-weight: 600;
          color: #f0f3ff;
        }

        .stats span {
          font-size: 0.82rem;
          color: #9ca7d2;
        }

        .error-banner {
          border-radius: 18px;
          border: 1px solid rgba(181, 70, 88, 0.4);
          background: linear-gradient(135deg, rgba(83, 22, 31, 0.92), rgba(44, 10, 18, 0.92));
          padding: 1.1rem 1.4rem;
          font-size: 0.92rem;
          color: #f7c9d0;
        }

        .filters-panel {
          display: grid;
          grid-template-columns: minmax(220px, 1fr) minmax(200px, 220px) 1fr;
          gap: 1.2rem;
          padding: 1.5rem;
          border-radius: 24px;
          border: 1px solid rgba(82, 95, 166, 0.28);
          background: rgba(10, 14, 28, 0.85);
        }

        .search-field {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0 1rem;
          border-radius: 16px;
          border: 1px solid rgba(75, 88, 152, 0.35);
          background: rgba(6, 9, 21, 0.9);
        }

        .search-field input {
          flex: 1;
          background: transparent;
          border: none;
          color: #f5f6ff;
          font-size: 0.95rem;
          padding: 0.85rem 0;
        }

        .search-field input:focus {
          outline: none;
        }

        .category-filter {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .category-filter label {
          font-size: 0.72rem;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          color: #a0aad4;
        }

        .category-filter select {
          border-radius: 14px;
          border: 1px solid rgba(75, 88, 152, 0.35);
          background: rgba(9, 12, 24, 0.92);
          color: #f5f6ff;
          padding: 0.85rem 1rem;
          font-size: 0.92rem;
        }

        .chip-group {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 0.8rem;
        }

        .chip {
          display: flex;
          flex-direction: column;
          border-radius: 14px;
          border: 1px solid rgba(72, 84, 140, 0.4);
          background: rgba(14, 17, 35, 0.8);
          color: #c8d0ef;
          padding: 0.65rem 0.9rem;
          text-align: left;
          transition: border 0.2s ease, background 0.2s ease;
        }

        .chip small {
          font-size: 0.7rem;
          color: #8b94c5;
        }

        .chip.active {
          border-color: rgba(118, 108, 255, 0.8);
          background: rgba(36, 32, 78, 0.85);
          color: #f4f5ff;
        }

        .manager-grid {
          display: grid;
          gap: 2rem;
          grid-template-columns: minmax(0, 380px) minmax(0, 1fr);
          align-items: start;
        }

        .forms-stack {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .table-wrap {
          min-height: 420px;
        }

        .loading-state {
          height: 100%;
          border-radius: 26px;
          border: 1px solid rgba(71, 86, 161, 0.3);
          background: rgba(12, 14, 27, 0.82);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          gap: 0.75rem;
          padding: 3.5rem 1.5rem;
          position: relative;
          overflow: hidden;
        }

        .spark {
          position: absolute;
          inset: 0;
          background: linear-gradient(120deg, rgba(86, 94, 184, 0.25), rgba(43, 51, 113, 0.15));
          animation: shimmer 2.4s infinite;
        }

        .loading-state h4 {
          position: relative;
          margin: 0;
          font-size: 1.05rem;
          font-weight: 600;
          color: #d7defb;
        }

        .loading-state p {
          position: relative;
          margin: 0;
          font-size: 0.85rem;
          color: #9ca6d7;
        }

        @keyframes shimmer {
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

          .table-wrap {
            order: -1;
          }
        }

        @media (max-width: 1024px) {
          .filters-panel {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 768px) {
          .products-main {
            padding: 2.2rem 1.4rem 2.8rem;
          }

          .hero {
            flex-direction: column;
            align-items: flex-start;
          }

          .hero-button {
            width: 100%;
            justify-content: center;
          }

          .stats {
            grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          }
        }
      `}</style>
    </div>
  );
};

export default ProductsPage;