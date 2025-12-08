"use client";

import { useMemo } from "react";

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(Number(value || 0));

const formatDate = (value) => {
  if (!value) return "—";
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
};

export default function ProductTable({
  products = [],
  categories = [],
  onEdit,
  onDelete,
  deletingId,
}) {
  const categoryLookup = useMemo(() => {
    return categories.reduce((acc, category) => {
      acc[category.id] = category.name;
      return acc;
    }, {});
  }, [categories]);

  const getCategoryName = (product) => {
    return product.categoryName || categoryLookup[product.categoryId] || "Uncategorised";
  };

  return (
    <section className="product-table">
      <header className="table-header">
        <div>
          <p className="eyebrow">Inventory</p>
          <h2 className="title">Product catalog</h2>
        </div>
        <span className="count-chip">
          {products.length} {products.length === 1 ? "item" : "items"}
        </span>
      </header>

      <div className="table-shell">
        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Category</th>
              <th className="right">Price</th>
              <th className="right">Qty</th>
              <th className="right">Created</th>
              <th className="right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan={6} className="empty">
                  Your catalog is waiting. Add a product to see it appear here.
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product.id}>
                  <td data-type="primary">
                    <span className="product-name">{product.name}</span>
                    <span className="product-id">#{product.id}</span>
                  </td>
                  <td>{getCategoryName(product)}</td>
                  <td className="right">{formatCurrency(product.price)}</td>
                  <td className="right">{product.quantity}</td>
                  <td className="right">{formatDate(product.createdAt)}</td>
                  <td className="row-actions">
                    <button
                      type="button"
                      className="ghost"
                      onClick={() => onEdit?.(product)}
                      disabled={deletingId === product.id}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="danger"
                      onClick={() => onDelete?.(product.id)}
                      disabled={deletingId === product.id}
                    >
                      {deletingId === product.id ? "Removing..." : "Delete"}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <style jsx>{`
        .product-table {
          background: rgba(9, 14, 26, 0.92);
          border-radius: 28px;
          padding: 2.25rem;
          border: 1px solid rgba(77, 95, 178, 0.26);
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.05), 0 32px 68px rgba(5, 8, 20, 0.52);
          display: flex;
          flex-direction: column;
          gap: 1.8rem;
        }

        .table-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1.5rem;
        }

        .eyebrow {
          font-size: 0.73rem;
          text-transform: uppercase;
          letter-spacing: 0.28em;
          color: #7c88bc;
          margin: 0 0 0.35rem;
        }

        .title {
          font-size: 1.35rem;
          font-weight: 600;
          color: #f1f5ff;
          margin: 0;
        }

        .count-chip {
          padding: 0.5rem 1.1rem;
          border-radius: 999px;
          border: 1px solid rgba(120, 134, 207, 0.4);
          background: rgba(19, 23, 41, 0.88);
          font-size: 0.8rem;
          font-weight: 600;
          color: #d2daff;
        }

        .table-shell {
          border-radius: 20px;
          border: 1px solid rgba(32, 45, 86, 0.55);
          overflow: hidden;
          background: rgba(14, 19, 35, 0.72);
        }

        table {
          width: 100%;
          border-collapse: collapse;
        }

        thead {
          background: linear-gradient(180deg, rgba(30, 42, 77, 0.92) 0%, rgba(19, 27, 47, 0.92) 100%);
        }

        th {
          text-align: left;
          padding: 1rem 1.35rem;
          font-size: 0.74rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #92a2de;
          font-weight: 600;
        }

        th.right {
          text-align: right;
        }

        tbody tr {
          border-top: 1px solid rgba(34, 45, 86, 0.38);
          transition: background 0.2s ease;
        }

        tbody tr:hover {
          background: rgba(38, 50, 92, 0.6);
        }

        td {
          padding: 1.05rem 1.35rem;
          font-size: 0.96rem;
          color: #c2cae8;
        }

        td.right {
          text-align: right;
        }

        td[data-type="primary"] {
          display: flex;
          flex-direction: column;
          gap: 0.18rem;
          color: #f4f6ff;
          font-weight: 600;
        }

        .product-name {
          font-size: 1rem;
        }

        .product-id {
          font-size: 0.7rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #8892b8;
        }

        .row-actions {
          display: flex;
          justify-content: flex-end;
          gap: 0.65rem;
        }

        .ghost,
        .danger {
          height: 42px;
          padding: 0 1.25rem;
          border-radius: 12px;
          font-weight: 600;
          letter-spacing: 0.02em;
          font-size: 0.84rem;
          cursor: pointer;
          transition: transform 0.2s ease, box-shadow 0.2s ease, opacity 0.2s ease;
        }

        .ghost {
          background: rgba(26, 31, 55, 0.82);
          border: 1px solid rgba(96, 111, 193, 0.36);
          color: #e4ecff;
        }

        .ghost:hover {
          transform: translateY(-1px);
          box-shadow: 0 14px 32px rgba(76, 92, 168, 0.35);
        }

        .danger {
          border: none;
          background: linear-gradient(140deg, rgba(251, 93, 122, 0.9), rgba(199, 48, 88, 0.92));
          color: #ffffff;
        }

        .danger:hover {
          transform: translateY(-1px);
          box-shadow: 0 14px 32px rgba(224, 66, 110, 0.4);
        }

        .ghost:disabled,
        .danger:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }

        .empty {
          text-align: center;
          padding: 3.4rem 1.6rem;
          color: #9ca7cf;
          font-size: 0.92rem;
        }

        @media (max-width: 768px) {
          .product-table {
            padding: 1.7rem;
          }

          th,
          td {
            padding: 0.85rem 1rem;
          }

          .row-actions {
            gap: 0.45rem;
          }

          .ghost,
          .danger {
            padding: 0 0.95rem;
          }
        }
      `}</style>
    </section>
  );
}

