"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";

export default function CategoryForm({ onSubmit, loading = false }) {
  const [name, setName] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!name.trim()) return;
    onSubmit?.({ name: name.trim() });
    setName("");
  };

  return (
    <Card className="bg-zinc-900/50 border-zinc-800 h-fit sticky top-6">
      <CardHeader className="pb-4 border-b border-zinc-800/50">
        <CardTitle className="text-lg font-medium text-zinc-100">Add Category</CardTitle>
        <CardDescription>Create a new classification for your products.</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="categoryName" className="text-zinc-400">Name</Label>
            <Input
              id="categoryName"
              placeholder="e.g. Electronics"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
              className="bg-zinc-950/50 border-zinc-800 focus-visible:ring-blue-600"
            />
          </div>
          <Button 
            type="submit" 
            disabled={loading} 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            {loading ? (
              "Saving..."
            ) : (
              <>
                <Plus size={16} className="mr-2" /> Add Category
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
