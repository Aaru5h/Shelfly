"use client";

import { useEffect, useState } from "react";

const emptyState = {
  name: "",
  price: "",
  quantity: "",
  categoryId: "",
};

const formatNumber = (value) => (value === "" ? "" : Number(value));

const productFormTitle = (initialData) =>
  initialData ? "Edit product" : "Add product";

export default function ProductForm({
  categories = [],
  initialData = null,
  loading = false,
  onSubmit,
  onCancel,
}) {
  const [formState, setFormState] = useState(emptyState);

  useEffect(() => {
    if (initialData) {
      setFormState({
        name: initialData.name || "",
        price: initialData.price?.toString() || "",
        quantity: initialData.quantity?.toString() || "",
        categoryId: initialData.categoryId || "",
      });
    } else {
      setFormState(emptyState);
    }
  }, [initialData]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!onSubmit) return;

    onSubmit({
      name: formState.name.trim(),
      price: Number(formatNumber(formState.price)),
      quantity: Number(formatNumber(formState.quantity)),
      categoryId: formState.categoryId,
    });
  };

  return (
    <section className={`product-form ${initialData ? "is-edit" : ""}`}>
      <header className="form-header">
        <p className="form-eyebrow">{initialData ? "Edit" : "Create"} product</p>
        <h2 className="form-title">{productFormTitle(initialData)}</h2>
        <p className="form-subtitle">
          {initialData
            ? "Update pricing, quantity, or category details."
            : "Capture product essentials to make inventory updates effortless."}
        </p>
      </header>

      <form className="form-body" onSubmit={handleSubmit}>
        <label className="field">
          <span className="field-label">Product name</span>
          <input
            id="name"
            name="name"
            placeholder="e.g. Wireless Keyboard"
            value={formState.name}
            onChange={handleChange}
            required
            className="field-input"
          />
        </label>

        <div className="field-grid">
          <label className="field">
            <span className="field-label">Price (₹)</span>
            <input
              id="price"
              name="price"
              type="number"
              min="0"
              step="0.01"
              value={formState.price}
              onChange={handleChange}
              placeholder="0.00"
              required
              className="field-input"
            />
          </label>

          <label className="field">
            <span className="field-label">Quantity</span>
            <input
              id="quantity"
              name="quantity"
              type="number"
              min="0"
              value={formState.quantity}
              onChange={handleChange}
              placeholder="0"
              required
              className="field-input"
            />
          </label>
        </div>

        <label className="field">
          <span className="field-label">Category</span>
          <select
            id="categoryId"
            name="categoryId"
            value={formState.categoryId}
            onChange={handleChange}
            required
            className="field-select"
          >
            <option value="" className="select-option" disabled>
              Choose a category
            </option>
            {categories.map((category) => (
              <option key={category.id} value={category.id} className="select-option">
                {category.name}
              </option>
            ))}
          </select>
        </label>

        <div className="form-actions">
          <button type="submit" className="primary" disabled={loading}>
            {loading ? "Saving..." : initialData ? "Update product" : "Create product"}
          </button>
          {initialData && (
            <button type="button" className="ghost" onClick={onCancel} disabled={loading}>
              Cancel
            </button>
          )}
        </div>
      </form>

      <style jsx>{`
        .product-form {
          background: rgba(16, 21, 35, 0.95);
          border-radius: 24px;
          border: 1px solid rgba(98, 110, 175, 0.24);
          padding: 2.1rem;
          box-shadow: 0 24px 48px rgba(7, 9, 20, 0.5);
          display: flex;
          flex-direction: column;
          gap: 1.75rem;
        }

        .product-form.is-edit {
          background: rgba(23, 18, 38, 0.96);
          border-color: rgba(146, 91, 255, 0.35);
        }

        .form-header {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .form-eyebrow {
          font-size: 0.72rem;
          text-transform: uppercase;
          letter-spacing: 0.28em;
          color: #7f88a9;
        }

        .form-title {
          font-size: 1.25rem;
          font-weight: 600;
          color: #f6f7ff;
          margin: 0;
        }

        .form-subtitle {
          font-size: 0.85rem;
          line-height: 1.5;
          color: #99a3c5;
          margin: 0;
          max-width: 360px;
        }

        .form-body {
          display: flex;
          flex-direction: column;
          gap: 1.3rem;
        }

        .field {
          display: flex;
          flex-direction: column;
          gap: 0.55rem;
        }

        .field-label {
          font-size: 0.78rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          font-weight: 600;
          color: #a8b1d3;
        }

        .field-input,
        .field-select {
          height: 50px;
          border-radius: 14px;
          border: 1px solid rgba(64, 76, 122, 0.6);
          background: rgba(15, 18, 32, 0.92);
          padding: 0 1rem;
          color: #e4e9ff;
          font-size: 0.95rem;
          transition: border 0.2s ease, box-shadow 0.2s ease;
        }

        .field-input::placeholder {
          color: #5f6a8f;
        }

        .field-input:focus,
        .field-select:focus {
          outline: none;
          border-color: rgba(112, 104, 255, 0.75);
          box-shadow: 0 0 0 2px rgba(112, 104, 255, 0.18);
        }

        .field-grid {
          display: grid;
          gap: 1.1rem;
          grid-template-columns: repeat(1, minmax(0, 1fr));
        }

        @media (min-width: 540px) {
          .field-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        .select-option {
          background: #111525;
          color: #e4e9ff;
        }

        .form-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 0.8rem;
        }

        .primary,
        .ghost {
          min-width: 150px;
          height: 48px;
          border-radius: 14px;
          font-weight: 600;
          font-size: 0.95rem;
          letter-spacing: 0.01em;
          cursor: pointer;
          transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
        }

        .primary {
          border: none;
          background: linear-gradient(135deg, #6a5cff 0%, #4f46e5 100%);
          color: #ffffff;
          box-shadow: 0 18px 32px rgba(87, 78, 255, 0.35);
        }

        .primary:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }

        .primary:not(:disabled):hover {
          transform: translateY(-1px);
        }

        .ghost {
          border: 1px solid rgba(110, 119, 168, 0.35);
          background: rgba(20, 22, 35, 0.6);
          color: #bac4e8;
        }

        .ghost:hover {
          border-color: rgba(152, 161, 214, 0.55);
          color: #ffffff;
        }
      `}</style>
    </section>
  );
}

