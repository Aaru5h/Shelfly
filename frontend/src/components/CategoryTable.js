"use client";

import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

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
    <div className="overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900/50">
      <table className="w-full text-left text-sm">
        <thead className="bg-zinc-900/50 text-xs uppercase tracking-wider text-zinc-500 border-b border-zinc-800">
          <tr>
            <th className="px-6 py-4 font-medium">Category</th>
            <th className="px-6 py-4 font-medium text-right">Products</th>
            <th className="px-6 py-4 font-medium text-right">Created</th>
            <th className="px-6 py-4 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-800">
          {categories.length === 0 && (
            <tr>
              <td
                colSpan={4}
                className="px-6 py-12 text-center text-zinc-500"
              >
                No categories found.
              </td>
            </tr>
          )}
          {categories.map((category) => (
            <tr
              key={category.id}
              className="text-zinc-300 transition hover:bg-zinc-800/50"
            >
              <td className="px-6 py-4">
                <div className="font-medium text-zinc-200">{category.name}</div>
                <p className="text-xs text-zinc-500">ID: {category.id}</p>
              </td>
              <td className="px-6 py-4 text-right font-medium text-zinc-200">
                {productCounts[category.id] || 0}
              </td>
              <td className="px-6 py-4 text-right text-zinc-500">
                {formatDate(category.createdAt)}
              </td>
              <td className="px-6 py-4">
                <div className="flex justify-end">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-zinc-500 hover:text-red-400 hover:bg-red-950/20 h-8 w-8"
                    disabled={deletingId === category.id}
                    onClick={() => onDelete?.(category.id)}
                  >
                    {deletingId === category.id ? (
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-red-500 border-t-transparent" />
                    ) : (
                      <Trash2 size={16} />
                    )}
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
