"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function CategoryForm({ onSubmit, loading = false }) {
  const [name, setName] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!name.trim()) return;
    onSubmit?.({ name: name.trim() });
    setName("");
  };

  return (
    <Card className="bg-[#111111]">
      <CardHeader className="border-b border-[#1f1f1f] pb-4">
        <CardTitle className="text-base uppercase tracking-wide text-[#f5f5f5]">
          New Category
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="categoryName">Category name</Label>
            <Input
              id="categoryName"
              placeholder="e.g. Accessories"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
            />
          </div>
          <Button type="submit" disabled={loading} className="min-w-[140px]">
            {loading ? "Saving..." : "Add Category"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

