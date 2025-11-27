"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
    <Card className="bg-[#111111]">
      <CardHeader className="border-b border-[#1f1f1f] pb-4">
        <CardTitle className="text-base uppercase tracking-wide text-[#f5f5f5]">
          {productFormTitle(initialData)}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <Label htmlFor="name">Product Name</Label>
            <Input
              id="name"
              name="name"
              placeholder="e.g. Wireless Keyboard"
              value={formState.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                name="price"
                type="number"
                min="0"
                step="0.01"
                value={formState.price}
                onChange={handleChange}
                placeholder="0.00"
                required
              />
            </div>

            <div>
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                name="quantity"
                type="number"
                min="0"
                value={formState.quantity}
                onChange={handleChange}
                placeholder="0"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="categoryId">Category</Label>
            <select
              id="categoryId"
              name="categoryId"
              value={formState.categoryId}
              onChange={handleChange}
              required
              className="w-full rounded-md border border-[#2e2e2e] bg-[#111111] px-3 py-2 text-sm text-[#f5f5f5] focus-ring"
            >
              <option value="" className="bg-[#111111] text-[#b0b0b0]">
                Choose a category
              </option>
              {categories.map((category) => (
                <option
                  key={category.id}
                  value={category.id}
                  className="bg-[#111111] text-[#f5f5f5]"
                >
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-3">
            <Button
              type="submit"
              disabled={loading}
              className="min-w-[140px]"
            >
              {loading ? "Saving..." : initialData ? "Update" : "Create"}
            </Button>
            {initialData && (
              <Button
                type="button"
                variant="ghost"
                onClick={onCancel}
                className="text-muted"
              >
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

