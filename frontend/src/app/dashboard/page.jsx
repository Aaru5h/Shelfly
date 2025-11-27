"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import NavBar from "@/components/NavBar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { authorizedFetch } from "@/lib/http";

const DashboardPage = () => {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const ensureAuth = () => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) {
      router.replace("/login");
      return false;
    }
    return true;
  };

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const [categoryPayload, productPayload] = await Promise.all([
        authorizedFetch("/categories"),
        authorizedFetch("/products"),
      ]);
      setCategories(categoryPayload);
      setProducts(productPayload);
    } catch (err) {
      setError(err.message || "Unable to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (ensureAuth()) {
      loadData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const totalInventoryValue = useMemo(() => {
    return products.reduce(
      (acc, product) =>
        acc + Number(product.price || 0) * Number(product.quantity || 0),
      0
    );
  }, [products]);

  const lowStock = useMemo(() => {
    return products
      .filter((product) => Number(product.quantity) <= 5)
      .slice(0, 4);
  }, [products]);

  const latestProducts = useMemo(() => {
    return [...products]
      .sort(
        (a, b) =>
          new Date(b.createdAt || 0).getTime() -
          new Date(a.createdAt || 0).getTime()
      )
      .slice(0, 5);
  }, [products]);

  const categoryProductCounts = useMemo(() => {
    return products.reduce((acc, product) => {
      acc[product.categoryId] = (acc[product.categoryId] || 0) + 1;
      return acc;
    }, {});
  }, [products]);

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-[#f5f5f5]">
      <div className="flex min-h-screen flex-col md:flex-row">
        <NavBar />
        <main className="flex-1 space-y-8 px-4 py-6 md:px-10 md:py-10">
          <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.5em] text-[#6f6f6f]">
                Dashboard
              </p>
              <h1 className="text-3xl font-semibold">Inventory overview</h1>
              <p className="text-sm text-[#b0b0b0]">
                Real-time snapshot of products, categories, and stock health.
              </p>
            </div>
            <div className="flex gap-3">
              <Link href="/products">
                <Button>Manage products</Button>
              </Link>
              <Link href="/categories">
                <Button variant="subtle">Manage categories</Button>
              </Link>
            </div>
          </header>

          {error && (
            <div className="rounded-md border border-[#3d1c1c] bg-[#170c0c] px-4 py-3 text-sm text-[#fdaaaa]">
              {error}
            </div>
          )}

          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <Card className="bg-[#111111]">
              <CardHeader className="border-none pb-2">
                <p className="text-xs uppercase tracking-[0.4em] text-[#6f6f6f]">
                  Products
                </p>
                <CardTitle className="text-4xl font-semibold">
                  {loading ? "—" : products.length}
                </CardTitle>
                <CardDescription>Total tracked SKUs</CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-[#111111]">
              <CardHeader className="border-none pb-2">
                <p className="text-xs uppercase tracking-[0.4em] text-[#6f6f6f]">
                  Categories
                </p>
                <CardTitle className="text-4xl font-semibold">
                  {loading ? "—" : categories.length}
                </CardTitle>
                <CardDescription>Active groupings</CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-[#111111]">
              <CardHeader className="border-none pb-2">
                <p className="text-xs uppercase tracking-[0.4em] text-[#6f6f6f]">
                  Inventory value
                </p>
                <CardTitle className="text-4xl font-semibold">
                  {loading
                    ? "—"
                    : new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD",
                        maximumFractionDigits: 0,
                      }).format(totalInventoryValue)}
                </CardTitle>
                <CardDescription>Valued at retail</CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-[#111111]">
              <CardHeader className="border-none pb-2">
                <p className="text-xs uppercase tracking-[0.4em] text-[#6f6f6f]">
                  Low stock
                </p>
                <CardTitle className="text-4xl font-semibold">
                  {loading ? "—" : lowStock.length}
                </CardTitle>
                <CardDescription>Items at or below 5 qty</CardDescription>
              </CardHeader>
            </Card>
          </section>

          <section className="grid gap-6 xl:grid-cols-[2fr_1fr]">
            <Card className="bg-[#111111]">
              <CardHeader className="flex flex-row items-center justify-between border-b border-[#1f1f1f] pb-4">
                <div>
                  <CardTitle className="text-lg">Recent products</CardTitle>
                  <CardDescription>Latest inventory activity</CardDescription>
                </div>
                <Link href="/products">
                  <Button variant="ghost" className="text-xs uppercase tracking-wide">
                    View all
                  </Button>
                </Link>
              </CardHeader>
              <CardContent className="space-y-0 divide-y divide-[#1f1f1f]">
                {loading ? (
                  <p className="py-6 text-center text-[#b0b0b0]">
                    Loading inventory...
                  </p>
                ) : latestProducts.length === 0 ? (
                  <p className="py-6 text-center text-[#b0b0b0]">
                    No products yet. Add your first item to get started.
                  </p>
                ) : (
                  latestProducts.map((product) => (
                    <div
                      key={product.id}
                      className="flex items-center justify-between py-4 text-sm"
                    >
                      <div>
                        <p className="text-[15px] font-medium">{product.name}</p>
                        <span className="text-xs text-[#8a8a8a]">
                          {new Intl.DateTimeFormat("en-US", {
                            month: "short",
                            day: "numeric",
                          }).format(new Date(product.createdAt || 0))}
                        </span>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold">
                          ${Number(product.price || 0).toFixed(2)}
                        </p>
                        <span className="text-xs text-[#8a8a8a]">
                          Qty {product.quantity}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            <Card className="bg-[#111111]">
              <CardHeader className="flex flex-row items-center justify-between border-b border-[#1f1f1f] pb-4">
                <div>
                  <CardTitle className="text-lg">Low stock alerts</CardTitle>
                  <CardDescription>Stay ahead of shortages</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {loading ? (
                  <p className="text-center text-[#b0b0b0]">Checking levels...</p>
                ) : lowStock.length === 0 ? (
                  <p className="text-sm text-[#b0b0b0]">
                    All products are sufficiently stocked.
                  </p>
                ) : (
                  lowStock.map((product) => (
                    <div
                      key={product.id}
                      className="rounded-lg border border-[#2e2e2e] bg-[#121212] p-4"
                    >
                      <p className="text-sm font-semibold">{product.name}</p>
                      <p className="text-xs text-[#8a8a8a]">
                        Qty {product.quantity} · ${Number(product.price || 0).toFixed(2)}
                      </p>
                      <Link href="/products" className="text-xs text-[#3b82f6] underline">
                        Restock
                      </Link>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </section>

          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">Categories</h2>
                <p className="text-sm text-[#b0b0b0]">
                  Distribution of products across taxonomy.
                </p>
              </div>
              <Link href="/categories">
                <Button variant="ghost" className="text-xs uppercase tracking-wide">
                  Manage
                </Button>
              </Link>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {loading ? (
                <p className="col-span-full rounded-lg border border-[#262626] bg-[#111111] p-6 text-center text-[#b0b0b0]">
                  Loading categories...
                </p>
              ) : categories.length === 0 ? (
                <p className="col-span-full rounded-lg border border-[#262626] bg-[#111111] p-6 text-center text-[#b0b0b0]">
                  No categories yet. Create one to organize your products.
                </p>
              ) : (
                categories.map((category) => (
                  <Card key={category.id} className="bg-[#111111]">
                    <CardHeader className="border-none pb-2">
                      <CardTitle className="text-base">{category.name}</CardTitle>
                      <CardDescription>
                        Created{" "}
                        {new Intl.DateTimeFormat("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        }).format(new Date(category.createdAt || 0))}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-[#b0b0b0]">Products</p>
                      <p className="text-3xl font-semibold">
                        {categoryProductCounts[category.id] || 0}
                      </p>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;
