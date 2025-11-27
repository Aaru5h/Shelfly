"use client";

import { useMemo } from "react";
import { Button } from "@/components/ui/button";

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(Number(value || 0));

const formatDate = (value) => {
  if (!value) return "—";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
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

  return (
    <div className="overflow-hidden rounded-lg border border-[#262626] bg-[#111111] shadow-[0_25px_60px_rgba(0,0,0,0.45)]">
      <table className="w-full text-left text-sm">
        <thead className="bg-[#0d0d0d] uppercase text-[11px] tracking-[0.2em] text-[#6f6f6f]">
          <tr>
            <th className="px-6 py-4 font-semibold">Product</th>
            <th className="px-6 py-4 font-semibold">Category</th>
            <th className="px-6 py-4 font-semibold text-right">Price</th>
            <th className="px-6 py-4 font-semibold text-right">Qty</th>
            <th className="px-6 py-4 font-semibold text-right">Created</th>
            <th className="px-6 py-4 font-semibold text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.length === 0 && (
            <tr>
              <td
                colSpan={6}
                className="px-6 py-10 text-center text-[#b0b0b0]"
              >
                No products yet. Start by adding your first item.
              </td>
            </tr>
          )}
          {products.map((product) => (
            <tr
              key={product.id}
              className="border-t border-[#1f1f1f] text-[#f5f5f5] transition hover:bg-[#151515]"
            >
              <td className="px-6 py-4">
                <div className="text-[15px] font-medium">{product.name}</div>
                <p className="text-xs text-[#8a8a8a]">#{product.id}</p>
              </td>
              <td className="px-6 py-4 text-[#b0b0b0]">
                {categoryLookup[product.categoryId] || "Uncategorized"}
              </td>
              <td className="px-6 py-4 text-right">
                {formatCurrency(product.price)}
              </td>
              <td className="px-6 py-4 text-right font-semibold">
                {product.quantity}
              </td>
              <td className="px-6 py-4 text-right text-[#b0b0b0]">
                {formatDate(product.createdAt)}
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center justify-end gap-3">
                  <Button
                    variant="ghost"
                    className="text-[#3b82f6]"
                    onClick={() => onEdit?.(product)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    className="text-xs"
                    disabled={deletingId === product.id}
                    onClick={() => onDelete?.(product.id)}
                  >
                    {deletingId === product.id ? "Removing..." : "Delete"}
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

