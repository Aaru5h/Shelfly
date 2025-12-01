'use client';

import { useEffect, useMemo, useState } from 'react';
import CategoryForm from '@/components/CategoryForm';
import CategoryTable from '@/components/CategoryTable';
import NavBar from '@/components/NavBar';
import { authorizedFetch } from '@/lib/http';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search, Layers, Box, Hash } from 'lucide-react';

const CategoriesPage = () => {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  const ensureAuth = () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) {
      router.replace('/login');
      return false;
    }
    return true;
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const [categoryPayload, productPayload] = await Promise.all([
        authorizedFetch('/categories'),
        authorizedFetch('/products'),
      ]);
      setCategories(categoryPayload);
      setProducts(productPayload);
    } catch (err) {
      setError(err.message || 'Failed to load categories');
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

  const handleCreateCategory = async (payload) => {
    setFormLoading(true);
    setError('');
    try {
      await authorizedFetch('/categories', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      await loadData();
    } catch (err) {
      setError(err.message || 'Unable to add category');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    setDeletingId(categoryId);
    setError('');
    try {
      await authorizedFetch(`/categories/${categoryId}`, {
        method: 'DELETE',
      });
      await loadData();
    } catch (err) {
      setError(err.message || 'Unable to delete category');
    } finally {
      setDeletingId(null);
    }
  };

  const productCounts = useMemo(() => {
    return products.reduce((acc, product) => {
      acc[product.categoryId] = (acc[product.categoryId] || 0) + 1;
      return acc;
    }, {});
  }, [products]);

  const filteredCategories = useMemo(() => {
    return categories.filter(c => 
      c.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [categories, search]);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 font-sans">
      <div className="flex min-h-screen flex-col md:flex-row">
        <NavBar />
        <main className="flex-1 space-y-8 px-6 py-8 md:px-12 md:py-12 overflow-y-auto h-screen">
          <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-white">Categories</h1>
              <p className="mt-2 text-zinc-400">
                Manage your product taxonomy.
              </p>
            </div>
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
              <Input 
                placeholder="Search categories..." 
                className="pl-9 bg-zinc-900/50 border-zinc-800 text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-blue-600"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </header>

          {error && (
            <div className="rounded-lg border border-red-900/50 bg-red-950/20 px-4 py-3 text-sm text-red-200">
              {error}
            </div>
          )}

          {/* Stats */}
          <section className="grid gap-4 md:grid-cols-3">
            <StatsCard 
              title="Total Categories" 
              value={categories.length} 
              icon={Layers}
            />
            <StatsCard 
              title="Total Products" 
              value={products.length} 
              icon={Box}
            />
            <StatsCard 
              title="Avg Products/Cat" 
              value={categories.length ? (Math.round((products.length / categories.length) * 10) / 10) : 0} 
              icon={Hash}
            />
          </section>

          <div className="grid gap-6 lg:grid-cols-[360px_minmax(0,1fr)]">
            <CategoryForm onSubmit={handleCreateCategory} loading={formLoading} />

            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-16 w-full animate-pulse rounded bg-zinc-900/50" />
                ))}
              </div>
            ) : (
              <CategoryTable
                categories={filteredCategories}
                productCounts={productCounts}
                onDelete={handleDeleteCategory}
                deletingId={deletingId}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

function StatsCard({ title, value, icon: Icon }) {
  return (
    <Card className="bg-zinc-900/50 border-zinc-800">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-zinc-400">{title}</CardTitle>
        <Icon className="h-4 w-4 text-zinc-500" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-zinc-100">{value}</div>
      </CardContent>
    </Card>
  );
}

export default CategoriesPage;
