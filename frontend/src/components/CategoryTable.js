"use client";

import { Button } from "@/components/ui/button";

const formatDate = (value) => {
  if (!value) return "—";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
};

export default function CategoryTable({
  categories = [],
  productCounts = {},
  onDelete,
  deletingId,
}) {
  return (
    <div className="overflow-hidden rounded-lg border border-[#262626] bg-[#111111]">
      <table className="w-full text-left text-sm">
        <thead className="bg-[#0d0d0d] uppercase text-[11px] tracking-[0.2em] text-[#6f6f6f]">
          <tr>
            <th className="px-6 py-4 font-semibold">Category</th>
            <th className="px-6 py-4 font-semibold text-right">Products</th>
            <th className="px-6 py-4 font-semibold text-right">Created</th>
            <th className="px-6 py-4 font-semibold text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.length === 0 && (
            <tr>
              <td
                colSpan={4}
                className="px-6 py-10 text-center text-[#b0b0b0]"
              >
                No categories yet. Add your first to keep products organized.
              </td>
            </tr>
          )}
          {categories.map((category) => (
            <tr
              key={category.id}
              className="border-t border-[#1f1f1f] text-[#f5f5f5] transition hover:bg-[#151515]"
            >
              <td className="px-6 py-4">
                <div className="text-[15px] font-medium">{category.name}</div>
                <p className="text-xs text-[#8a8a8a]">#{category.id}</p>
              </td>
              <td className="px-6 py-4 text-right font-semibold">
                {productCounts[category.id] || 0}
              </td>
              <td className="px-6 py-4 text-right text-[#b0b0b0]">
                {formatDate(category.createdAt)}
              </td>
              <td className="px-6 py-4">
                <div className="flex justify-end">
                  <Button
                    variant="danger"
                    size="sm"
                    disabled={deletingId === category.id}
                    onClick={() => onDelete?.(category.id)}
                  >
                    {deletingId === category.id ? "Removing..." : "Delete"}
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

