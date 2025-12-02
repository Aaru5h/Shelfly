"use client";

const formatDate = (value) => {
  if (!value) return "—";
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
};

const badgeCopy = (count) => {
  if (count === 0) return "No products";
  if (count === 1) return "1 product";
  return `${count} products`;
};

export default function CategoryTable({
  categories = [],
  productCounts = {},
  onDelete,
  deletingId,
}) {
  return (
    <section className="category-table">
      <header>
        <div>
          <p className="eyebrow">Live taxonomy</p>
          <h2>Categories overview</h2>
        </div>
        <span className="chip">
          {categories.length} {categories.length === 1 ? "category" : "categories"}
        </span>
      </header>

      <div className="table-shell">
        <table>
          <thead>
            <tr>
              <th>Category</th>
              <th>Coverage</th>
              <th className="right">Created</th>
              <th className="right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.length === 0 ? (
              <tr>
                <td colSpan={4} className="empty">No matching categories. Try another search.</td>
              </tr>
            ) : (
              categories.map((category) => {
                const productCount = productCounts[category.id] || 0;
                const intent = productCount === 0 ? "ghost" : productCount <= 2 ? "calm" : "active";

                return (
                  <tr key={category.id}>
                    <td data-type="primary">
                      <span className="name">{category.name}</span>
                      <span className="meta">#{category.id}</span>
                    </td>
                    <td>
                      <span className={`badge ${intent}`}>{badgeCopy(productCount)}</span>
                    </td>
                    <td className="right">{formatDate(category.createdAt)}</td>
                    <td className="right">
                      <button
                        type="button"
                        className="danger"
                        onClick={() => onDelete?.(category.id)}
                        disabled={deletingId === category.id}
                      >
                        {deletingId === category.id ? "Removing…" : "Delete"}
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <style jsx>{`
        .category-table {
          background: rgba(8, 12, 26, 0.92);
          border-radius: 30px;
          border: 1px solid rgba(70, 88, 167, 0.35);
          padding: 2rem;
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.05), 0 28px 48px rgba(3, 5, 13, 0.58);
          display: flex;
          flex-direction: column;
          gap: 1.6rem;
        }

        header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
        }

        .eyebrow {
          margin: 0;
          font-size: 0.72rem;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          color: #7a85be;
        }

        h2 {
          margin: 0.35rem 0 0;
          font-size: 1.35rem;
          color: #f0f2ff;
          font-weight: 600;
        }

        .chip {
          padding: 0.4rem 1rem;
          border-radius: 999px;
          border: 1px solid rgba(123, 138, 214, 0.4);
          background: rgba(18, 23, 40, 0.85);
          font-size: 0.82rem;
          font-weight: 600;
          color: #d4dbff;
        }

        .table-shell {
          border-radius: 22px;
          border: 1px solid rgba(32, 45, 86, 0.55);
          overflow: hidden;
          background: rgba(13, 18, 34, 0.7);
        }

        table {
          width: 100%;
          border-collapse: collapse;
        }

        thead {
          background: linear-gradient(180deg, rgba(30, 42, 77, 0.92) 0%, rgba(19, 27, 47, 0.92) 100%);
        }

        th {
          padding: 1rem 1.4rem;
          font-size: 0.76rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #8f9fdc;
          text-align: left;
        }

        th.right {
          text-align: right;
        }

        tbody tr {
          border-top: 1px solid rgba(30, 44, 88, 0.4);
          transition: background 0.2s ease;
        }

        tbody tr:hover {
          background: rgba(35, 49, 90, 0.5);
        }

        td {
          padding: 1.1rem 1.4rem;
          font-size: 0.95rem;
          color: #c5cdeb;
        }

        td[data-type="primary"] {
          display: flex;
          flex-direction: column;
          gap: 0.18rem;
          font-weight: 600;
          color: #f3f5ff;
        }

        .name {
          font-size: 1rem;
        }

        .meta {
          font-size: 0.7rem;
          letter-spacing: 0.24em;
          text-transform: uppercase;
          color: #8a93bf;
        }

        .badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 140px;
          padding: 0.45rem 0.85rem;
          border-radius: 999px;
          font-size: 0.8rem;
          font-weight: 600;
          letter-spacing: 0.04em;
        }

        .badge.ghost {
          background: rgba(68, 79, 130, 0.25);
          border: 1px dashed rgba(136, 148, 205, 0.5);
          color: #aeb9e5;
        }

        .badge.calm {
          background: rgba(107, 92, 255, 0.18);
          border: 1px solid rgba(120, 108, 255, 0.45);
          color: #c2c8ff;
        }

        .badge.active {
          background: rgba(15, 188, 168, 0.18);
          border: 1px solid rgba(15, 188, 168, 0.4);
          color: #64ffe9;
        }

        .danger {
          min-width: 120px;
          height: 42px;
          border: none;
          border-radius: 12px;
          background: linear-gradient(135deg, rgba(247, 96, 123, 0.9), rgba(189, 46, 83, 0.85));
          color: #ffffff;
          font-weight: 600;
          font-size: 0.85rem;
          cursor: pointer;
          transition: transform 0.2s ease, box-shadow 0.2s ease, opacity 0.2s ease;
        }

        .danger:hover {
          transform: translateY(-1px);
          box-shadow: 0 18px 32px rgba(212, 56, 101, 0.4);
        }

        .danger:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }

        .empty {
          padding: 3rem 1.5rem;
          text-align: center;
          color: #9aa5cf;
        }

        @media (max-width: 768px) {
          .category-table {
            padding: 1.5rem;
          }

          th,
          td {
            padding: 0.85rem 1rem;
          }

          .badge {
            min-width: 100px;
          }
        }
      `}</style>
    </section>
  );
}
