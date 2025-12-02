"use client";

import { useState } from "react";

export default function CategoryForm({ onSubmit, loading = false }) {
  const [name, setName] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!name.trim() || loading) return;
    onSubmit?.({ name: name.trim() });
    setName("");
  };

  return (
    <section className="category-form">
      <header>
        <p className="eyebrow">Create taxonomy</p>
        <h2>Add fresh category lanes</h2>
        <p>Organise shelves with purposeful tags so inventory reports stay meaningful.</p>
      </header>

      <form onSubmit={handleSubmit}>
        <label htmlFor="categoryName">Category name</label>
        <input
          id="categoryName"
          name="categoryName"
          type="text"
          placeholder="e.g. Smart Devices"
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
          autoComplete="off"
        />
        <button type="submit" disabled={loading}>
          {loading ? "Saving…" : "Save category"}
        </button>
      </form>

      <style jsx>{`
        .category-form {
          position: sticky;
          top: 2rem;
          background: rgba(16, 20, 38, 0.92);
          border-radius: 26px;
          border: 1px solid rgba(92, 106, 177, 0.32);
          padding: 2rem;
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.05), 0 28px 60px rgba(4, 6, 16, 0.55);
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        header {
          display: flex;
          flex-direction: column;
          gap: 0.55rem;
        }

        .eyebrow {
          font-size: 0.72rem;
          letter-spacing: 0.32em;
          text-transform: uppercase;
          color: #7f89bc;
          margin: 0;
        }

        h2 {
          margin: 0;
          font-size: 1.35rem;
          font-weight: 600;
          color: #f5f7ff;
        }

        header p:last-of-type {
          margin: 0;
          color: #9ca5d0;
          font-size: 0.92rem;
          line-height: 1.55;
        }

        form {
          display: flex;
          flex-direction: column;
          gap: 0.9rem;
        }

        label {
          text-transform: uppercase;
          font-size: 0.74rem;
          letter-spacing: 0.22em;
          color: #9ca5d8;
        }

        input {
          height: 52px;
          border-radius: 16px;
          border: 1px solid rgba(70, 85, 150, 0.45);
          background: rgba(10, 14, 26, 0.9);
          padding: 0 1.1rem;
          color: #f8f9ff;
          font-size: 0.95rem;
          transition: border 0.2s ease, box-shadow 0.2s ease;
        }

        input::placeholder {
          color: #5f6892;
        }

        input:focus {
          outline: none;
          border-color: rgba(120, 111, 255, 0.8);
          box-shadow: 0 0 0 2px rgba(120, 111, 255, 0.2);
        }

        button {
          height: 52px;
          border: none;
          border-radius: 16px;
          background: linear-gradient(135deg, #6c5cff, #4b47f4);
          color: #ffffff;
          font-weight: 600;
          font-size: 0.95rem;
          letter-spacing: 0.02em;
          cursor: pointer;
          box-shadow: 0 24px 36px rgba(73, 63, 220, 0.35);
          transition: transform 0.2s ease, box-shadow 0.2s ease, opacity 0.2s ease;
        }

        button:disabled {
          opacity: 0.65;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }

        button:not(:disabled):hover {
          transform: translateY(-1px);
          box-shadow: 0 26px 48px rgba(73, 63, 220, 0.45);
        }

        @media (max-width: 768px) {
          .category-form {
            position: static;
          }
        }
      `}</style>
    </section>
  );
}
